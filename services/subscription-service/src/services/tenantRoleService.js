/**
 * @class tenant role service
 * @description handle role a tenant
 */
const sequelize = require('../config/db.js');
const tenantRoleRepo = require('../repositories/tenantRoleRepo.js');
const BaseService = require('./BaseService.js');

class tenantRoleService extends BaseService{

    constructor(){
        super(tenantRoleRepo,'tenant_role',false);
    }
}
module.exports = new tenantRoleService;
