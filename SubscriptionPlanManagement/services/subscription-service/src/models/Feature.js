const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
 
/**
 * @file Feature.js
 * @description Defines the Feature model for the application. 
 * Represents individual system features or modules that can be assigned to subscription plans.
 */


/**
 * Feature Model Definition
 */
const Feature = sequelize.define('Feature', {
    // Primary Key: Auto-incrementing unsigned big integer
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        autoIncrement: true, 
        primaryKey: true 
    },
    
    // The display name of the feature (e.g., "Advanced Reporting")
    name: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
    
    // A unique identifier/code for the feature, used for internal programmatic checks
    feature_key: { 
        type: DataTypes.STRING(36), 
        unique: true 
    },
    
    // Detailed explanation of what this feature provides to the user
    description: { 
        type: DataTypes.TEXT 
    },
    
    // The data type of the feature's value (e.g., boolean, integer, string, or json_path)
    value_type: { 
        type: DataTypes.STRING(255), 
        comment: 'boolean, integer, string,' 
    },
    
    // The actual value, limit, or configuration path associated with the feature
    feature_value: { 
        type: DataTypes.STRING(255) 
    },
    
    // Indicates whether the feature is currently active (true) or disabled/deprecated (false)
    status: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
}, {
    // Explicitly map this model to the 'feature' table in the database
    tableName: 'feature',
    
    // Enable automatic management of timestamp fields
    timestamps: true,
    
    // Map Sequelize's default 'createdAt' behavior to the custom 'created_at' column
    createdAt: 'created_at',
    
    // Map Sequelize's default 'updatedAt' behavior to the custom 'updated_at' column
    updatedAt: 'updated_at'
});

// Export the Feature model to be used in associations (index.js) and repositories
module.exports = Feature;