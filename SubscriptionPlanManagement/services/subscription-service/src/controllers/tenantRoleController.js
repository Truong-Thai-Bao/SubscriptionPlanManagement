const sequelize = require('../config/db.js');
const tenantRoleService = require('../services/tenantRoleService.js');
const BaseController = require('./BaseController.js');

/**
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
class TenantRoleController extends BaseController {
    constructor() {
        super(tenantRoleService,'tenant_role');
    }

}

module.exports = new TenantRoleController;