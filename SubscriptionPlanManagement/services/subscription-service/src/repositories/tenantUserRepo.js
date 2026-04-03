/**
 * This class to manage user of tenant, be extended from Base repo
 */
const BaseRepository = require('./BaseRepository.js');
const TenantUser = require('../models/TenantUser.js')
const TenantRole = require('../models/TenantRole.js');  

class TenantUserRepo extends BaseRepository {
    constructor(){
        super(TenantUser);
    }

    //Count tenant user by tenant id of subscription
    async countTenantUser(tenantId){
        const countTenant = await this.model.count({
            where : {
                tenant_id : tenantId,
                deleted : 0
            }
        })
        return countTenant;
    }

};

module.exports = new TenantUserRepo;