const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const LearningPath = require("./mdl_learningPath");
const Account = require("./mdl_Account");

const Certificate = sequelize.define(
    "Certificate",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.UUID,
            references: { model: Account, key: "userId" },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        issuedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        issuedBy: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        learningPathId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: LearningPath, key: "id" },
        },
    },
    { tableName: "Certificate", freezeTableName: true, timestamps: true }
);
module.exports = Certificate;
