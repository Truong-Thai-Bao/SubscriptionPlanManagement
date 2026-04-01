const express = require('express');
const router = express.Router();
const tenantUserController = require('../controllers/tenantUserController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const authorizeRoles = require('../middleware/authorizeRoleMiddleware.js');

/**
 * @module tenantUserRoutes
 *  Defining all API endpoints for managing tenant user
 */
const allowRole = 'Organization Admin'

router.post('/',authMiddleware,tenantUserController.create);//create new tenant user
router.get('/',authMiddleware,tenantUserController.getAll); //fetch all tenant users
router.get('/:id',authMiddleware,authorizeRoles([allowRole]),tenantUserController.getById);//get one tenant user
router.put('/:id',authMiddleware,authorizeRoles([allowRole]),tenantUserController.update);//update a tenant user
router.delete('/:id',authMiddleware,authorizeRoles([allowRole]),tenantUserController.delete);//del a tenant user
router.patch('/:id/role',authMiddleware,authorizeRoles([allowRole]),tenantUserController.assignRole); // org admin can assign role for tenant user 
router.patch('/:id/:state',authMiddleware,authorizeRoles([allowRole]),tenantUserController.changeStatus);//chanage status a tenant user

module.exports = router;
