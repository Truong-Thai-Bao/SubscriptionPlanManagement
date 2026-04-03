/**
 * Application Entry Point.
 * * This script initializes the environment, establishes a connection to the 
 * persistent storage (MySQL), and starts the Express server. It serves as 
 * the root of the process tree for the Subscription Service.
 * * Startup Sequence:
 * 1. Load Environment Variables (.env).
 * 2. Connect to Database (Sequelize Authentication).
 * 3. Bind Express App to the configured Network Port.
 * * @module server
 * @requires dotenv
 * @requires src/app
 * @requires src/config/database
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-14
 */

require('dotenv').config();
const app = require('./src/app');
const { connectDB, sequelize } = require('./src/config/database');
require('./src/models/index'); // Ensure all models are loaded for sync

const PORT = process.env.PORT || 3001;

/**
 * Orchestrates the system startup sequence.
 * Handles fatal connection errors during initialization to prevent 
 * the service from running in an unstable state.
 * @async
 * @function startServer
 */
const startServer = async () => {
    try {
        // 1. Establish Database Connectivity
        await connectDB();
        
        // 2. Sync database models
        // await sequelize.sync({ alter: true });
        
        // 3. Launch the HTTP Server
        app.listen(PORT, () => {
            console.log(`🚀 Service đang chạy tại: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Lỗi khởi động:", error);
    }
};

startServer();