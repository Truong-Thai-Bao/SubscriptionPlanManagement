/**
 * Role Management Routes Configuration.
 * * This module defines the API endpoints for managing User Roles. 
 * It handles the full CRUD lifecycle, ensuring that role definitions 
 * are validated before being persisted to the RBAC system.
 * * @module routes/RoleRoutes
 * @requires express
 * @requires controllers/RoleController
 * @requires middleware/ValidatorMiddleware
 * @requires validations/RoleValidation
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const validate = require('../middleware/validatorMiddleware');
const { roleSchema } = require('../validations/roleValidation');

/**
 * @route GET /api/roles
 * @desc Fetch all roles available in the system.
 * @access Private/Admin
 */
router.get('/', roleController.getRoles);

/**
 * @route POST /api/roles
 * @desc Create a new user role with schema validation.
 * @access Private/Admin
 */
router.post('/', validate(roleSchema), roleController.createRole);

/**
 * @route PUT /api/roles/:id
 * @desc Update an existing role's metadata with schema validation.
 * @access Private/Admin
 */
router.put('/:id', validate(roleSchema), roleController.updateRole);

/**
 * @route DELETE /api/roles/:id
 * @desc Permanently remove a role from the system.
 * @access Private/Admin
 */
router.delete('/:id', roleController.deleteRole);

module.exports = router;