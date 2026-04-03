const Subscription = require('../models/Subscription.js');
const SubscriptionPlan = require('../models/SubscriptionPlan.js');
const Feature = require('../models/Feature.js');
const BaseRepository = require('./BaseRepository.js');
const { Op } = require('sequelize');
const SubscriptionState = require('../models/SubscriptionState.js');
const  FeatureSubscription  = require('../models/Feature-Subscription.js');
const SubscriptionPolicy = require('../models/SubscriptionPolicy.js');
/**
 * Subscription Repository
 * This class handles database operations related to the Subscription table
 */
class SubscriptionRepository extends BaseRepository {
    constructor() {
        super(Subscription);
    }

    /**
     * Find an active subscription for a tenant that includes a specific feature
     * * @param {number} tenantId - The ID of the tenant
     * @param {string} status - The status of the subscription (e.g., 'active')
     * @param {string} requiredFeatureKey - The feature key to check
     * @returns {Promise<Object|null>} The subscription object or null
     */
    async checkAccess(tenantId, userId,subId) {
        const isActiveSub = await this.model.findOne({
            where:{
                tenant_id : tenantId,
                user_id : userId,
                id : subId
            },include:[{
                model: SubscriptionState,
                as:'subscription_state',
                where: {
                    name : 'active'
                },
                required:true
            }]   
        })

        return !!isActiveSub;
    }
    async checkFeature(tenantId, userId,subId,featureKey) {
        const isActiveSub = await this.model.findOne({
            where:{
                tenant_id : tenantId,
                user_id : userId,
                id : subId
            },include:[{
                model: SubscriptionPlan,
                as: 'plan',
                required:true,
                include:[{
                    model: Feature,
                    as: 'features',
                    where:{feature_key:featureKey},//Compare feature key
                    required:true
                }]
            }]   
        })

        return !!isActiveSub;
    }



    //Check if ac or inactivate subscriber
    async checkActiveSubscribers(planId){
        const today = new Date();

        const isActiveCount = await this.model.count({
            where:{
                subscription_plan_id:planId,
                end_date:{[Op.gte]:today}
            }
        })

        return isActiveCount > 0
    }


    //get all information tenant usage
    async getInfor(tenantId, userId) {
    const get = await this.model.findOne({
        where: {
            tenant_id: tenantId,
            user_id: userId
        },
        // Chỉ dùng MỘT từ khóa include, bên trong là mảng các object
        include: [
            {
                model: SubscriptionState,
                as: 'subscription_state',
                required: true
            },
            {
                model: SubscriptionPlan,
                as: 'plan',
                required: true,
                include: [{
                    model: SubscriptionPolicy,
                    as: 'policy',
                    required: true
                }]
            }
        ]
    });
    return get;
}

}

module.exports = new SubscriptionRepository();