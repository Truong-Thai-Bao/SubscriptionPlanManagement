/**
 * This class to manage role of tenant, be extended from Base repo
 */
const BaseRepository = require('./BaseRepository.js');
const TenantRole = require('../models/TenantRole.js');  

class TenantRoleRepo extends BaseRepository {
    constructor(){
        super(TenantRole);
    }
};

module.exports = new TenantRoleRepo;