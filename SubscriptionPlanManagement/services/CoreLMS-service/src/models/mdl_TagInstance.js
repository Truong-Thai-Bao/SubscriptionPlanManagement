const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Tag = require('./mdl_Tag.js'); // Import Tag model for association

// Define Tag Instance mapping to mdl_tag_instance
const TagInstance = sequelize.define('TagInstance', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    tagid: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    itemtype: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemid: {
        type: DataTypes.BIGINT, // This represents the course ID
        allowNull: false
    }
}, {
    tableName: 'mdl_tag_instance',
    timestamps: false
});

// Define Relationship: TagInstance belongs to Tag
TagInstance.belongsTo(Tag, { foreignKey: 'tagid', targetKey: 'id', as: 'tagDetails' });

module.exports = TagInstance;