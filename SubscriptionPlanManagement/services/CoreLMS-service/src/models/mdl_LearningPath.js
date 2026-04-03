const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LearningPath = sequelize.define(
  "LearningPath",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    publishStatus: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      defaultValue: "draft",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { tableName: "LearningPath", freezeTableName: true, timestamps: true }
);
module.exports = LearningPath;
