const { SubscriptionPlan, SubscriptionPolicy, Feature } = require('../models/relationships.js');
const BaseRepository = require('./BaseRepository.js');

/**
 * @class PlanRepository
 * @description This class for managing database operations related to subscription plan
 * 
 */

class PlanRepository extends BaseRepository{

    constructor(){
        super(SubscriptionPlan);
    }

    /**
     * Fetch all plans, including their asociated features and policies.
     * Maps the relational data into a flat object for the frontend
     * @returns Array of flattened plan objects
     */

    async getAllPlans() {
        const options = {
            include: [ //join
                { model: Feature, as: 'features' },
                { model: SubscriptionPolicy, as: 'policy' }
            ]
        }
        return await this.findAll(options);
    }
}

module.exports = new PlanRepository();