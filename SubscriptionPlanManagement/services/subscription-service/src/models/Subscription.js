// src/models/Subscription.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path if needed

/**
 * @description Subscription model representing tenant or user active plans
 */
const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING(100), 
        allowNull: true
    },
    // Foreign Keys (Relationships will be defined in relationships.js)
    subscription_plan_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    tenant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    subscription_state_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    subscription_log_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false // explicitly required per SQL schema
    },
    // Timestamps for subscription period
    start_date: {
        type: DataTypes.DATEONLY, // Maps to SQL DATE (without time)
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    // Flags
    auto_renew: {
        type: DataTypes.BOOLEAN, // Sequelize maps this to TINYINT(1) safely
        defaultValue: true
    }
}, {
    tableName: 'subscription',
    timestamps: true, // Automatically manages created_at and updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Subscription;