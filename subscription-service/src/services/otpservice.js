/**
 * OTP (One-Time Password) Management Service.
 * * This service handles the temporary storage, validation, and lifecycle 
 * of OTP codes. It implements an in-memory storage strategy using JavaScript 
 * Map for high-performance verification during the registration flow.
 * * Key features:
 * - TTL (Time-To-Live) management for OTP expiration.
 * - Multi-stage verification status (unverified -> verified).
 * - Automatic cleanup after successful consumption.
 * * @module services/OTPService
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-22
 */
const otpStore = new Map();
const ResponseDTO = require("../dtos/responseDTO");
const { getMessage } = require("../lang/i18n");

/**
 * Stores a generated OTP in the temporary memory store.
 * @param {string} email - The user's email serving as the unique key.
 * @param {string|number} otp - The 6-digit verification code.
 */
const saveOTP = (email, otp) => {
    const expires = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút
    otpStore.set(email, { otp, expires, verified: false});
};

/**
 * Validates the provided OTP against the stored record.
 * Checks for existence, expiration, and code accuracy.
 * @param {string} email - The key to look up.
 * @param {string} otp - The code provided by the user.
 * @param {string} lang - Language code for error messages.
 * @returns {ResponseDTO|boolean} Returns true if valid, otherwise a ResponseDTO error.
 */
const verifyAndConsumeEmail = (email, otp, lang) => {
    const record = otpStore.get(email);
    if (!record)
        return new ResponseDTO(getMessage(lang, "function.otp.request_otp"), 400, false);
    if (Date.now() > record.expires) {
        otpStore.delete(email);
        return new ResponseDTO(getMessage(lang, "function.otp.expired_otp"), 400, false);
    }
    if (record.otp !== otp)
        return new ResponseDTO(getMessage(lang, "function.otp.wrong_otp"), 400, false);
    
    otpStore.set(email, { ...record, verified: true, expires: Date.now() + 10 * 60 * 1000 });
    return true;
};

/**
 * Removes the OTP record from memory.
 * @param {string} email 
 */
const deleteOTP = (email) => {
    otpStore.delete(email);
};

/**
 * Checks if an email has successfully completed the OTP verification.
 * @param {string} email 
 * @returns {boolean}
 */
const isEmailVerified = (email) => {
    const record = otpStore.get(email);
    return record && record.verified === true;
};

module.exports = { saveOTP, verifyAndConsumeEmail, deleteOTP, isEmailVerified};