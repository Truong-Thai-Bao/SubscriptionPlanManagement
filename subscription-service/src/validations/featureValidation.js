/**
 * Feature Metadata Validation Schema.
 * * This module defines the validation rules for creating and updating system features.
 * Since features in Suri LMS Cloud can hold diverse configuration values, 
 * this schema ensures that metadata remains consistent and usable by the engine.
 * * Key features:
 * - Dynamic data type handling for 'feature_value'.
 * - Content integrity checks for both primitive types and JSON objects.
 * - Multi-language support for specific validation constraints.
 * * @module validations/FeatureValidation
 * @requires joi
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const Joi = require("joi");
const { getMessage } = require("../lang/i18n");

/**
 * Generates the validation schema for Feature entities.
 * Implements a custom validator for 'feature_value' to handle polymorphic data.
 * @function featureSchema
 * @param {string} lang - Language code for localized error messages.
 * @returns {Joi.ObjectSchema}
 */
const featureSchema = (lang) => {
    return Joi.object({
        name: Joi.string().min(3).max(40).required().messages({
            "string.max": getMessage(lang, 'validation.feature.name.name_max'),
            "string.min": getMessage(lang, 'validation.feature.name.name_min'),
            "any.required": getMessage(lang, 'validation.feature.name.name_required'),
            "string.empty": getMessage(lang, 'validation.feature.name.name_required')
        }),

        description: Joi.string().min(5).max(100).required().messages({
            "string.min": getMessage(lang, 'validation.feature.description.description_min'),
            "any.required": getMessage(lang, 'validation.feature.description.description_required'),
            "string.empty": getMessage(lang, 'validation.feature.description.description_required')
        }),

        value_type: Joi.string().min(3).max(100).required().messages({
            "string.min": getMessage(lang, 'validation.feature.value_type.value_type_min'),
            "any.required": getMessage(lang, 'validation.feature.value_type.value_type_required'),
            "string.empty": getMessage(lang, 'validation.feature.value_type.value_type_required')
        }),

        feature_value: Joi.any().required().custom((value, helpers) => {
            if (typeof value === 'string' && value.trim().length < 5) {
                return helpers.message(getMessage(lang, 'validation.feature.feature_value.feature_value_min'));
            }
            // Nếu là object mà trống rỗng
            if (typeof value === 'object' && Object.keys(value).length === 0) {
                return helpers.message("Object JSON không được để trống");
            }
            return value;
        }).messages({
            "any.required": getMessage(lang, 'validation.feature.feature_value.feature_value_required')
        })
    }).unknown(true);
};

module.exports = { featureSchema };