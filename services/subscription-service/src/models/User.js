const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const { GENDER } = require("../constant/enum.js"); // Updated import

/**
 * @file User.js
 * @description User model representing system administrators (Suri LMS Cloud staff).
 */
const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    role_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true 
    },
    // Authentication Credentials
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: 'user.validation.username_required' },
            notEmpty: { msg: 'user.validation.username_empty' },
            len: { args: [4, 100], msg: 'user.validation.username_length' }
        }
    },
    salt: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: { msg: 'user.validation.password_required' },
            notEmpty: { msg: 'user.validation.password_empty' }
        }
    },
    // Profile Information
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    avatar_link: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: 'user.validation.email_required' },
            isEmail: { msg: 'user.validation.email_invalid' }
        }
    },
    DOB: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isPastDate(value) {
                // Custom validator: Date of Birth cannot be in the future
                if (value && new Date(value) >= new Date()) {
                    throw new Error('user.validation.dob_future');
                }
            }
        }
    },
    gender: {
        type: DataTypes.ENUM(Object.values(GENDER)),
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN, 
        defaultValue: true
    }
}, {
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;