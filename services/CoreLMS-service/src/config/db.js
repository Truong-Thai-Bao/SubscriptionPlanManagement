const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * This file to backend can connect to DB
 */
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql', 
    logging: false, 
});

module.exports = sequelize;