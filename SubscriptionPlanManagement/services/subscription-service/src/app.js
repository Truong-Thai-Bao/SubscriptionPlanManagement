const express = require('express');
const globalErrorHandler = require('../src/middleware/errorHandler.js');
const cors = require('cors');
const i18nSystem = require('./config/i18n.js');

const planRoute = require('./routes/planRoute.js');
const courseRoute = require('./routes/courseRoute.js');
const tenantUserRoute = require('./routes/tenantUserRoute.js');
const tenantRoleRoute = require('./routes/tenantRoleRoute.js');
const subscriptionRoute = require('./routes/subscriptionRoute.js');
const AppError = require('./utils/AppError.js');

const app = express();

// 
app.use(cors());
app.use(i18nSystem.middleware.handle(i18nSystem.i18next));
app.use(express.json()); // To Express can readable from req.body
app.use(express.urlencoded({ extended: true }));

app.use('/api/plans', planRoute);
app.use('/api/courses',courseRoute);
app.use('/api/tenant/user',tenantUserRoute);
app.use('/api/tenant/role',tenantRoleRoute);
app.use('/api/subscription',subscriptionRoute)
app.all('*', (req, res, next) => {
    next(new AppError('server.route_not_found', 404)); 
});

// use Global Error Handler to translate i18n
app.use(globalErrorHandler);


module.exports = app;