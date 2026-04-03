/**
 * Permission Management Controller.
 * * This controller provides endpoints for the administrative management of system 
 * permissions. It allows for the definition of granular access controls that are 
 * mapped to various features and roles within the LMS environment.
 * * @module controllers/permissionController
 * @requires services/permissionService
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-23
 */

const permissionService = require('../services/permissionService');


/**
 * Retrieves a complete list of all defined permissions.
 * * Used primarily in administrative interfaces to assign rights to roles.
 * * @async
 * @function getPermission
 * @param {import('express').Request} req - Express request object containing language preference.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 with the permission list or 500 on system error.
 */
exports.getPermission = async (req, res) => {
    const response = await permissionService.getAllPermissions(req.lang);
    return res.status(response.statusCode).json(response);
};

/**
 * Creates a new granular permission.
 * * Expects specific action definitions (e.g., 'CREATE_USER', 'VIEW_COURSE') 
 * associated with a system feature.
 * * @async
 * @function createPermission
 * @param {import('express').Request} req - Request body should contain 'name', 'action', and 'feature_id'.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 201 on successful creation.
 */
exports.createPermission = async (req, res) => {
    const response = await permissionService.createPermission(req.body, req.lang);
    return res.status(response.statusCode).json(response);
};

/**
 * Updates the details of an existing permission.
 * * Allows modification of permission naming or descriptive actions.
 * * @async
 * @function updatePermission
 * @param {import('express').Request} req - Params must include 'id'; Body contains update fields.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 on success or 404 if the permission ID is invalid.
 */
exports.updatePermission = async (req, res) => {
    const { id } = req.params;
    const response = await permissionService.updatePermission(id, req.body, req.lang);
    return res.status(response.statusCode).json(response);
}

/**
 * Removes a permission from the system.
 * * Note: Deleting a permission may affect roles that currently possess it.
 * * @async
 * @function deletePermission
 * @param {import('express').Request} req - Request containing the permission 'id' in params.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 on successful deletion.
 */
exports.deletePermission = async (req, res) => {
    const { id } = req.params;
    const response = await permissionService.deletePermission(id, req.lang);
    return res.status(response.statusCode).json(response);
}