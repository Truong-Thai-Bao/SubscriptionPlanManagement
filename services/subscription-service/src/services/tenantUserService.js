/**
 * @class tenant user service
 * @description handle CRUD a tenant user
 */
const sequelize = require('../config/db.js');
const tenantUserRepo = require('../repositories/tenantUserRepo.js');
const { generateUniqueUserId, generateRandomPassword } = require('../utils/generateHelper.js');
const BaseService = require('./BaseService.js');
const bcrypt = require('bcrypt');


class tenantUserService extends BaseService{

    constructor(){
        super(tenantUserRepo,'tenant_user',true);
    }
    /**
     * Update the status field of a tenant user
     */
    async changeStatus(id, newStatus,reqUser) {
        //Update status of tenant user, in update has check auth
        return await this.update(id, { status: newStatus },reqUser);
    }
    /**
     * Assign a new role for tenant user
     */
    async assignRole(tenantUserId, roleId,reqUser){
        //Update role of tenant user, in update has check auth
        return await this.update(tenantUserId,{tenant_role_id:roleId},reqUser);
    }

    /**
     * Create a tenant user inside a transaction
     */
    async create(data, reqUser, tenantId) {
        //assign tenant id by tenant id of user who create tenant user 
        data.tenant_id = tenantId;

        //Check if last name available
        if(data.last_name){
            //auto generate user id by last name
            data.user_id = await generateUniqueUserId(data.last_name);
        }

        let pass = data.password;

        //Check if user not type password
        if(!pass){
            //gen password
            pass = generateRandomPassword(8);
        }

        //gen salt to hash pass
        const salt = await bcrypt.genSalt(10);
        //Hashing pass
        const hashPass = await bcrypt.hash(pass,salt); 

        data.password = hashPass;
        return await super.create(data);
    }
    /**
     * Update a tenant user inside a transaction, tenant user not be deleted
     */
    async delete(id, reqUser) {
        const updatedData = {
            deleted : '1',
            status : 'inactive'
        }
        return await super.update(id,updatedData,reqUser);
    }

    

}
module.exports = new tenantUserService;
