const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Nhớ gọi đúng file kết nối DB của bạn

const LmsCategory = sequelize.define('LmsCategory', {
    tenant_id: DataTypes.INTEGER,
    moodle_category_id: DataTypes.INTEGER,
    name: DataTypes.STRING
}, {
    tableName: 'lms_categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = LmsCategory;