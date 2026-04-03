const categoryService = require('../services/moodle_services/categoryService');
const ResponseDTO = require("../dtos/responseDTO");
const { getMessage } = require("../lang/i18n");

exports.createCategory = async (req, res) => {
    const { name, parent_id, description } = req.body;
    const response = await categoryService.createCategory(name, parent_id, description, req.lang);
    return res.status(response.statusCode).json(response);
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    const response = await categoryService.deleteCategory(id, req.lang);
    return res.status(response.statusCode).json(response);
};

exports.getCategories = async (req, res) => {
    const response = await categoryService.getAllCategory(req.lang);
    return res.status(response.statusCode).json(response);
}