const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const LearningPath = require("./mdl_learningPath");
const Account = require("./mdl_Account");

const UserLearningPath = sequelize.define(
  "UserLearningPath",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    learnerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Account, key: "userId" },
    },
    pathId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: LearningPath, key: "id" },
    },
    isComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completePercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    assignBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Account, key: "userId" },
    },
  },
  { tableName: "UserLearningPath", freezeTableName: true, timestamps: true }
);
module.exports = UserLearningPath;