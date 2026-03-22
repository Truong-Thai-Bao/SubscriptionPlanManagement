const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController.js');

/**
 * @module planRoutes
 *  Defining all API endpoints for managing subscription plan
 */

router.get('/', planController.getAllPlans);// to get all plan
// router.get('/:id', planController.getPlanById); // get plan by id
router.post('/', planController.createPlan); // to create a plan
router.patch('/:id/deactivate', planController.deactivatePlan); // to deactivate a plan
router.delete('/:id', planController.deletePlan); // to del a plan
router.put('/:id', planController.updatePlan); // to update a plan



module.exports = router;