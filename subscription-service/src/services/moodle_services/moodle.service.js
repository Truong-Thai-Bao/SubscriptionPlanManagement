/**
 * Moodle Integration Service.
 * * This service orchestrates the communication between the LMS Cloud and the Moodle platform.
 * It handles raw API calls to Moodle Web Services, user synchronization logic, 
 * and authentication token management.
 * * @module services/MoodleService
 * @requires axios
 * @requires bcryptjs
 * @requires repositories/userRepository
 * @requires dtos/ResponseDTO
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-26
 */

const axios = require('axios');
const bcrypt = require("bcryptjs");
const userRepository = require('../../repositories/userRepository');
const ResponseDTO = require("../../dtos/responseDTO");
const { getMessage } = require("../../lang/i18n");

const MoodleService = {
    /**
     * Internal helper to execute the 'core_user_create_users' Moodle Web Service.
     * * @async
     * @function createUser
     * @param {Object} userData - User profile data for Moodle.
     * @param {string} userData.username - Unique username for Moodle.
     * @param {string} userData.password - Plain text password for initial account setup.
     * @param {string} userData.firstName - User's first name.
     * @param {string} userData.lastName - User's last name.
     * @param {string} userData.email - Primary email for Moodle notifications.
     * @returns {Promise<Object>} The first user object created in Moodle [{id, username}].
     * @throws {Error} If Moodle returns an API exception or network failure occurs.
     */
    async createUser(userData) {
        try {
            const response = await axios.get(process.env.MOODLE_BASE_URL, {
                params: {
                    wstoken: process.env.MOODLE_ADMIN_TOKEN,
                    wsfunction: 'core_user_create_users',
                    moodlewsrestformat: 'json',
                    'users[0][username]': userData.username,
                    'users[0][password]': userData.password,
                    'users[0][firstname]': userData.firstName,
                    'users[0][lastname]': userData.lastName,
                    'users[0][email]': userData.email,
                    'users[0][auth]': 'manual',
                }
            });

            // Moodle trả về 200 nhưng có thể chứa key exception nếu lỗi tham số
            if (response.data.exception) {
                throw new Error(`Moodle API Exception: ${response.data.message}`);
            }

            // Kết quả trả về là một mảng [{ id, username }]
            return response.data[0];
        } catch (error) {
            console.error('>>> Moodle API Error:', error.message);
            throw error;
        }
    },

    /**
     * Synchronizes a local user to Moodle after validating credentials and status.
     * * Workflow:
     * 1. Retrieve local user metadata.
     * 2. Verify password match (bcrypt).
     * 3. Call createUser for Moodle provisioning.
     * 4. Update local 'moodle_id' for future references.
     * * @async
     * @function createMoodleUser
     * @param {number|string} userId - The local database ID of the user.
     * @param {string} plainPassword - User's current password for verification.
     * @param {string} lang - Language code for response DTO.
     * @returns {Promise<ResponseDTO>}
     */
    async createMoodleUser(userId, plainPassword, lang) {
        try {
            const user = await userRepository.getUserById(userId);
            if (!user) {
                return new ResponseDTO(getMessage(lang, "function.user.not_exist"), 404, false);
            }

            if (user.moodle_id) {
                return new ResponseDTO(getMessage(lang, "function.moodle.already_synced"), 400, false);
            }

            const isMatch = await bcrypt.compare(plainPassword, user.password_hash);
            if (!isMatch) {
                return new ResponseDTO(getMessage(lang, "authentication.login.wrong_password"), 400, false);
            }

            const moodleUser = await this.createUser({
                username: user.username,
                password: plainPassword,
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email
            });

            if (moodleUser && moodleUser.id) {
                await userRepository.updateUser(user, { moodle_id: moodleUser.id });

                return new ResponseDTO(
                    getMessage(lang, "function.moodle.sync_success"),
                    200,
                    true,
                    { moodle_id: moodleUser.id }
                );
            } else {
                throw new Error("Moodle did not return user ID");
            }
        } catch (error) {
            console.error('>>> Sync Logic Error:', error.message);
            return new ResponseDTO(
                error.message || getMessage(lang, "function.moodle.sync_failed"),
                500,
                false
            );
        }
    },

    /**
     * Requests an authentication token from Moodle for a specific user.
     * * Contacts the /login/token.php endpoint using user credentials.
     * * @async
     * @function generateUserToken
     * @param {string} username - Moodle username.
     * @param {string} password - User password.
     * @param {string} lang - Language code for error messages.
     * @returns {Promise<ResponseDTO>} Payload contains 'token' and optional 'privatetoken'.
     */
    async generateUserToken(username, password, lang) {
        try {
            if (!username)
                return new ResponseDTO(getMessage(lang, "system.validation.validation"), 400, false, null, { username: [getMessage(lang, "validation.moodle_token.username_require")] });

            if (!password)
                return new ResponseDTO(getMessage(lang, "system.validation.validation"), 400, false, null, { password: [getMessage(lang, "validation.moodle_token.password_require")] })

            const response = await axios.get(
                `${process.env.MOODLE_URL}/login/token.php`,
                {
                    params: {
                        username: username,
                        password: password,
                        service: process.env.MOODLE_SERVICE
                    },
                }
            );

            // Moodle trả về lỗi dưới dạng JSON trong data chứ không bắn lỗi HTTP 400/500
            if (response.data.error) {
                // Trả về DTO lỗi 401 hoặc 400 tùy ông
                return new ResponseDTO(response.data.error, 400, false, null,
                    { moodle: [response.data.stacktrace || "Moodle authentication failed"] }
                );
            }

            return new ResponseDTO(getMessage(lang, "function.moodle_token.success"), 200, true,
                {
                    token: response.data.token,
                    privatetoken: response.data.privatetoken || null
                }
            );
        } catch (err) {
            console.error(err.message);
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500,false, null, err.message);
        }
    }
};

module.exports = MoodleService;