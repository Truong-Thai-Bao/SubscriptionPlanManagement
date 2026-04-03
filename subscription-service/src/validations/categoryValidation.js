const Joi = require("joi");
const { getMessage } = require("../lang/i18n");

const categorySchema = (lang) => {
    return Joi.object({
        name: Joi.string().min(3).max(40).required().messages({
            "string.max": getMessage(lang, 'validation.category.name.name_max'),
            "string.min": getMessage(lang, 'validation.category.name.name_min'),
            "any.required": getMessage(lang, 'validation.category.name.name_required'),
            "string.empty": getMessage(lang, 'validation.category.name.name_required')
        }),

        parent_id: Joi.number().integer().required().messages({
            "number.base": getMessage(lang, 'validation.category.parent.parent_number'),
            "number.empty": getMessage(lang, 'validation.category.parent.parent_required'),
            "any.required": getMessage(lang, 'validation.category.parent.parent_required')
        }),

        description: Joi.string().min(5).required().messages({
            "string.min": getMessage(lang, 'validation.category.description.description_min'),
            "any.required": getMessage(lang, 'validation.category.description.description_required'),
            "string.empty": getMessage(lang, 'validation.category.description.description_required')
        }),


    }).unknown(true);
};

module.exports = { categorySchema };