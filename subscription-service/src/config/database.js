/**
 * Database Connection & Sequelize Configuration.
 * * This module initializes the Sequelize ORM instance and establishes 
 * a connection with the MySQL database using environment variables.
 * * Configuration includes:
 * - Connection pooling via Sequelize.
 * - Environment-based credential management.
 * - Logging suppression for cleaner terminal output.
 * * @module config/database
 * @requires sequelize
 * @requires dotenv
 * @requires path
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-14
 */

const { Sequelize } = require('sequelize');
const path = require('path');

// require('dotenv').config(); // Để đọc được các dòng trong file .env
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Sequelize instance configured with database credentials.
 * * @type {Sequelize}
 */
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false, // Để terminal không bị hiện quá nhiều dòng log SQL
    }
);


/**
 * Verifies the database connection.
 * * Attempts to authenticate with the database. If the connection fails, 
 * the process will terminate to prevent the app from running in an unstable state.
 * * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} Logs connection error and exits process on failure.
 */
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Connected!');
    } catch (error) {
        console.error('❌ Database Connection Error:', error.message);
        process.exit(1); // Dừng server nếu không kết nối được
    }
};

module.exports = { sequelize, connectDB };