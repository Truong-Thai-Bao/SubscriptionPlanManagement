/**
 * Subscription Log Model Definition.
 * * This model represents the 'subscription_log' table, used for auditing and 
 * tracking activities related to user subscriptions. It stores historical 
 * records of plan changes, payments, or system-triggered subscription events.
 * * @module models/SubscriptionLog
 * @requires sequelize
 * @requires config/database
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * SubscriptionLog Schema.
 * * @typedef {Object} Subcription_log
 * @property {number} id - Unique identifier (BIGINT, Primary Key).
 * @property {string} log_entry - Detailed content of the log (TEXT).
 * @property {string} category - Classification of the log (e.g., 'Payment', 'StatusChange').
 * @property {string} entity - The specific entity being logged (e.g., 'SubscriptionPlan').
 * @property {number} user_id - Reference to the User associated with this log entry.
 */
const Subcription_log = sequelize.define('Subcription_log', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: false
    },
    log_entry: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    entity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    }
}, {
    tableName: 'subscription_log',
    timestamps: false
});

module.exports = Subcription_log;