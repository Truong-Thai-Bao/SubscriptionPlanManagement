/**
 * @class BaseRepository
 * @description Generic repo for standard CRUD operations
 */
class BaseRepository {
    /**
     * @param {Object} model
     */
    constructor(model){
        this.model = model;
    }

    /**
     * Fetch all records 
     */
    async findAll(options = {}){
        return await this.model.findAll(options)
    }

    /**
     * Fetch one record by id
     */
    async findById(id,options={}){
        return await this.model.findByPk(id,options);
    }

    /**
     * Create a record
     */
    async create(data,options={}){
        return await this.model.create(data,options);
    }

    /**
     * Update a record by id
     */
    async update(id, updatedData, options = {}){
        const record = await this.model.findByPk(id, options);
        if(!record){
            return null
        }
        return await record.update(updatedData, options);
    }

    /**
     * Delete a record by id
     */
    async delete(id, options = {}){
        const record = await this.model.findByPk(id, options);
        if(!record) return false;
        await record.destroy(options);
        return true;
    }
}

module.exports = BaseRepository;
