const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const authorizeRoles = require('../middleware/authorizeRoleMiddleware.js')

/**
 * @module planRoutes
 *  Defining all API endpoints for managing subscription plan
 */

const adminRole = 'Super Admin'


router.get('/',authMiddleware, planController.getAll);// to get all plan
router.get('/:id',authMiddleware, planController.getById);// to get a plan
// router.get('/:id', planController.getPlanById); // get plan by id
router.post('/',authMiddleware,authorizeRoles([adminRole]), planController.create); // to create a plan
router.patch('/deactivate/:id',authMiddleware,authorizeRoles([adminRole]), planController.deactivate); // to deactivate a plan
router.patch('/activate/:id',authMiddleware,authorizeRoles([adminRole]), planController.activate); // to deactivate a plan
router.delete('/:id',authMiddleware,authorizeRoles([adminRole]), planController.delete); // to del a plan
router.put('/:id',authMiddleware,authorizeRoles([adminRole]), planController.update); // to update a plan



module.exports = router;        