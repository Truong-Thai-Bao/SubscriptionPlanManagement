/**
 * Authentication Routes Configuration.
 * * This module defines the API endpoints for user authentication and 
 * account management, including registration with validation, OTP 
 * lifecycle, and login procedures.
 * * @module routes/AuthRoutes
 * @requires express
 * @requires controllers/AuthController
 * @requires middleware/ValidatorMiddleware
 * @requires validations/AuthValidation
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validatorMiddleware');
const { registerSchema } = require('../validations/authValidation');

/**
 * @route POST /api/auth/register
 * @desc Register a new user with input validation.
 * @access Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route POST /api/auth/send-otp
 * @desc Trigger an OTP code to be sent to the user's email/phone.
 * @access Public
 */
router.post('/send-otp', authController.sendOtp);

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify the OTP code provided by the user.
 * @access Public
 */
router.post('/verify-otp', authController.OTPVerification);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user credentials and return a session/token.
 * @access Public
 */
router.post('/login', authController.login); 

module.exports = router;