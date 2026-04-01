const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
 
/**
 * @file Feature.js
 * @description Defines the Feature_Supscription model for the application. 
 */
const Feature_Supscription = sequelize.define('plan_feature',{
    // Primary Key: Auto-incrementing unsigned big integer
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        autoIncrement: true, 
        primaryKey: true 
    },
    // Foreign Key: Links to the associated Subscription Plan model
    subscription_plan_id:{
        type :DataTypes.BIGINT.UNSIGNED,
        allowNull:false,
    },
    // Foreign Key: Links to the associated Feature model
    feature_id:{
        type:DataTypes.BIGINT.UNSIGNED,
        allowNull:false
    },
    // State of this table
    status:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
},{
    // Explicitly map this model to the 'feature_subscription' table in the database
    tableName: 'plan_feature',
    
    // Enable automatic management of timestamp fields
    timestamps: true,
    
    // Map Sequelize's default 'createdAt' behavior to the custom 'created_at' column
    createdAt: 'created_at',
    
    // Map Sequelize's default 'updatedAt' behavior to the custom 'updated_at' column
    updatedAt: 'updated_at'
})
module.exports = Feature_Supscription;