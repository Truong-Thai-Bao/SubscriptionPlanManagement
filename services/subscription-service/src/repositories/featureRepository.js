/**
 * @class FeatureRepository
 * @description This class for managing db operations related to Feature table
 */

const Feature = require('../models/Feature');
const BaseRepository = require('./BaseRepository');

class FeatureRepository extends BaseRepository {
    constructor(){
        super(Feature);
    }

    async isFeatureCreated(featureId){
        const feature = await this.findById(featureId);
        return !!feature;
    }

}

module.exports = new FeatureRepository();