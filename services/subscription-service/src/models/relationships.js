const sequelize = require('../config/db');

/**
 * This file to create relationships betweent tables in database
 */

const Feature = require('./Feature');
const SubscriptionPolicy = require('./SubscriptionPolicy');
const SubscriptionPlan = require('./SubscriptionPlan');

Feature.hasMany(SubscriptionPlan, { foreignKey: 'feature_id', as: 'plans' });
SubscriptionPlan.belongsTo(Feature, { foreignKey: 'feature_id', as: 'feature' });

SubscriptionPolicy.hasMany(SubscriptionPlan, { foreignKey: 'subscription_policy_id', as: 'plans' });
SubscriptionPlan.belongsTo(SubscriptionPolicy, { foreignKey: 'subscription_policy_id', as: 'policy' });


//Export all
module.exports = {
    sequelize,
    Feature,
    SubscriptionPolicy,
    SubscriptionPlan
};