const express = require('express');
const router = express.Router();
const tenantRoleController = require('../controllers/tenantRoleController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const authorizeRoles= require('../middleware/authorizeRoleMiddleware.js');


/**
 * @module tenantRoleRoutes
 *  Defining all API endpoints for managing tenant user
 */

const allowRole = 'Organization Admin'


router.post('/',authMiddleware,authorizeRoles([allowRole]),tenantRoleController.create);//create new tenant user
router.get('/',authMiddleware,tenantRoleController.getAll); //fetch all tenant users
router.get('/:id',authMiddleware,authorizeRoles([allowRole]),tenantRoleController.getById);//get one tenant user
router.put('/:id',authMiddleware,authorizeRoles([allowRole]),tenantRoleController.update);//update a tenant user
router.delete('/:id',authMiddleware,authorizeRoles([allowRole]),tenantRoleController.delete);//del a tenant user


module.exports = router;

