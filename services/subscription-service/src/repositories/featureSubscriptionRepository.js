const BaseRepository = require("./BaseRepository");
const FeatureSubscription = require('../models/Feature-Subscription.js');

/**
 * @class Feature-Subscription 
 * @description This class for managing db operations related to Feature-Subscription table
 */
class FeatureSubscriptionRepository extends BaseRepository{
    constructor(){
        super(FeatureSubscription);
    }
    //Func to fetch all features by one plan id
    async getFeatureIdsByPlanId(planId){
        const records = await this.findAll({
            where:{subscription_plan_id:planId},
            attributes:['feature_id'],
            raw:true
        })
        //return list of features id
        return records.map(record => record.feature_id);
    }
}
module.exports = new FeatureSubscriptionRepository;
