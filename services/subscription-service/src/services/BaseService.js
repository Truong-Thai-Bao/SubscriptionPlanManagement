const sequelize = require('../config/db.js');

/**
 * @class BaseService
 * @description Generic service for standard CRUD operations to keep code DRY.
 */
class BaseService {
    /**
     * @param {Object} repository - The specific repository instance
     * @param {string} entityName - i18n namespace for error messages (e.g., 'tenant_user')
     * @param {boolean} isTenantSpecific - to check if this table has tenant_id or not 
     */
    constructor(repository, entityName,isTenantSpecific) {
        this.repository = repository;
        this.entityName = entityName;
        this.isTenantSpecific = isTenantSpecific;
    }

    /**
     * Find a record by ID. Throws 404 error if not found.
     */
    async getById(id,reqUser=null) {
        const record = await this.repository.findById(id);
        //Check if record not existing
        if (!record) {
            const error = new Error(`${this.entityName}.not_found`);
            error.statusCode = 404;
            throw error;
        }

        //Block IDOR
        if(this.isTenantSpecific && reqUser && reqUser.tenant_id){
            if (Number(record.tenant_id) !== Number(reqUser.tenant_id)){
                const err = new Error('auth.forbiden_tenant_access');
                err.statusCode = 403;
                throw err;
            }
        }
        return record;
    }

    /**
     * Retrieve all records
     */
    async getAll(reqUser=null,options = {}) {
        return await this.repository.findAll(options);
    }

    /**
     * Create a new record inside a transaction
     */
    async create(data) {
        const t = await sequelize.transaction();
        try {
            const newRecord = await this.repository.create(data, { transaction: t });
            await t.commit();
            return newRecord;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    /**
     * Update an existing record. Validates existence first.
     */
    async update(id, data,reqUser) {
        // 1. Automatically check if it exists (throws 404 if not)
        await this.getById(id,reqUser); // and throw 403 if use data from another tenant

        //Block fronend send intentionally another tenant_id to change auth 
        if(this.isTenantSpecific) delete data.tenant_id;
        // 2. Proceed with update
        const t = await sequelize.transaction();
        try {
            const updatedRecord = await this.repository.update(id, data, { transaction: t });
            await t.commit();
            return updatedRecord;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    /**
     * Delete a record. Validates existence first.
     */
    async delete(id,reqUser=null) {
        // 1. Check existence
        await this.getById(id,reqUser);

        // 2. Proceed with delete
        const t = await sequelize.transaction();
        try {
            await this.repository.delete(id, { transaction: t });
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    /**
     * Deactivate a record
     */
    async deactivate(id,reqUser=null){
        //Check existence
        await this.getById(id,reqUser);

        //proceed with deactivate
        const t = await sequelize.transaction();
        try{
            await this.repository.update(id,{status:0},{transaction:t});

            await t.commit();
            return true;
        }catch(err){
            await t.rollback();
            throw err;
        }
    }
    /**
     * Activate a record
     */
    async activate(id,reqUser=null){
        //Check existence
        await this.getById(id,reqUser);

        //proceed with activate
        const t = await sequelize.transaction();
        try{
            await this.repository.update(id,{status:1},{transaction:t});

            await t.commit();
            return true;
        }catch(err){
            await t.rollback();
            throw err;
        }
    }
}

module.exports = BaseService;