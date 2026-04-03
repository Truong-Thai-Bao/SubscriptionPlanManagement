/**
 * Permission Management Routes Configuration.
 * * This module defines the API endpoints for granular access control management. 
 * It handles the full CRUD lifecycle for Permissions, ensuring that each 
 * access rule is validated and mapped correctly within the RBAC system.
 * * @module routes/PermissionRoutes
 * @requires express
 * @requires controllers/PermissionController
 * @requires middleware/ValidatorMiddleware
 * @requires validations/PermissionValidation
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const validate = require('../middleware/validatorMiddleware');
const { permissionSchema } = require('../validations/permissionValidation');

/**
 * @route GET /api/permissions
 * @desc Retrieve a list of all defined permissions in the system.
 * @access Private/Admin
 */
router.get('/', permissionController.getPermission);

/**
 * @route POST /api/permissions
 * @desc Create a new permission entry with strict schema validation.
 * @access Private/Admin
 */
router.post('/', validate(permissionSchema), permissionController.createPermission);

/**
 * @route PUT /api/permissions/:id
 * @desc Update an existing permission's attributes (e.g., name, action).
 * @access Private/Admin
 */
router.put('/:id', validate(permissionSchema), permissionController.updatePermission);

/**
 * @route DELETE /api/permissions/:id
 * @desc Permanently remove a permission from the system.
 * @access Private/Admin
 */
router.delete('/:id', permissionController.deletePermission);

module.exports = router;