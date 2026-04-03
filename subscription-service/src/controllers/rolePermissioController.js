/**
 * Role-Permission Association Controller.
 * * This controller manages the many-to-many relationship between Roles and Permissions.
 * It provides functionality to assign specific access rights to roles, retrieve 
 * permission sets for authorization checks, and revoke permissions when necessary.
 * * @module controllers/rolePermissionController
 * @requires services/rolePermissionService
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-26
 */

const rolePermissionService = require('../services/rolePermissionService');


/**
 * Retrieves all existing role-permission mappings in the system.
 * * @async
 * @function getRolePermissions
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 with the full mapping list.
 */
exports.getRolePermissions = async (req, res) => {
    const response = await rolePermissionService.getAllRolePermissions(req.lang);
    return res.status(response.statusCode).json(response);
};

/**
 * Retrieves all permissions assigned to a specific role.
 * * This is a critical endpoint for UI rendering based on user rights 
 * and for building the user's authorization context.
 * * @async
 * @function getPermissionsOfRole
 * @param {import('express').Request} req - Params must contain the role 'id'.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 with a list of permissions for the given role.
 */
exports.getPermissionsOfRole = async (req, res) => {
    const { id } = req.params;
    const response = await rolePermissionService.getAllPermissionOfRole(id, req.lang);
    return res.status(response.statusCode).json(response);
};

/**
 * Assigns a new permission to a role.
 * * Creates a new record in the junction table to link a Role to a Permission.
 * * @async
 * @function createPermissionOfRole
 * @param {import('express').Request} req - Body must contain 'role_id' and 'permission_id'.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 201 on successful assignment.
 */
exports.createPermissionOfRole = async (req, res) => {
    const { role_id, permission_id } = req.body;
    const response = await rolePermissionService.createPermissionOfRole(role_id, permission_id, req.lang);
    return res.status(response.statusCode).json(response);
};

/**
 * Updates an existing role-permission assignment.
 * * Typically used to change status or metadata of the relationship record.
 * * @async
 * @function updatePermissionOfRole
 * @param {import('express').Request} req - Params contains junction record 'id'; Body contains updates.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 on success.
 */
exports.updatePermissionOfRole = async (req, res) => {
    const { id } = req.params;
    const response = await rolePermissionService.updatePermissionOfRole(id, req.body, req.lang);
    return res.status(response.statusCode).json(response);
}

/**
 * Revokes a permission from a role.
 * * Removes the association record between the specified role and permission.
 * * @async
 * @function deletePermissionOfRole
 * @param {import('express').Request} req - Body contains 'role_id' and 'permission_id' to be unlinked.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Returns 200 on successful revocation.
 */
exports.deletePermissionOfRole = async (req, res) => {
    const { role_id, permission_id } = req.body;
    const response = await rolePermissionService.deletePermissionOfRole(role_id, permission_id, req.lang);
    return res.status(response.statusCode).json(response);
}
