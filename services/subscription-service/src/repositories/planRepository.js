// const { SubscriptionPlan } = require('../models/SubscriptionPlan.js');
// const {SubscriptionPolicy} = require('../models/SubscriptionPolicy.js');
// const {Feature} = require('../models/Feature.js');

const { SubscriptionPlan, SubscriptionPolicy, Feature } = require('../models/relationships.js');

/**
 * @class PlanRepository
 * @description This class for managing database operations related to subscription plan
 * 
 */

class PlanRepository {

    /**
     * Fetch all plans, including their asociated features and policies.
     * Maps the relational data into a flat object for the frontend
     * @returns Array of flattened plan objects
     */

    async getAllPlans() {
        return await SubscriptionPlan.findAll({
            include: [ //join
                { model: Feature, as: 'feature' },
                { model: SubscriptionPolicy, as: 'policy' }
            ]
        });
    }

    /**
     * 
     * @param {number} id  - id of the plan
     * @returns  {object|null} the plan object or null
     */

    async getPlanById(id) {
        return await SubscriptionPlan.findByPk(id, {
            include: [ // join 
                { model: Feature, as: 'feature' },
                { model: SubscriptionPolicy, as: 'policy' }
            ]
        });
    }
    /**
     * Create a new feature record in the database.
     * @param {Object} data - Feature data payload.
     * @returns {Promise<Object>} The created feature instance.
     */
    async createFeature(data) {
        return await Feature.create(data);
    }

    /**
     * Create a new subscription policy record in the database.
     * @param {Object} data - Policy data payload.
     * @returns {Promise<Object>} The created policy instance.
     */
    async createPolicy(data) {
        return await SubscriptionPolicy.create(data);
    }

    /**
     * Create a new subscription plan record in the database.
     * @param {Object} planData - Plan data payload.
     * @returns {Promise<Object>} The created plan instance.
     */
    async createPlan(planData) {
        return await SubscriptionPlan.create(planData);
    }

    /**
     * Update the 'updatedData' field of a specific plan.
     * @param {number|string} id - The ID of the plan.
     * @param {string} updatedData - The version string to set.
     * @returns {Promise<Object|boolean>} The updated plan instance or false if not found.
     */
    async updatePlan(id, updatedData) {
        return await SubscriptionPlan.update(updatedData,{
            where : { id : id }
        });
    }

    /**
     * Permanently delete a plan from the database.
     * Prevents deletion if a foreign key constraint (e.g., active users) is violated.
     * @param {number|string} id - The ID of the plan to delete.
     * @returns {Promise<boolean>} True if deleted successfully.
     * @throws {Error} If the plan is not found or is currently in use.
     */
    async deletePlan(id) {
        return await SubscriptionPlan.destroy({
            where : {id : id}
        })
    }
}

module.exports = new PlanRepository();