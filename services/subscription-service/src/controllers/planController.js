const planService = require('../services/planService.js');
const BaseController = require('./BaseController.js');

/**
 * Retrieve a list of all subscription plans.
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
class PlanController extends BaseController {
    constructor() {
        super(planService,'plan');
    }
}

module.exports = new PlanController;