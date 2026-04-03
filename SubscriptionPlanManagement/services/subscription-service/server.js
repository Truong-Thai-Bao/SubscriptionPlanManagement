
const express = require('express');
const sequelize = require('./src/config/db'); 
const app = require('./src/app.js');



const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        // Check db connection befor connect
        await sequelize.authenticate();
        console.log('Kết nối Database thành công!');
        app.listen(PORT, () => {
            console.log(`Subscription Service đang chạy mượt mà tại: http://127.0.0.1:8000`);
        });
    } catch (error) {
        console.error('Không thể kết nối tới Database:', error.message);
        process.exit(1); 
    }
};

startServer();