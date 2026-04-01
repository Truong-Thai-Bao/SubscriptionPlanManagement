const sequelize = require('../config/db');

const LmsCategory = require('./lmscategory');
const LmsCourse = require('./lmscourse');

// ==========================================
// One-to-Many: LmsCategory <-> LmsCourse
// ==========================================
LmsCategory.hasMany(LmsCourse, { foreignKey: 'category_id', as: 'courses' });
LmsCourse.belongsTo(LmsCategory, { foreignKey: 'category_id', as: 'category' });

// ==========================================
// EXPORT ALL MODELS
// ==========================================
module.exports = {
    sequelize,
    LmsCategory,
    LmsCourse
};