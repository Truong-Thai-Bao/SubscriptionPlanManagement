const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path based on your folder structure


/**
 * @description Role model representing role for user
 */
const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT
    },
    //'1: System Role, 0: Custom'
    isSystemRole:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    status:{
        type:DataTypes.BOOLEAN
    }

}, {
    tableName: 'role',
    timestamps: true, // Automatically manages created_at and updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Role;