const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { TENANT_STATUS } = require('../constant/enum.js'); // Updated import

/**
 * @file Tenant.js
 * @description Tenant model representing the organization/company using the B2B system.
 */
const Tenant = sequelize.define('Tenant', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    // Global Unique Identifier for secure API references
    guid: {
        type: DataTypes.STRING(36),
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: 'tenant.validation.guid_required' },
            notEmpty: { msg: 'tenant.validation.guid_empty' },
            isUUID: { args: 4, msg: 'tenant.validation.guid_invalid' } // Ensures valid UUIDv4
        }
    },
    // Basic Organization Info
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: { msg: 'tenant.validation.name_required' },
            notEmpty: { msg: 'tenant.validation.name_empty' },
            len: { args: [2, 255], msg: 'tenant.validation.name_length' }
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: { msg: 'tenant.validation.email_invalid' }
        }
    },
    billing_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: { msg: 'tenant.validation.email_invalid' } // Reuse the same translation key
        }
    },
    // Account Status & Toggles
    status: {
        type: DataTypes.ENUM(Object.values(TENANT_STATUS)),
        defaultValue: 'trial'
    },
    is_enable: {
        type: DataTypes.BOOLEAN, 
        defaultValue: true
    },
    // Legal & Customization
    tax_id: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    legal_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    custom_domain: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'tenant',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Tenant;