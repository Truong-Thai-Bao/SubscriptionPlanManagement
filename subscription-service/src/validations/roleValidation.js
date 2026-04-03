/**
 * Role Metadata Validation Schema.
 * * This module defines the validation rules for creating and updating system roles.
 * It ensures that role definitions remain concise and descriptive, providing 
 * the necessary guardrails for the primary organizational identity of users.
 * * Key features:
 * - String length enforcement for naming conventions.
 * - Comprehensive description requirements for administrative clarity.
 * - Localized error messaging integration with the i18n layer.
 * * @module validations/RoleValidation
 * @requires joi
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-24
 */

const Joi = require('joi');
const { getMessage } = require('../lang/i18n');

/**
 * Generates a Joi validation schema for Role entities.
 * Focuses on ensuring that role names and descriptions meet the 
 * system's administrative standards.
 * @function roleSchema
 * @param {string} lang - Language code for localized error reporting.
 * @returns {Joi.ObjectSchema}
 */
const roleSchema = (lang) => {
  return Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
      "string.max": getMessage(lang, 'validation.role.name.name_max'),
      "string.min": getMessage(lang, 'validation.role.name.name_min'),
      "any.required": getMessage(lang, 'validation.role.name.name_required'),
      "string.empty": getMessage(lang, 'validation.role.name.name_required'),
    }),

    description: Joi.string().min(5).max(100).required().messages({
      "string.min": getMessage(lang, 'validation.role.description.description_min'),
      "any.required": getMessage(lang, 'validation.role.description.description_required'),
      "string.empty": getMessage(lang, 'validation.role.description.description_required'),
    }),
  }).unknown(true);
};

module.exports = { roleSchema };
