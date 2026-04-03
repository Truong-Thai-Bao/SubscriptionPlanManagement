const sequelize = require('../config/db');

/**
 * @file relationships.js
 * @description Centralized file to define all database associations (relationships) between models.
 */

const Feature = require('./Feature');
const SubscriptionPolicy = require('./SubscriptionPolicy');
const SubscriptionPlan = require('./SubscriptionPlan');
const FeatureSubscription = require('./Feature-Subscription.js'); // Đổi tên biến cho đúng chính tả
const Subscription = require('./Subscription.js');
const Tenant = require('./Tenant.js');
const ErrorLog = require('./ErrorLog.js');
const User = require('./User.js');
const Role = require('./Role.js');
const SubscriptionState = require('./SubscriptionState.js');
const TenantRole = require('./TenantRole.js');
const TenantUser = require('./TenantUser.js');

// ==========================================
// Many-to-Many: Feature <-> SubscriptionPlan
// ==========================================
Feature.belongsToMany(SubscriptionPlan, { 
    through: FeatureSubscription,
    foreignKey: 'feature_id', 
    otherKey: 'subscription_plan_id',
    as: 'plans' 
});

SubscriptionPlan.belongsToMany(Feature, { 
    through: FeatureSubscription,
    foreignKey: 'subscription_plan_id', 
    otherKey: 'feature_id',
    as: 'features' 
});

// ==========================================
// One-to-Many: SubscriptionPolicy <-> SubscriptionPlan
// ==========================================
SubscriptionPlan.belongsTo(SubscriptionPolicy, { foreignKey: 'subscription_policy_id', as: 'policy' });
SubscriptionPolicy.hasMany(SubscriptionPlan, { foreignKey: 'subscription_policy_id', as: 'plans' });


// ==========================================
// One-to-Many: SubscriptionPlan <-> Subscription
// ==========================================
Subscription.belongsTo(SubscriptionPlan, { foreignKey: 'subscription_plan_id', as: 'plan' });
SubscriptionPlan.hasMany(Subscription, { foreignKey: 'subscription_plan_id', as: 'subscriptions' });

// ==========================================
// One-to-Many: Tenant <-> Subscription
// ==========================================
Subscription.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Tenant.hasMany(Subscription, { foreignKey: 'tenant_id', as: 'subscriptions' });

// ==========================================
// One-to-Many: Subscription State <-> Subscription
// ==========================================
Subscription.belongsTo(SubscriptionState,{foreignKey:'subscription_state_id', as:'subscription_state'})
SubscriptionState.hasMany(Subscription,{foreignKey:'subscription_state_id',as:'subscriptions'})


// ==========================================
// One-to-Many: Role <-> User
// ==========================================
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

// ==========================================
// One-to-Many: User <-> ErrorLog
// ==========================================
ErrorLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(ErrorLog, { foreignKey: 'user_id', as: 'error_logs' });

// ==========================================
// One-to-Many: Tenant User <-> Tenant Role
// ==========================================
TenantRole.hasMany(TenantUser,{foreignKey:'tenant_role_id',as:"tenant_role"});
TenantUser.belongsTo(TenantRole,{foreignKey:'tenant_role_id',as:'tenant_user'})


// ==========================================
// EXPORT ALL MODELS
// ==========================================
module.exports = {
    sequelize,
    Feature,
    SubscriptionPolicy,
    SubscriptionPlan,
    FeatureSubscription,
    Subscription,
    Tenant,
    ErrorLog,
    User,
    Role
};