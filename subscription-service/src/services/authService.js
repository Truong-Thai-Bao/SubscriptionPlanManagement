/**
 * Authentication Service.
 * * This service orchestrates the business logic for user identity management.
 * It handles secure registration (hashing), multi-identifier login (email/username),
 * account lockout policies, and session token generation.
 * * @module services/AuthService
 * @requires repositories/UserRepository
 * @requires bcryptjs
 * @requires jsonwebtoken
 * @requires dtos/ResponseDTO
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-16
 */

const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ResponseDTO = require("../dtos/responseDTO");
const { getMessage } = require("../lang/i18n");
const ROLES = require('../Constants/systemRoleConstants');


class AuthService {
  /**
   * Handles new user registration.
   * Checks for existing emails, hashes passwords, and assigns default usernames.
   * @async
   * @param {Object} registerDto - User registration data.
   * @param {string} lang - Language code for localized messages.
   * @returns {Promise<ResponseDTO>}
   */
  async register(registerDto, lang) {
    try {
      console.log('verified99',registerDto)
      // CHECK EMAIL DUPLICATED
      const userExistsEmail = await userRepository.getUserByEmail(registerDto.email);
      console.log('verified18',userExistsEmail)
      if (userExistsEmail)
        return new ResponseDTO(getMessage(lang, "function.register.email_exists"), 400, false);

      // HASH PASSWORD
      const salt = await bcrypt.genSalt(10);
      console.log('verified14',salt)
      const hashedPassword = await bcrypt.hash(registerDto.password, salt);
console.log('verified13',hashedPassword)
      // MAP DATA
      const { password, captchaToken, isAgreed, ...userData } = registerDto;
      const generatedUsername = userData.email.split("@")[0];
console.log('verified12',generatedUsername)
      const finalData = {
        ...userData,
        username: generatedUsername,
        password_hash: hashedPassword,
        name: registerDto.organization_name,
        salt: salt,
      };
      console.log('verified9',finalData)
      const returndata = await userRepository.createUser(finalData);
console.log('verified1',returndata)
      let result;
      if (returndata.role_id === ROLES.ORGANIZATION_ADMIN) {
        result = {
          username: returndata.username,
          email: returndata.email,
          organization_name: returndata.name,
          role_id: returndata.role_id,
          is_blocked: returndata.is_blocked,
          status: returndata.status,
        }
      } else {
        result = {
          username: returndata.username,
          email: returndata.email,
          role_id: returndata.role_id,
          is_blocked: returndata.is_blocked,
          status: returndata.status,
        }
      }
      return new ResponseDTO(getMessage(lang, "function.register.register_success"), 201, true, result);

    } catch (error) {
      console.log('Register error:', error);
      return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
    }
  }

  /**
   * Authenticates user credentials.
   * Supports both email and username login. Implements account lockout
   * after 3 failed attempts and issues JWT upon success.
   * @async
   * @param {string} loginInput - Email or Username.
   * @param {string} password - Plain text password.
   * @param {string} lang - Language code for localized messages.
   * @returns {Promise<ResponseDTO|Object>} JWT Token and User info or error DTO.
   */
  async login(loginInput, password, lang) {
    try {
      console.log('[DEBUG] login() called with:', { loginInput, password: '***' });
      
      if (!loginInput) {
        return new ResponseDTO(getMessage(lang, "authentication.login.require"), 400, false);
      }
      let user;

      if (loginInput.includes("@")) {
        console.log('[DEBUG] Searching by email:', loginInput);
        user = await userRepository.getUserByEmail(loginInput);
      } else {
        console.log('[DEBUG] Searching by username:', loginInput);
        user = await userRepository.getUserByUsername(loginInput);
      }

      console.log('[DEBUG] User found:', user ? { id: user.id, email: user.email, role_id: user.role_id } : 'null');

      if (!user) {
        return new ResponseDTO(getMessage(lang, "authentication.login.wrong_password"), 400, false);
      }

      if (user.is_blocked === true) {
        console.log('[DEBUG] User is blocked');
        return new ResponseDTO(getMessage(lang, "authentication.login.user_blocked"), 403, false);
      }

      //Compare password input and password hash
      console.log('[DEBUG] Comparing passwords...');
      const hashToCompare = await bcrypt.compare(password, user.password_hash);
      console.log('[DEBUG] Password match result:', hashToCompare);
      
      if (!hashToCompare) {
        const currentAttempts = user.login_attempts + 1;
        const updateData = { login_attempts: currentAttempts };

        //Login failed > 3 => block
        if (currentAttempts >= 3) {
          updateData.is_blocked = 1;
        }

        await userRepository.updateUser(user, updateData);

        const messageKey = updateData.is_blocked === 1
          ? "authentication.login.user_blocked"
          : "authentication.login.wrong_password";

        return new ResponseDTO(getMessage(lang, messageKey), 400, false);
      }

      //Đăng nhập thành công => reset login_attempts = 0
      if (user.login_attempts > 0) {
        await userRepository.updateUser(user, { login_attempts: 0 });
      }

      console.log('[DEBUG] Generating JWT token...');
      const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      console.log('[DEBUG] Token generated successfully');

      const returnData = {
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role_id: user.role_id
        }
      }
      console.log('[DEBUG] Returning success response');
      return new ResponseDTO(getMessage(lang, "authentication.login.login_success"), 200, true, returnData);
    } catch (error) {
      console.error('[ERROR] Login error:', error.message, error.stack);
      return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
    }
  }


}

module.exports = new AuthService();
