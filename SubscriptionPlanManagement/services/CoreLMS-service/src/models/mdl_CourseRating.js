const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Replace with your DB connection path

// Define Rating Model mapping to mdl_tool_courserating_rating
const Rating = sequelize.define('Rating', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    courseid: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'mdl_tool_courserating_rating',
    timestamps: false // Moodle doesn't use standard createdAt/updatedAt
});

module.exports = Rating;