/**
 * Subscription Plan Model Definition.
 * * This model represents the 'subscription_plan' table, which defines the 
 * different service tiers available in the system. It maps specific Plans 
 * to their corresponding Features.
 * * @module models/SubscriptionPlan
 * @requires sequelize
 * @requires config/database
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * SubscriptionPlan Schema.
 * * @typedef {Object} Subscription_plan
 * @property {number} id - Unique identifier (BIGINT, Primary Key).
 * @property {string} name - Unique name of the subscription plan (e.g., 'Pro', 'Enterprise').
 * @property {number} feature_id - Foreign key referencing the associated Feature.
 */
const Subscription_plan = sequelize.define('subscription_plan', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    feature_id: {
      type: DataTypes.BIGINT,
      field: "feature_id",
    }
}, {
    tableName: 'subscription_plan',
    timestamps: false
});

module.exports = Subscription_plan;