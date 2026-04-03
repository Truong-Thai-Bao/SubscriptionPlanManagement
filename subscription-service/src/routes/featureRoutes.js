/**
 * Feature Management Routes Configuration.
 * * This module defines the API endpoints for managing system features. 
 * It supports full CRUD operations, including active feature filtering, 
 * metadata retrieval, and validated creation/update procedures.
 * * @module routes/FeatureRoutes
 * @requires express
 * @requires controllers/FeatureController
 * @requires middleware/ValidatorMiddleware
 * @requires validations/FeatureValidation
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const express = require('express');
const router = express.Router();
const featureController = require('../controllers/featureController');
const validate = require('../middleware/validatorMiddleware');
const { featureSchema } = require('../validations/featureValidation');

/**
 * @route GET /api/features/active
 * @desc Retrieve all features currently marked as active (status: 1).
 * @access Private/Public (Depending on auth middleware)
 */
router.get('/active', featureController.getActiveFeatures);

/**
 * @route GET /api/features
 * @desc Fetch the complete list of all features in the system.
 * @access Private
 */
router.get('/', featureController.getFeatures);

/**
 * @route POST /api/features
 * @desc Create a new system feature with input validation.
 * @access Private/Admin
 */
router.post('/', validate(featureSchema), featureController.createFeature);

/**
 * @route DELETE /api/features/:id
 * @desc Remove a specific feature by its unique identifier.
 * @access Private/Admin
 */
router.delete('/:id', featureController.deleteFeature);

/**
 * @route PUT /api/features/:id
 * @desc Update an existing feature's details with input validation.
 * @access Private/Admin
 */
router.put('/:id', validate(featureSchema), featureController.updateFeature);

module.exports = router;