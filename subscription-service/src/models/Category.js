/**
 * Role Model Definition.
 * * This model represents the 'role' table, which defines user groups or 
 * access levels (e.g., ADMIN, TEACHER, STUDENT). Roles are used as 
 * containers for multiple Permissions in the RBAC system.
 * * @module models/Category
 * @requires sequelize
 * @requires config/database
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Role Schema.
 * * @typedef {Object} Category
 * @property {number} id - Unique identifier (BIGINT, Primary Key).
 * @property {string} name - Unique name of the category (e.g., ".NET Programing").
 * @property {number} moodle_category_id - Unique id of the Moodle (e.g., ".NET Programing").
 * 
 * @property {string} description - Brief explanation of the role's purpose.
 * @property {number} status - Status of the role (1 for Active, 0 for Inactive).
 */

const Category = sequelize.define('Category', {
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
        type: DataTypes.STRING
    },
    moodle_category_id: {
        type: DataTypes.BIGINT,
        autoIncrement: false
    },
    parent_id: {
        type: DataTypes.BIGINT,
        autoIncrement: false
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: 'category',
    timestamps: false
});

module.exports = Category;