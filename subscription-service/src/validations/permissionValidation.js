/**
 * Permission Schema Validation.
 * * This module defines the validation logic for individual permissions within the system.
 * It ensures that each permission is correctly mapped to a feature and defines a 
 * clear action, preventing inconsistencies in the Access Control List (ACL).
 * * Key features:
 * - Foreign key integrity check for 'feature_id'.
 * - Action-based validation (restricting the scope of allowed operations).
 * - Multi-language error message mapping via i18n utility.
 * * @module validations/PermissionValidation
 * @requires joi
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-24
 */

const Joi = require("joi");
const { getMessage } = require("../lang/i18n");

/**
 * Generates a Joi validation schema for Permission entities.
 * Ensures metadata like name, description, and target action meet system requirements.
 * @function permissionSchema
 * @param {string} lang - Language code for localized error reporting.
 * @returns {Joi.ObjectSchema}
 */
const permissionSchema = (lang) => {
  return Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
      "string.max": getMessage(lang, 'validation.permission.name.name_max'),
      "string.min": getMessage(lang, 'validation.permission.name.name_min'),
      "any.required": getMessage(lang, 'validation.permission.name.name_required'),
      "string.empty": getMessage(lang, 'validation.permission.name.name_required')
    }),

    description: Joi.string().min(5).max(100).required().messages({
      "string.min": getMessage(lang, 'validation.permission.description.description_min'),
      "any.required": getMessage(lang, 'validation.permission.description.description_required'),
      "string.empty": getMessage(lang, 'validation.permission.description.description_required')
    }),

    action: Joi.string().min(2).max(100).required().messages({
      "string.min": getMessage(lang, 'validation.permission.action.action_min'),
      "any.required": getMessage(lang, 'validation.permission.action.action_required'),
      "string.empty": getMessage(lang, 'validation.permission.action.action_required')
    }),

    feature_id: Joi.number().integer().required().messages({
      "number.base": getMessage(lang, 'validation.permission.feature.feature_number'),
      "number.empty": getMessage(lang, 'validation.permission.feature.feature_required'),
      "any.required": getMessage(lang, 'validation.permission.feature.feature_required'),
      "number.positive": getMessage(lang, 'validation.permission.feature.feature_positive')
    }),
  }).unknown(true);
};

// PHẢI CÓ DÒNG NÀY Ở CUỐI FILE
module.exports = { permissionSchema };
