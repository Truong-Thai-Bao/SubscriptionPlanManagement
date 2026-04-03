/**
 * Feature Management Controller.
 * * This controller handles the lifecycle of system features, including 
 * listing active/all features, creating new functionalities, updating 
 * existing feature metadata, and performing deletions.
 * * @module controllers/featureController
 * @requires services/featureService
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-24
 */

const featureService = require('../services/featureService');


/**
 * Retrieves a list of all features currently marked as active.
 * * @async
 * @function getActiveFeatures
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 with active features or 500 on error.
 */
exports.getActiveFeatures = async (req, res) => {
    const response = await featureService.getAllActiveFeature(req.lang);
    return res.status(response.statusCode).json(response);
};

/**
 * Retrieves all features regardless of their current status.
 * * @async
 * @function getFeatures
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getFeatures = async (req, res) => {
    const response = await featureService.getAllFeatures(req.lang);
    return res.status(response.statusCode).json(response);
};

/**
 * Creates a new system feature.
 * * @async
 * @function createFeature
 * @param {import('express').Request} req - Request containing feature data in body (name, description, etc.).
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 201 on success or 400 if validation fails.
 */
exports.createFeature = async (req, res) => {
    const response = await featureService.createFeature(req.body, req.lang);
    return res.status(response.statusCode).json(response);
};

/**
 * Updates an existing feature's information by its unique identifier.
 * * @async
 * @function updateFeature
 * @param {import('express').Request} req - Request with 'id' in params and updated fields in body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 on success or 404 if feature not found.
 */
exports.updateFeature = async (req, res) => {
    const { id } = req.params;
    const response = await featureService.updateFeature(id, req.body, req.lang);
    return res.status(response.statusCode).json(response);
}

/**
 * Permanently deletes a feature from the system.
 * * @async
 * @function deleteFeature
 * @param {import('express').Request} req - Request containing the feature 'id' in params.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 on success or 404 if feature not found.
 */
exports.deleteFeature = async (req, res) => {
    const { id } = req.params;
    const response = await featureService.deleteFeature(id, req.lang);
    return res.status(response.statusCode).json(response);
}