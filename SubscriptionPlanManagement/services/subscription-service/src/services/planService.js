const planRepo = require('../repositories/planRepository.js');
const featureRepository = require('../repositories/featureRepository.js');
const policyRepository = require('../repositories/policyRepository.js');
const featureSubscriptionRepository = require('../repositories/featureSubscriptionRepository.js');
const sequelize = require('../config/db.js');
const subscriptionRepository = require('../repositories/subscriptionRepository.js');
const Op = require('sequelize');
const checkActiveSubscriber = require('../repositories/subscriptionRepository.js');
const BaseService = require('./BaseService.js');
const planRepository = require('../repositories/planRepository.js');

/**
 * @class PlanService
 * @description Handles complex business logic for subscription plans, including 
 * feature parsing, file system operations for JSON configs, and versioning.
 */
class PlanService extends BaseService {
    /**
     * Creates a new subscription plan along with its associated policy and features.
     * Handles complex logic for features: 
     * - If 1 feature: Saves directly to the database.
     * - If >1 feature: Saves as a JSON file and stores the file path in the database.
     * 
     * @param {Object} data - The payload containing plan, policy, and feature details.
     * @returns {Promise<Object>} The newly created subscription plan.
     * @throws {Error} If database insertion or file system operations fail.
    */

    constructor(){
        super(planRepository,'plan',false);
    }

    //format policy data
    policyData(data) {
        return {
            max_days: parseInt(data.max_days, 10) || 0,
            max_users: parseInt(data.max_users, 10) || 0,
            max_storage: parseInt(data.max_storage, 10) || 0,
            max_courses: parseInt(data.max_courses, 10) || 0,
            ai_tokens: parseInt(data.ai_tokens, 10) || 0,
            grace_period: parseInt(data.grace_period, 10) || 0
        };
    }

    //format plan data
    planData(data, policyId) {
        return {
            name: data.name,
            user_type: data.user_type || 'b2b',
            payment_term: data.payment_term,
            currency: data.currency || 'VND',
            price: parseFloat(data.price) || 0,
            status: data.status !== undefined ? parseInt(data.status) : 1,
            current_version: data.version || '1.0',
            subscription_policy_id: policyId
        };
    }

    //format feature key by feature name
    formatFeatureKey(name){
        const splitted = name.toUpperCase().split(" ");
        return splitted.join('_');
    }


    // 1. Create new plan (V1.0)
    // ==========================================
    async create(data) {
        //get all features
        const features = data.features_json || [];
        const t = await sequelize.transaction();
        
        try {
            //create new policy
            const policy = await policyRepository.create(this.policyData(data), { transaction: t });
            //create new plan
            const plan = await planRepo.create(this.planData(data, policy.id), { transaction: t });
            //loop through feature of features to create each feature and feature-subscription table
            for (const feature of features) {
                const newFeature = await featureRepository.create({
                    ...feature,
                    name: feature.feature_name || feature.name,
                    feature_key: feature.feature_key || this.formatFeatureKey(feature.feature_name),
                }, { transaction: t });

                await featureSubscriptionRepository.create({
                    subscription_plan_id: plan.id,
                    feature_id: newFeature.id
                }, { transaction: t });
            }
            //store all in db
            await t.commit();
            return plan;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // 2. Update plan
    async update(oldPlanId, newData) {
        //get all features
        const features = newData.features_json || [];
        const t = await sequelize.transaction();
        
        try {
            // 1. Check old plan
            const oldPlan = await planRepo.findById(oldPlanId);
            if (!oldPlan) throw new Error("plan.old_plan_not_found");

            //Cal version 
            const oldVersion = parseFloat(oldPlan.current_version) || 1.0;
            const newVersion = (oldVersion + 0.1).toFixed(1);

            // 2. Deactivate old plan
            await this.deactivate(oldPlanId, { transaction: t });

            // 3. create new policy
            const newPolicy = await policyRepository.create(this.policyData(newData), { transaction: t });

            // 4. Create new plan
            newData.version = newVersion.toString();
            const planDataToCreate = this.planData(newData, newPolicy.id);
            planDataToCreate.previous_version = oldPlan.current_version; // Link về version cũ

            const newPlan = await planRepo.create(planDataToCreate, { transaction: t });

            // 5.Map feature
            for (const feature of features) {
                let currentFeatureId = null;
                // If old feature , update
                if (feature.feature_key) {
                    //find feature by feature key
                    const existingFeature = await featureRepository.model.findOne({
                        where: { feature_key: feature.feature_key },
                        transaction: t 
                    });
                    //If exist feature
                    if (existingFeature) {
                        currentFeatureId = existingFeature.id;
                        console.log(currentFeatureId);
                        //update feature
                        await featureRepository.update(currentFeatureId, {
                            ...feature,
                            name: feature.feature_name || feature.name
                        }, { transaction: t });
                    }
                }

                // If new feature
                if (!currentFeatureId) {
                    //create new feature
                    const newFeature = await featureRepository.create({
                        ...feature,
                        name: feature.feature_name || feature.name,
                        //create guid feature key
                        feature_key: this.formatFeatureKey(feature.feature_name)
                    }, { transaction: t });
                    
                    currentFeatureId = newFeature.id;
                }

                // Insert into intermediate table
                await featureSubscriptionRepository.create({
                    subscription_plan_id: newPlan.id,
                    feature_id: currentFeatureId
                }, { transaction: t });
            }
            
            await t.commit();
            return newPlan;
            
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    /**
     * Deactivate sub plan 
     */

    async deactivate(id, options = {}){
        const plan = await planRepo.findById(id, options);
        if(!plan){
            // Cannot find plan
            throw new Error('plan.not_found');
        }
        await planRepo.update(id, {status : 0}, options);
        return true;
    }
    /**
     * Activate sub plan 
     */

    async activate(id, options = {}){
        const plan = await planRepo.findById(id, options);
        if(!plan){
            // Cannot find plan
            throw new Error('plan.not_found');
        }
        await planRepo.update(id, {status : 1}, options);
        return true;
    }

    

    /**
     * Delete plan
     */
    async delete(id){
        const plan = await planRepo.findById(id);
        if(!plan){
            // cannot find plan
            const err =  new Error('plan.not_found');
            err.statusCode = 404;
            //throw err to errorHandler
            throw err;
        }
        const checkActive = await subscriptionRepository.checkActiveSubscribers(id);
        
        if(checkActive){
            const err =  new Error('plan.validation.not_delete');
            err.statusCode = 400;
            //throw err to errorHandler
            throw err;
        }
        await planRepo.delete(id);
        return true
    }



    /**
     * Retrieve all subscription plans for the frontend.
     * @returns {Promise<Array>} List of subscription plans.
     */
    async getAll() {
        const plans = await planRepo.getAllPlans();

        return plans.map(p => {
            //convert plan to json 
            const plan = p.toJSON();

            //fotmat infor 
            const formattedPlan = {
                id: plan.id,
                name: plan.name,
                user_type: plan.user_type,
                currency: plan.currency,
                price: parseFloat(plan.price) || 0,
                current_version: plan.current_version,
                payment_term : plan.payment_term,
                status: plan.status ? 1 : 0,
            };

            return formattedPlan;
        })
    }

    /**
     * Retrieve a specific plan by its ID.
     * @param {number|string} planId - ID of the plan to retrieve.
     * @returns {Promise<Object>} The subscription plan.
     */
    async getById(planId) {
        //Check if plan is existing
        const plan = await planRepo.findById(planId);
        if(!plan){
            // cannot find plan
            const err =  new Error('plan.not_found');
            err.statusCode = 404;
            //throw err to errorHandler
            throw err;
        }

        let features_json = []
        //get feature id by planId
        const featureIds = await featureSubscriptionRepository.getFeatureIdsByPlanId(planId);

        for(let id of featureIds){
            //get feature by find id
            features_json.push(await featureRepository.findById(id));
        }

        const formattedPlan = {
            //fotmat infor 
            id: plan.id,
            name: plan.name,
            user_type: plan.user_type,
            currency: plan.currency,
            payment_term : plan.payment_term,
            price: parseFloat(plan.price) || 0,
            current_version: plan.current_version,
            status: plan.status ? 1 : 0,
            
            // Columns from  policy table
            max_days: plan.policy ? plan.policy.max_days : 0,
            max_users: plan.policy ? plan.policy.max_users : 0,
            max_courses: plan.policy ? plan.policy.max_courses : 0,
            max_storage: plan.policy ? plan.policy.max_storage : 0,
            ai_tokens: plan.policy ? plan.policy.ai_tokens : 0,
            grace_period : plan.grace_period,

            //Features of this plan
            features_json : features_json
        };
        
        return formattedPlan;
    }
}

module.exports = new PlanService();