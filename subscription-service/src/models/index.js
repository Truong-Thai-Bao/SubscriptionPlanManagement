/**
 * Database Relationships & Models Entry Point.
 * * This module serves as the central hub for initializing Sequelize models 
 * and defining their associations. It establishes the Many-to-Many relationship 
 * between Roles and Permissions through the RolePermission junction table.
 * * @module models/associations
 * @requires models/Role
 * @requires models/Permission
 * @requires models/RolePermission
 * @requires config/database
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-25
 */

const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const { sequelize } = require('../config/database');

/**
 * 1. Association Setup
 * * Many-to-Many relationship:
 * - A Role can be assigned multiple Permissions.
 * - A Permission can be associated with multiple Roles.
 * - Managed via the 'RolePermission' junction table.
 */
Role.belongsToMany(Permission, { 
    through: RolePermission, 
    foreignKey: 'role_id', 
    otherKey: 'permission_id',
    as: 'permissions' 
});

Permission.belongsToMany(Role, { 
    through: RolePermission, 
    foreignKey: 'permission_id', 
    otherKey: 'role_id',
    as: 'roles'
});

/**
 * 2. Unified Export
 * * Exporting models from this central file ensures that associations 
 * are initialized before any Eager Loading (include) queries are executed.
 */
module.exports = {
    sequelize,
    Role,
    Permission,
    RolePermission
};