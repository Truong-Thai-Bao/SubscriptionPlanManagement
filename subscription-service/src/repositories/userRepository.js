/**
 * Repository for User entity operations.
 * * This class implements the Repository Pattern for the User model, 
 * centralizing all authentication-related queries and user profile management.
 * It serves as the primary data access point for the Auth and User services.
 * * @module repositories/UserRepository
 * @requires models/User
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const User = require("../models/User");

class UserRepository {
    /**
     * Retrieves a user record by their unique email address.
     * Often used during login or password reset flows.
     * @async
     * @param {string} email - The email to search for.
     * @returns {Promise<User|null>} The User instance if found, otherwise null.
     */
    async getUserByEmail(email) {
        console.log('[UserRepository] getUserByEmail called with:', email);
        const user = await User.findOne({ where: { email } });
        console.log('[UserRepository] getUserByEmail result:', user ? { id: user.id, email: user.email } : 'null');
        return user;
    }

    /**
     * Retrieves a user record by their unique username.
     * Primary method for standard credential-based authentication.
     * @async
     * @param {string} username - The username to search for.
     * @returns {Promise<User|null>} The User instance if found, otherwise null.
     */
    async getUserByUsername(username) {
        console.log('[UserRepository] getUserByUsername called with:', username);
        const user = await User.findOne({ where: { username } });
        console.log('[UserRepository] getUserByUsername result:', user ? { id: user.id, username: user.username } : 'null');
        return user;
    }

    /**
     * Finds a user by their Primary Key (ID).
     * @async
     * @param {number|string} id - The unique user ID.
     * @returns {Promise<User|null>}
     */
    async getUserById(id) {
        return await User.findByPk(id);
    }

    /**
     * Inserts a new user record into the database.
     * Used for registration or admin-led user creation.
     * @async
     * @param {Object} userData - Object containing user credentials and profile info.
     * @returns {Promise<User>} The newly created User instance.
     */
    async createUser (userData) {
        return await User.create(userData);
    }
    
    /**
     * Persists an existing user model instance back to the database.
     * @async
     * @param {User} instance - The Sequelize model instance to save.
     * @returns {Promise<User>}
     */
    async saveUser(instance) {
        return await instance.save();
    }

    /**
     * Updates an existing user instance with new data attributes.
     * @async
     * @param {User} instance - The current User model instance.
     * @param {Object} data - New values to apply (e.g., status, phone, profile).
     * @returns {Promise<User>} The updated User instance.
     */
    async updateUser(instance, data) {
        await instance.set(data);
        return await instance.save();
    }
}

module.exports = new UserRepository();