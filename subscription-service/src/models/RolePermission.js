/**
 * Role-Permission Junction Model.
 * * This model represents the 'role_permission' table, acting as a bridge 
 * to establish a Many-to-Many relationship between Roles and Permissions.
 * It stores the mapping of which roles possess which specific access permissions.
 * * @module models/RolePermission
 * @requires sequelize
 * @requires config/database
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * RolePermission Schema.
 * * @typedef {Object} RolePermission
 * @property {number} id - Unique identifier (BIGINT, Primary Key).
 * @property {number} role_id - Foreign key reference to the Role model.
 * @property {number} permission_id - Foreign key reference to the Permission model.
 * @property {number} status - Mapping status (TINYINT: 1 for Active, 0 for Inactive).
 */
const RolePermission = sequelize.define('RolePermission', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: false
    },
    role_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: 'role_permission',
    timestamps: false
});

module.exports = RolePermission;