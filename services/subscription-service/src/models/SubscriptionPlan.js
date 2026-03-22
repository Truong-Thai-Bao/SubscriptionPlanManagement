const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


/**
 * @file SubscriptionPlan.js
 * @description Defines the SubscriptionPlan model. 
 * Represents the commercial pricing plans offered to customers (combining features, policies, and pricing).
 */


/**
 * SubscriptionPlan Model Definition
 */
const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
    // Primary Key: Auto-incrementing unsigned big integer
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        autoIncrement: true, 
        primaryKey: true 
    },
    
    // The display name of the subscription plan (e.g., "Pro Plan")
    name: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
    
    // The target audience or user category for this plan (b2b, b2c, or internal)
    user_type: { 
        type: DataTypes.ENUM('b2b', 'b2c', 'internal'), 
        defaultValue: 'b2b' 
    },
    
    // The billing cycle/frequency for this plan
    payment_term: { 
        type: DataTypes.ENUM('yearly', 'monthly', 'quarterly', 'pay per use'), 
        defaultValue: 'monthly' 
    },
    
    // Foreign Key: Links to the associated Feature model
    feature_id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        allowNull: true 
    },
    
    // Foreign Key: Links to the associated SubscriptionPolicy model
    subscription_policy_id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        allowNull: true 
    },
    
    // The cost of the subscription plan
    price: { 
        type: DataTypes.DECIMAL(15, 2), 
        allowNull: false,
        validate: {
            min: { args: [0], msg: "Price must not be an negative number" },
            isInt: { msg: "Price must be integer" }
        }
    },
    
    // The currency used for the price (defaults to 'VND')
    currency: { 
        type: DataTypes.STRING(10), 
        defaultValue: 'VND' 
    },
    
    // The current version of this specific plan (useful for tracking plan updates)
    current_version: { 
        type: DataTypes.STRING(20), 
        defaultValue: '1.0' 
    },
    
    // The previous version of this plan, if applicable
    previous_version: { 
        type: DataTypes.STRING(20) 
    },
    
    // Indicates whether the plan is currently active and available for purchase
    status: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
}, {
    // Explicitly map this model to the 'subscription_plan' table in the database
    tableName: 'subscription_plan',
    
    // Enable automatic management of timestamp fields
    timestamps: true,
    
    // Map Sequelize's default 'createdAt' behavior to the custom 'created_at' column
    createdAt: 'created_at',
    
    // Map Sequelize's default 'updatedAt' behavior to the custom 'updated_at' column
    updatedAt: 'updated_at'
});

// Export the model to be used in associations and repositories
module.exports = SubscriptionPlan;