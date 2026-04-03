/**
 * System User Model Definition.
 * * This model represents the 'user' table, serving as the primary identity 
 * entity for the application. It manages core authentication credentials, 
 * security state (lockouts), and integration identifiers for the LMS.
 * * @module models/User
 * @requires sequelize
 * @requires config/database
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * User Schema.
 * * @typedef {Object} User
 * @property {string} username - Unique login identifier.
 * @property {string} email - Unique verified email address.
 * @property {string} password_hash - Hashed password for secure storage.
 * @property {string} salt - Salt used for high-security hashing.
 * @property {number} role_id - Reference to the user's system role.
 * @property {string} phone - Contact telephone number.
 * @property {number} login_attempts - Tracks failed logins to prevent brute-force.
 * @property {boolean} is_blocked - Flag indicating if the account is restricted.
 * @property {string} firstname - User's first name (mapped to DB field 'first_name').
 * @property {string} lastname - User's last name.
 * @property {string} name - Full display name.
 * @property {number} moodle_user_id - Linked ID for Moodle LMS synchronization.
 */
const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
    },
    salt: {
      type: DataTypes.STRING,
      field: "salt",
    },
    role_id: {
      type: DataTypes.BIGINT,
      field: "role_id",
    },
    phone: {
      type: DataTypes.STRING
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_blocked: {
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: 0
    },
    firstname: {
      type: DataTypes.STRING,
      field: "first_name"
    },
    lastname: {
      type: DataTypes.STRING,
      field: "last_name"
    },
    moodle_user_id: {
      type: DataTypes.BIGINT
    }
  },
  {
    tableName: "user",
    timestamps: false,
  },
);

module.exports = User;
