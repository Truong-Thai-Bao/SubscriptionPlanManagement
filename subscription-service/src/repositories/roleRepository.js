/**
 * Repository for Role entity operations.
 * * This class implements the Repository Pattern to manage data access for Roles.
 * It provides an abstraction layer over Sequelize methods to ensure the service 
 * layer remains independent of the database schema.
 * * @module repositories/RoleRepository
 * @requires models/Role
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const Role = require("../models/Role");

class RoleRepository {
  /**
   * Finds a single role by its Primary Key (ID).
   * @async
   * @param {number|string} id - The unique ID of the role.
   * @returns {Promise<Role|null>} A promise that resolves to the Role instance or null.
   */
  async getRoleById(id) {
    return await Role.findByPk(id);
  }

  /**
   * Retrieves all role records from the database.
   * @async
   * @returns {Promise<Role[]>} An array of all Role instances.
   */
  async getAllRole() {
    return await Role.findAll();
  }

  /**
   * Searches for roles based on a dynamic where clause.
   * @async
   * @param {Object} condition - Sequelize-formatted search criteria.
   * @returns {Promise<Role[]>} An array of matching Role instances.
   */
  async getRoleByCondition(condition) {
    return await Role.findAll({
      where: condition,
    });
  }

  /**
   * Commits an existing role instance's changes to the database.
   * @async
   * @param {Role} instance - The Sequelize model instance to save.
   * @returns {Promise<Role>} The persisted Role instance.
   */
  async saveRole(instance) {
    return await instance.save();
  }

  /**
   * Creates a new role entry in the database.
   * @async
   * @param {Object} data - The raw data for the new role.
   * @returns {Promise<Role>} The newly created Role instance.
   */
  async createRole(data) {
    return await Role.create(data);
  }

  /**
   * Updates an existing role instance with new attribute values.
   * @async
   * @param {Role} instance - The current role instance to be updated.
   * @param {Object} data - Object containing the fields to update.
   * @returns {Promise<Role>} The updated Role instance.
   */
  async updateRole(instance, data) {
    await instance.set(data);
    return await instance.save();
  }

  /**
   * Permanently destroys a role record.
   * @async
   * @param {Role} instance - The Sequelize model instance to be deleted.
   * @returns {Promise<void>}
   */
  async deleteRole(instance) {
    return await instance.destroy();
  }
}

module.exports = new RoleRepository();