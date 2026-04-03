/**
 * Express Application Configuration & Middleware Pipeline.
 * * This is the entry point for the Suri LMS Cloud Subscription Service.
 * It configures the middleware stack, global security policies, and 
 * orchestrates the routing logic for the entire microservice.
 * * Key features:
 * - CORS (Cross-Origin Resource Sharing) enabled for frontend integration.
 * - JSON body parsing for API communication.
 * - Internationalization (i18n) middleware as a global interceptor.
 * - Scoped routing for granular resource management (RBAC, Moodle API, etc.).
 * * @module app
 * @requires express
 * @requires cors
 * @requires middleware/i18nMiddleware
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-14
 */

const express = require('express');
const cors = require('cors');
const i18nMiddleware = require('./middleware/i18nMiddleware');

// Router imports
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const featureRoutes = require('./routes/featureRoutes');
const rolePermissionRoutes = require('./routes/rolePermissioRoutes');
const moodleRoutes = require('./routes/moodleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Global Middleware Stack
app.use(cors()); // Enable cross-origin requests from the frontend
app.use(express.json()); // Parse incoming JSON payloads

/**
 * Localization Interceptor.
 * Ensures that every request is tagged with the correct 'lang' 
 * before reaching the validation or service layers.
 */
app.use(i18nMiddleware);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/moodle', moodleRoutes);
app.use('/api/categories', categoryRoutes);

/**
 * Health Check Route.
 * Verifies that the Subscription Service is operational.
 */
app.get('/', (req, res) => {
  res.send('Chào bạn! Subscription Service đã sẵn sàng hoạt động.');
});

module.exports = app;