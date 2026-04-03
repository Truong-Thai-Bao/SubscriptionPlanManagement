/**
 * Role Management Controller.
 * * This controller manages the user roles within the system (e.g., Admin, Teacher, Learner).
 * It provides administrative interfaces to define the organizational hierarchy and 
 * serves as the foundation for the RBAC (Role-Based Access Control) system.
 * * @module controllers/roleController
 * @requires services/roleService
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-20
 */

const roleService = require('../services/roleService');

/**
 * Retrieves all defined roles in the system.
 * * Useful for populating dropdowns in user management or permission assignment UIs.
 * * @async
 * @function getRoles
 * @param {import('express').Request} req - Express request object with language preference.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 with the list of roles.
 */
exports.getRoles = async (req, res) => {
    const response = await roleService.getAllRoles(req.lang);
    return res.status(response.statusCode).json(response);
};

/**
 * Creates a new administrative or functional role.
 * * @async
 * @function createRole
 * @param {import('express').Request} req - Request body containing 'name', 'description', and 'status'.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 201 on success or 400 on validation error.
 */
exports.createRole = async (req, res) => {
    const response = await roleService.createRole(req.body, req.lang);
    return res.status(response.statusCode).json(response);
};

/**
 * Updates an existing role's metadata.
 * * @async
 * @function updateRole
 * @param {import('express').Request} req - Params must include 'id'; Body contains updated role details.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 on success or 404 if role is not found.
 */
exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const response = await roleService.updateRole(id, req.body, req.lang);
    return res.status(response.statusCode).json(response);
}

/**
 * Deletes a role from the system.
 * * WARNING: Deleting a role may orphan users assigned to it. 
 * Ensure no active users are linked before performing this action.
 * * @async
 * @function deleteRole
 * @param {import('express').Request} req - Request containing the role 'id' in params.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 on successful deletion.
 */
exports.deleteRole = async (req, res) => {
    const { id } = req.params;
    const response = await roleService.deleteRole(id, req.lang);
    return res.status(response.statusCode).json(response);
}