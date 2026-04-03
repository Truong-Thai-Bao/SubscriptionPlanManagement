// src/models/SubscriptionState.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path if needed
const SUBSCRIPTION_STATE = require('../constant/enum.js');
/**
 * @description SubscriptionState model to presenting status of subscription
 */
const SubscriptionState = sequelize.define('SubscriptionState', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type : DataTypes.ENUM(Object.values(SUBSCRIPTION_STATE)),
        allowNull:false
    },
    description: {
        type: DataTypes.TEXT, 
    }
},
    {
    tableName: 'subscription_state',
    timestamps: true, // Automatically manages created_at and updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SubscriptionState;