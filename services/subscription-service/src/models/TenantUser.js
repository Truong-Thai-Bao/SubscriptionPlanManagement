const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const TENANT_USER_STATUS = require('../constant/enum.js');
/**
 * @file TenantUser.js
 * @description Represents the end-users belonging to a specific customer (Tenant).
 */
const TenantUser = sequelize.define('tenant_user', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    tenant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        validate: {
            notNull: { msg: 'tenant_user.validation.tenant_id_required' }
        }
    },
    tenant_role_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    user_id: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: { msg: 'tenant_user.validation.password_required' },
            notEmpty: { msg: 'tenant_user.validation.password_empty' }
        }
    },
    status: {
        type: DataTypes.ENUM(Object.values(TENANT_USER_STATUS)),
        defaultValue: 'active'
    },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    suspended: { type: DataTypes.BOOLEAN, defaultValue: false },
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
    
    first_name: { type: DataTypes.STRING(100) },
    last_name: { type: DataTypes.STRING(100) },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: { msg: 'tenant_user.validation.email_required' },
            isEmail: { msg: 'tenant_user.validation.email_invalid' }
        }
    },
    phone: { type: DataTypes.STRING(50) },
    organization: { type: DataTypes.STRING(255) },
    department: { type: DataTypes.STRING(255) },
    address: { type: DataTypes.TEXT },
    country: { type: DataTypes.STRING(100) },
    city: { type: DataTypes.STRING(100) },
    lang: { type: DataTypes.STRING(20), defaultValue: 'vi' },
    timezone: { type: DataTypes.STRING(50), defaultValue: 'Asia/Ho_Chi_Minh' },
    
    first_access: { type: DataTypes.DATE },
    last_access: { type: DataTypes.DATE },
    last_login: { type: DataTypes.DATE },
    current_login: { type: DataTypes.DATE },
    picture: { type: DataTypes.STRING(255) },
    DOB: { 
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isPastDate(value) {
                if (value && new Date(value) >= new Date()) {
                    throw new Error('tenant_user.validation.dob_future');
                }
            }
        }
    }
}, {
    tableName: 'tenant_user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = TenantUser;