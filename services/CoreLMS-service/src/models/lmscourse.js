const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LmsCourse = sequelize.define('LmsCourse', {
    tenant_id: DataTypes.INTEGER,
    moodle_course_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    thumbnail_url: DataTypes.STRING,
    average_rating: DataTypes.FLOAT,
    tags: DataTypes.STRING,
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    }
}, {
    tableName: 'lms_course',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = LmsCourse;