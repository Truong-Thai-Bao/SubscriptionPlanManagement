/**
 * Moodle Integration Routes Configuration.
 * * This module defines the API endpoints for synchronizing and authenticating 
 * users with the external Moodle LMS platform. It handles account 
 * provisioning and secure token generation for seamless integration.
 * * @module routes/MoodleRoutes
 * @requires express
 * @requires controllers/MoodleController
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const express = require('express');
const router = express.Router();
const moodleController = require('../controllers/moodleController');

/**
 * @route POST /api/moodle/moodle-user
 * @desc Create or synchronize a local user profile into the Moodle LMS.
 * @access Private/Admin
 */
router.post('/moodle-user', moodleController.createMoodleUser);

/**
 * @route POST /api/moodle/moodle-token
 * @desc Generate or retrieve a Web Service (WS) token for Moodle API access.
 * @access Private/Internal
 */
router.post('/moodle-token', moodleController.generateMoodleToken);

module.exports = router;