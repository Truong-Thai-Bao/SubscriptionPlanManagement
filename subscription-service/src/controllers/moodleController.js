/**
 * Moodle Integration Controller.
 * * This controller manages the synchronization and authentication bridge between 
 * the local LMS cloud and the external Moodle platform. It handles user creation 
 * on Moodle and secures session tokens for seamless integration.
 * * @module controllers/moodleController
 * @requires services/moodleService
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-26
 */

const moodleService = require('../services/moodle_services/moodle.service');
const ResponseDTO = require("../dtos/responseDTO");
const { getMessage } = require("../lang/i18n");

/**
 * @namespace MoodleController
 */
const MoodleController = {

    /**
     * Creates a corresponding user account in the Moodle system.
     * * This function ensures that when a user is registered locally, they are 
     * also provisioned in Moodle with the same credentials for SSO compatibility.
     * * @async
     * @function createMoodleUser
     * @param {import('express').Request} req - Request body must contain 'userId' and 'password'.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<import('express').Response>} 200 on success, 400 on missing fields, or 500 on integration error.
     */
    async createMoodleUser(req, res) {
        const { userId, password } = req.body;
        if (!userId || !password) {
            return res.status(400).json(
                new ResponseDTO(getMessage(req.lang, "validation.common.missing_fields"), 400, false)
            );
        }
        const result = await moodleService.createMoodleUser(userId, password, req.lang);
        return res.status(result.statusCode).json(result);
    },


    /**
     * Generates a Web Service token for a specific Moodle user.
     * * Uses Moodle's 'get_user_token' service to retrieve a token that allows 
     * the local system to perform actions on behalf of the user within Moodle.
     * * @async
     * @function generateMoodleToken
     * @param {import('express').Request} req - Request body contains 'username' and 'password'.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<import('express').Response>} Returns the Moodle token and status code.
     */
    async generateMoodleToken(req, res) {
        const { username, password } = req.body;

        // Gọi service
        const result = await moodleService.generateUserToken(username, password, req.lang);

        // Trả về đúng status và data mà Service đã đóng gói
        return res.status(result.statusCode).json(result);
    }

};

module.exports = MoodleController;