/**
 * Role Model Definition.
 * * This model represents the 'role' table, which defines user groups or 
 * access levels (e.g., ADMIN, TEACHER, STUDENT). Roles are used as 
 * containers for multiple Permissions in the RBAC system.
 * * @module models/Role
 * @requires sequelize
 * @requires config/database
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Role Schema.
 * * @typedef {Object} Role
 * @property {number} id - Unique identifier (BIGINT, Primary Key).
 * @property {string} name - Unique name of the role (e.g., "ADMIN").
 * @property {string} description - Brief explanation of the role's purpose.
 * @property {number} status - Status of the role (1 for Active, 0 for Inactive).
 */
const Role = sequelize.define('Role', {
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
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: 'role',
    timestamps: false
});

module.exports = Role;