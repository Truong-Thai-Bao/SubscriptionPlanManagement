const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware.js');
const authorizeRoleMiddleware = require('../middleware/authorizeRoleMiddleware.js');


const router = express.Router();

const allowRole = 'Organization Admin'

router.get('/:id/validate-status',authMiddleware,authorizeRoleMiddleware([allowRole]),subscriptionController.validateStatus);
router.get('/:id/validate-feature',authMiddleware,authorizeRoleMiddleware(allowRole),subscriptionController.validateFeature);
router.get('/usage/:tenantId',authMiddleware,authorizeRoleMiddleware([allowRole]),subscriptionController.getUsage);
module.exports = router;