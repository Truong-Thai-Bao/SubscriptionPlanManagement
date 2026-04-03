/**
 * Role-Permission Mapping Routes Configuration.
 * * This module defines the API endpoints for managing the associations 
 * between Roles and Permissions. It allows for bulk retrieval, 
 * role-specific permission lookups, and dynamic assignment/removal 
 * of access rights within the RBAC system.
 * * @module routes/RolePermissionRoutes
 * @requires express
 * @requires controllers/RolePermissionController
 * @requires middleware/ValidatorMiddleware
 * @requires validations/RolePermissionValidation
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const express = require('express');
const router = express.Router();
const rolePermissionController = require('../controllers/rolePermissioController');
const validate = require('../middleware/validatorMiddleware');
const { rolePermissionSchema } = require('../validations/rolePermissionValidation');

/**
 * @route GET /api/role-permissions/all
 * @desc Retrieve all role-permission mappings existing in the system.
 * @access Private/Admin
 */
router.get('/all', rolePermissionController.getRolePermissions);

/**
 * @route GET /api/role-permissions/:id
 * @desc Fetch all permissions associated with a specific Role ID.
 * @access Private/Admin
 */
router.get('/:id', rolePermissionController.getPermissionsOfRole);

/**
 * @route DELETE /api/role-permissions
 * @desc Remove a specific permission assignment from a role.
 * @access Private/Admin
 */
router.delete('/', rolePermissionController.deletePermissionOfRole);

/**
 * @route POST /api/role-permissions
 * @desc Create a new mapping between a Role and a Permission with validation.
 * @access Private/Admin
 */
router.post('/', validate(rolePermissionSchema), rolePermissionController.createPermissionOfRole);

/**
 * @route PUT /api/role-permissions/:id
 * @desc Update an existing role-permission association record.
 * @access Private/Admin
 */
router.put('/:id', validate(rolePermissionSchema), rolePermissionController.updatePermissionOfRole);

module.exports = router;