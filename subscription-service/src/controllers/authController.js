/**
 * Authentication Controller.
 * * This controller manages user lifecycle events including OTP generation, 
 * email verification, reCAPTCHA validation, and secure registration/login processes.
 * It acts as the intermediary between the HTTP request and the Auth/OTP Services.
 * * @module controllers/authController
 * @requires services/authService
 * @requires services/otpService
 * @requires services/mailService
 * @requires utils/captchaUtil
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-20
 */


const { registerSchema } = require('../validations/authValidation');
const RegisterDto = require('../dtos/authDto');
const authService = require('../services/authService');
const mailService = require('../services/mailService');
const otpService = require('../services/otpservice');
const { verifyGoogleCaptcha } = require('../utils/captchaUtil');
const ResponseDTO = require('../dtos/responseDTO');
const { getMessage } = require("../lang/i18n");
const ROLES = require('../Constants/systemRoleConstants');

/**
 * Generates and sends a 6-digit OTP to the user's email.
 * * @async
 * @function sendOtp
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a 200 status on success or 400/500 on failure.
 */
//Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      const response_one = new ResponseDTO(getMessage(req.lang, "function.otp.email_require"), 400, false);
      return res.status(response_one.statusCode).json(response_one);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await mailService.sendOTP(email, `${otp}`);
    otpService.saveOTP(email, otp);

    const response = new ResponseDTO(getMessage(req.lang, "function.otp.send_otp_success"), 200, true);

    res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ResponseDTO(getMessage(req.lang, "system.error.system_error"), 500, false);
    res.status(response.statusCode).json(response);
  }
};


/**
 * Verifies the OTP provided by the user via email.
 * * @async
 * @function OTPVerification
 * @param {import('express').Request} req - Request containing 'otp' and 'email' in body.
 * @param {import('express').Response} res - Response object.
 * @returns {Promise<void>}
 */
exports.OTPVerification = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp) {
      const response_one = new ResponseDTO(getMessage(req.lang, "function.otp.otp_require"), 400, false);
      return res.status(response_one.statusCode).json(response_one);
    }

    const otpResult = otpService.verifyAndConsumeEmail(email, otp, req.lang);
    if (otpResult !== true) {
      return res.status(otpResult.statusCode).json(otpResult);
    }

    res.status(200).json(new ResponseDTO(getMessage(req.lang, "function.otp.otp_verified"), 200, true));
  } catch (error) {
    const response = new ResponseDTO(getMessage(req.lang, "system.error.system_error"), 500, false);
    res.status(response.statusCode).json(response);
  }
};

/**
 * Handles new user registration with multi-step validation.
 * * Validation steps:
 * 1. Email check.
 * 2. Google reCAPTCHA verification.
 * 3. Pre-verified email check (via OTP service).
 * * @async
 * @function register
 * @param {import('express').Request} req - Request body must match RegisterDto structure.
 * @param {import('express').Response} res - Response object.
 * @returns {Promise<void>}
 */
exports.register = async (req, res) => {
  try {
    const { email, captchaToken, organization_name, role_id } = req.body;
    
    //CHECK ORGANIZATION EMAIL ID
    if (role_id === ROLES.ORGANIZATION_ADMIN && organization_name !== null) {
      const emailDomain = email.split('@')[1]?.toLowerCase();
      const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
      if (publicDomains.includes(emailDomain)) {
        const result = new ResponseDTO(getMessage(req.lang, "function.register.organization_email_required"), 400, false);
        return res.status(result.statusCode).json(result);
      }
    }

    const isHuman = await verifyGoogleCaptcha(captchaToken);
    if (!isHuman) {
      const response_one = new ResponseDTO(getMessage(req.lang, "function.register.captcha_failed"), 400, false);
      return res.status(response_one.statusCode).json(response_one);
    }

    const verified = otpService.isEmailVerified(email);
    if (!verified) {
      return res.status(400).json(new ResponseDTO(getMessage(req.lang, "function.otp.request_otp"), 400, false));
    }

    // const otpResult = otpService.verifyAndConsumeEmail(email, otp, req.lang);
    // if (otpResult !== true) {
    //   return res.status(otpResult.statusCode).json(otpResult);
    // }
    
    const response = await authService.register(new RegisterDto(req.body), req.lang);

    // otpService.deleteOTP(email);
    if (response.isSuccess) {
      otpService.deleteOTP(email);
    }

    res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ResponseDTO(getMessage(req.lang, "system.error.system_error"), 500, false);
    res.status(response.statusCode).json(response);
  }
};

/**
 * Authenticates a user and returns a JWT.
 * * @async
 * @function login
 * @param {import('express').Request} req - Contains 'loginInput' (email/username) and 'password'.
 * @param {import('express').Response} res - Response object.
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
  try {
    console.log('[AuthController] login called');
    console.log('[AuthController] req.body:', req.body);
    const { loginInput, password } = req.body;
    console.log('[AuthController] Extracted - loginInput:', loginInput, 'password:', '***');
    const response = await authService.login(loginInput, password, req.lang);
    console.log('[AuthController] authService.login returned:', response.statusCode);

    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error('[AuthController] Error in login:', error.message, error.stack);
    const response = new ResponseDTO(getMessage(req.lang, "system.error.system_error"), 500, false);
    res.status(response.statusCode).json(response);
  }
};
