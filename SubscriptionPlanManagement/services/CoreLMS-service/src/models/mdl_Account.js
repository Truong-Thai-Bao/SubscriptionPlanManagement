const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Role = require("./mdl_Role");

const Account = sequelize.define(
  "Account",
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    moodleUserId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true,
    },
    roleId: {
      type: DataTypes.UUID,
      references: { model: Role, key: "id" },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { tableName: "Account", freezeTableName: true, timestamps: true }
);
module.exports = Account;
