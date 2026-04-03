/**
 * Authentication Validation Schemas.
 * * This module defines the structural and content requirements for authentication
 * requests using Joi. It ensures that incoming data for registration and login 
 * conforms to business rules before reaching the service layer.
 * * Key features:
 * - Dynamic localization of error messages via i18n.
 * - Complex conditional validation (e.g., Organization requirement based on Role).
 * - Strong password complexity enforcement (Regex).
 * - Legal compliance check (isAgreed).
 * * @module validations/AuthValidation
 * @requires joi
 * @requires constants/SystemRoleConstants
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const Joi = require('joi');
const ROLES = require('../Constants/systemRoleConstants');
const { getMessage } = require("../lang/i18n");

/**
 * Generates the validation schema for user registration.
 * Includes conditional requirements for organization-level administrators.
 * @function registerSchema
 * @param {string} lang - Language code for localized validation messages.
 * @returns {Joi.ObjectSchema} The compiled Joi schema for registration.
 */
const registerSchema = (lang) => {
    return Joi.object({

        email: Joi.string().min(10).max(100).email().required().messages({
            'string.min': getMessage(lang, "validation.register.email.email_min"),
            'string.email': getMessage(lang, "validation.register.email.email_format"),
            'any.required': getMessage(lang, "validation.register.email.email_required"),
            'string.empty': getMessage(lang, "validation.register.email.email_required")
        }),

        password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')).required().messages({
            'string.min': getMessage(lang, "validation.register.password.password_min"),
            'string.pattern.base': getMessage(lang, "validation.register.password.password_complexity"),
            'string.empty': getMessage(lang, "validation.register.password.password_required"),
            'any.required': getMessage(lang, "validation.register.password.password_required")
        }),

        role_id: Joi.number().integer().required().messages({
            'any.required': getMessage(lang, "validation.register.role_id.role_required"),
            'string.empty': getMessage(lang, "validation.register.role_id.role_required")
        }),

        // phone: Joi.string().max(20).required().messages({
        //     'string.max': getMessage(lang, "validation.register.phone.phone_max"),
        //     'any.required': getMessage(lang, "validation.register.phone.phone_required"),
        //     'string.empty': getMessage(lang, "validation.register.phone.phone_required")
        // }),

        organization_name: Joi.string().min(6).max(100)
            .when('role_id', {
                is: ROLES.ORGANIZATION_ADMIN, // Nhớ check lại biến ROLES hay SYSTEM_ROLES nhé
                then: Joi.required(), // Bắt buộc và không được rỗng (vì không có .allow ở đây)
                otherwise: Joi.optional().allow(null, '') // Các role khác thì thoải mái
            })
            .messages({
                'string.min': getMessage(lang, "validation.register.organization_name.name_min"),
                'any.required': getMessage(lang, "validation.register.organization_name.name_required"),
                'string.empty': getMessage(lang, "validation.register.organization_name.name_required")
            }),

        // otp_status: Joi.boolean().required().messages({
        //     'any.required': getMessage(lang, "validation.register.otp.otp_require")
        // }),

        captchaToken: Joi.string().required().messages({
            'any.required': getMessage(lang, "validation.register.captcha.captcha_required")
        }),

        isAgreed: Joi.boolean().valid(true).required().messages({
            'any.only': getMessage(lang, "validation.register.isAgreed.only"),
            'any.required': getMessage(lang, "validation.register.isAgreed.only")
        })
    }).unknown(true); // Allows additional fields not explicitly defined
}

// PHẢI CÓ DÒNG NÀY Ở CUỐI FILE
module.exports = { registerSchema };