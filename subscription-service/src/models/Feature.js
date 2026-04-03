/**
 * Feature Model Definition.
 * * This model represents the 'feature' table in the database. It stores 
 * system functionality definitions, their keys, types, and values 
 * used for access control and subscription plan configurations.
 * * @module models/Feature
 * @requires sequelize
 * @requires config/database
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Feature Schema.
 * * @typedef {Object} Feature
 * @property {number} id - Unique identifier (BIGINT, Primary Key).
 * @property {string} name - Human-readable name of the feature (Unique).
 * @property {string} description - Detailed explanation of what the feature does.
 * @property {string} feature_key - Internal code/tag for feature identification (CHAR).
 * @property {string} value_type - The data type of the feature's value (e.g., boolean, range).
 * @property {string} feature_value - The actual value or configuration payload for the feature.
 * @property {number} status - Feature availability status (1 for active, default).
 */
const Feature = sequelize.define('Feature', {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    feature_key: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    value_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    feature_value: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: 'feature',
    timestamps: false
});

module.exports = Feature;