const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const LearningPath = require("./mdl_LearningPath");

const LearningPathCourses = sequelize.define(
  "LearningPathCourses",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    pathId: {
      type: DataTypes.UUID,
      references: { model: LearningPath, key: "id" },
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    moodleCourseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "LearningPathCourses",
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        name: "uniq_path_course_moodle",
        fields: ["pathId", "courseId", "moodleCourseId"],
      },
    ],
  }
);
module.exports = LearningPathCourses;
