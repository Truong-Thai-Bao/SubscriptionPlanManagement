/**
 * Role-Permission Mapping Validation Schema.
 * * This module defines the validation rules for linking Roles with Permissions.
 * As this handles the Junction Table (Many-to-Many), it strictly enforces 
 * referential integrity requirements at the request level to prevent 
 * invalid mapping attempts.
 * * Key features:
 * - Integer-only enforcement for foreign key identifiers.
 * - Positive number validation to match standard Database Auto-increment IDs.
 * - Dynamic i18n support for cross-border administrative interfaces.
 * * @module validations/RolePermissionValidation
 * @requires joi
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const Joi = require('joi');
const { getMessage } = require('../lang/i18n');

/**
 * Generates a Joi validation schema for Role-Permission associations.
 * Validates the primary keys of both entities to ensure a valid relationship can be formed.
 * @function rolePermissionSchema
 * @param {string} lang - Language code for localized error reporting.
 * @returns {Joi.ObjectSchema}
 */
const rolePermissionSchema = (lang) => {
    return Joi.object({
        role_id: Joi.number().integer().required().messages({
            "number.base": getMessage(lang, 'validation.role_permission.role_id.role_id_number'),
            "number.empty": getMessage(lang, 'validation.role_permission.role_id.role_id_required'),
            "any.required": getMessage(lang, 'validation.role_permission.role_id.role_id_required'),
            "number.positive": getMessage(lang, 'validation.role_permission.role_id.role_id_positive')
        }),

        permission_id: Joi.number().integer().required().messages({
            "number.base": getMessage(lang, 'validation.role_permission.permission_id.permission_id_number'),
            "number.empty": getMessage(lang, 'validation.role_permission.permission_id.permission_id_required'),
            "any.required": getMessage(lang, 'validation.role_permission.permission_id.permission_id_required'),
            "number.positive": getMessage(lang, 'validation.role_permission.permission_id.permission_id_positive')
        }),
    }).unknown(true);
};

module.exports = { rolePermissionSchema };