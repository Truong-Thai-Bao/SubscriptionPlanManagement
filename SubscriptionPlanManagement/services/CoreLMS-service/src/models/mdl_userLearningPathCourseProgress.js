const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const LearningPath = require("./mdl_LearningPath");
const Account = require("./mdl_Account");

const UserLearningPathCourseProgress = sequelize.define(
  "UserLearningPathCourseProgress",
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
    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    moodleCourseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "UserLearningPathCourseProgress",
    freezeTableName: true,
    timestamps: true,
  }
);
module.exports = UserLearningPathCourseProgress;
