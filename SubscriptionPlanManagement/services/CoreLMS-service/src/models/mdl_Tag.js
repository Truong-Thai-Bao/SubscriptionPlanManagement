const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define Tag Model mapping to mdl_tag
const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'mdl_tag',
    timestamps: false
});

module.exports = Tag;