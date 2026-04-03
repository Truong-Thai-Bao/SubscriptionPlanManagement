/**
 * Mail Service for System Communications.
 * * This service leverages Nodemailer to handle all outgoing email operations, 
 * specifically focusing on security-related notifications such as OTP 
 * delivery for user registration and password recovery.
 * * @module services/MailService
 * @requires nodemailer
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-22
 */

const nodemailer = require('nodemailer');

class MailService {
    /**
     * Initializes the SMTP transporter using Gmail service credentials.
     * Configuration is pulled from environment variables for security.
     */
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // Mã 16 ký tự App Password
            },
        });
    }

    /**
     * Sends a localized and branded One-Time Password (OTP) email to the user.
     * The email contains a stylized HTML template for better User Experience.
     * @async
     * @param {string} to - The recipient's email address.
     * @param {string|number} otp - The generated verification code.
     * @returns {Promise<Object>} The result of the mail delivery operation.
     * @throws {Error} If the SMTP transporter fails to send the email.
     */
    async sendOTP(to, otp) {
    const mailOptions = {
      from: `"Suri LMS Cloud" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Verification Code for Your Registration',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #333;">Account Verification</h2>
            <p style="font-size: 16px; color: #555;">Thank you for joining <b>Suri LMS Cloud</b>. Please use the following One-Time Password (OTP) to complete your registration:</p>
            <div style="margin: 20px 0; text-align: center;">
                <span style="font-size: 32px; font-weight: bold; color: #6C5CE7; letter-spacing: 5px; padding: 10px 20px; background-color: #f9f9f9; border: 1px dashed #ccc;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 14px; color: #888;">This code is valid for <b>5 minutes</b>. For security reasons, please do not share this code with anyone.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #aaa;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new MailService();