
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); 
const planRoutes = require('./routes/planRoute'); 
const i18nSystem = require('./config/i18n.js');
const globalErrorHandler = require('../src/middleware/errorHandler.js');
const AppError = require('../src/utils/AppError.js');


const app = express();

app.use(cors());
app.use(express.json()); // To Express can readable from req.body
app.use(i18nSystem.middleware.handle(i18nSystem.i18next));
app.use(express.urlencoded({ extended: true }));

app.use('/api/plans', planRoutes);

app.all('*', (req, res, next) => {
    next(new AppError('server.route_not_found', 404)); 
});


app.use((err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Lỗi máy chủ nội bộ (Internal Server Error)';

    res.status(statusCode).json({
        success: false,
        message: message
    });
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        // Check db connection befor connect
        await sequelize.authenticate();
        console.log('Kết nối Database thành công!');
        app.use(globalErrorHandler);
        app.listen(PORT, () => {
            console.log(`Subscription Service đang chạy mượt mà tại: http://127.0.0.1:8000`);
        });
    } catch (error) {
        console.error('Không thể kết nối tới Database:', error.message);
        process.exit(1); 
    }
};

startServer();