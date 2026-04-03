/**
 * Data Transfer Object for User Registration.
 * * This class is used to structure and sanitize the incoming registration data 
 * from the request body. It ensures only relevant fields are passed to the 
 * authentication service and handles default values for optional fields.
 * * @class RegisterDto
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-20
 */
class RegisterDto {
    constructor(data) {
        /** @type {number} */
        this.role_id = data.role_id;

        /** @type {string} */
        this.email = data.email;

        /** @type {string} */
        this.password = data.password;

        /** @type {string} */
        // this.phone = data.phone;

        /** @type {string|null} */
        this.organization_name = data.organization_name || null;

        /** @type {string} */
        this.captchaToken = data.captchaToken; // Token từ ReCaptcha

        // this.otp_status = data.otp; 

        /** @type {boolean} */
        this.isAgreed = data.isAgreed; // Checkbox điều khoản

        // Cleanup: Remove any undefined properties to keep the object clean
        Object.keys(this).forEach((key) => {
            if (this[key] === undefined) delete this[key];
        });
    }
}

module.exports = RegisterDto;
