/**
 * Permission Model Definition.
 * * This model represents the 'permission' table, which defines specific actions 
 * allowed within the system (e.g., Create, Read, Update, Delete). 
 * Each permission is typically linked to a specific Feature.
 * * @module models/Permission
 * @requires sequelize
 * @requires config/database
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Permission Schema.
 * * @typedef {Object} Permission
 * @property {number} id - Unique identifier (BIGINT, Primary Key).
 * @property {string} name - Unique name of the permission (e.g., "USER_CREATE").
 * @property {string} description - Brief explanation of what this permission allows.
 * @property {string} action - The specific action type (e.g., "CREATE", "VIEW").
 * @property {number} status - Status of the permission (1 for Active, 0 for Inactive).
 * @property {number} feature_id - Foreign key reference to the associated Feature.
 */
const Permission = sequelize.define('Permission', {
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
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    feature_id: {
      type: DataTypes.BIGINT,
      field: "feature_id",
    },
}, {
    tableName: 'permission',
    timestamps: false
});

module.exports = Permission;