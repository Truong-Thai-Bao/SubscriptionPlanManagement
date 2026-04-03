const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * @file SubscriptionPolicy.js
 * @description Defines the SubscriptionPolicy model. 
 * Represents the usage limits and constraints (e.g., max users, storage, tokens) applied to a subscription plan.
 */

/**
 * SubscriptionPolicy Model Definition
 */
const SubscriptionPolicy = sequelize.define('SubscriptionPolicy', {
    // Primary Key: Auto-incrementing unsigned big integer
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        autoIncrement: true, 
        primaryKey: true 
    },
    
    // Maximum duration (in days) the policy is valid
    max_days: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0,
        validate: {
            min: { args: [0], msg: "policy.validation.max_days_min" },
            isInt: { msg: "policy.validation.max_days_int" }
        }
    },
    
    // Maximum number of users allowed under this policy
    max_users: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0,
        validate: {
            min: { args: [0], msg: "policy.validation.max_users_min" },
            isInt: { msg: "policy.validation.max_users_int" }
        }
    },
    
    // Maximum storage capacity allowed (typically in GB or MB)
    max_storage: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0, 
        comment: 'In GB/MB',
        validate: {
            min: { args: [0], msg: "policy.validation.max_storage_min" },
            isInt: { msg: "policy.validation.max_storage_int" }
        }
    },
    
    // Maximum number of courses that can be created/accessed
    max_courses: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0,
        validate: {
            min: { args: [0], msg: "policy.validation.max_courses_min" },
            isInt: { msg: "policy.validation.max_courses_int" }
        }
    },
    
    // Number of AI tokens allocated for usage
    ai_tokens: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0,
        validate: {
            min: { args: [0], msg: "policy.validation.ai_tokens_min" },
            isInt: { msg: "policy.validation.ai_tokens_int" }
        }
    },
    
    // Grace period (in days) granted after the subscription expires
    grace_period: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0,
        validate: {
            min: { args: [0], msg: "policy.validation.grace_period_min" },
            isInt: { msg: "policy.validation.grace_period_int" }
        }
    },
    
    // Indicates whether the policy is currently active (true) or disabled (false)
    status: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
}, {
    // Explicitly map this model to the 'subscription_policy' table in the database
    tableName: 'subscription_policy',
    
    // Enable automatic management of timestamp fields
    timestamps: true,
    
    // Map Sequelize's default 'createdAt' behavior to the custom 'created_at' column
    createdAt: 'created_at',
    
    // Map Sequelize's default 'updatedAt' behavior to the custom 'updated_at' column
    updatedAt: 'updated_at'
});

// Export the model to be used in associations and repositories
module.exports = SubscriptionPolicy;