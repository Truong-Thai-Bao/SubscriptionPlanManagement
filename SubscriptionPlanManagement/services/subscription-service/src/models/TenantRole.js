const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * @file TenantRole.js
 * @description Represents roles within a specific tenant (e.g., admin, learner).
 */
const TenantRole = sequelize.define('TenantRole', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notNull: { msg: 'tenant_role.validation.name_required' },
            notEmpty: { msg: 'tenant_role.validation.name_empty' }
        }
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'tenant_role',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = TenantRole;