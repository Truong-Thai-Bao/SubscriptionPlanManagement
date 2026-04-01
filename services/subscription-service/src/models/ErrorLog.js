const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
 
/**
 * @file ErrorLog.js
 * @description Defines the ErrorLog model for the application. 
 */


/**
 * ErrorLog Model Definition
 */
const ErrorLog = sequelize.define('ErrorLog', {
    // Primary Key: Auto-incrementing unsigned big integer
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        autoIncrement: true, 
        primaryKey: true 
    },
    
    // The display level of the error ('error,warning,critical')
    level: { 
        type: DataTypes.STRING(50), 
        allowNull: false 
    },
    
    // Detailed error
    message: { 
        type: DataTypes.TEXT, 
        allowNull:false
    },
    
    // 'Detailed error stack trace for debugging'
    stack_trace: { 
        type: DataTypes.TEXT 
    },
    
    // 'API endpoint that caused the error'
    url: { 
        type: DataTypes.STRING(255), 
    },
    
    // 'HTTP method: GET, POST, PUT, DELETE'
    method: { 
        type: DataTypes.STRING(10) 
    },
    
    // IP address of user
    ip_address: { 
        type: DataTypes.STRING(50), 
    },
    //'User who caused the error (if any)'
    user_id:{
        type:DataTypes.BIGINT
    }
}, {
    // Explicitly map this model to the 'errorlog' table in the database
    tableName: 'error_log',
    
    // Enable automatic management of timestamp fields
    timestamps: true,
    
    // Map Sequelize's default 'createdAt' behavior to the custom 'created_at' column
    createdAt: 'created_at',
    
    // Map Sequelize's default 'updatedAt' behavior to the custom 'updated_at' column
    updatedAt: false
});

// Export the ErrorLog model to be used in associations (index.js) and repositories
module.exports = ErrorLog;