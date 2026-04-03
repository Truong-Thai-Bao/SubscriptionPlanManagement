/**
 * Repository for Permission entity operations.
 * * This class abstracts database interactions for the Permission model, 
 * providing a clean interface for Service layers to perform CRUD operations.
 * It ensures that the application remains decoupled from the underlying ORM.
 * * @module repositories/PermissionRepository
 * @requires models/Permission
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const Permission = require("../models/Permission");

class PermissionRepository {
  /**
   * Finds a specific permission by its Primary Key.
   * @async
   * @param {number|string} id - The unique ID of the permission.
   * @returns {Promise<Permission|null>} A promise that resolves to the Permission instance or null.
   */
  async getPermissionById(id) {
    return await Permission.findByPk(id);
  }

  /**
   * Retrieves all available permissions from the database.
   * @async
   * @returns {Promise<Permission[]>} An array of all Permission instances.
   */
  async getAllPermission() {
    return await Permission.findAll();
  }

  /**
   * Queries permissions based on dynamic conditions (e.g., status, action, or feature_id).
   * @async
   * @param {Object} condition - Sequelize 'where' clause object.
   * @returns {Promise<Permission[]>} An array of Permission instances matching the criteria.
   */
  async getPermissionByCondition(condition) {
    return await Permission.findAll({
      where: condition,
    });
  }

  /**
   * Saves an existing, modified Permission instance to the database.
   * @async
   * @param {Permission} instance - The Sequelize model instance to be persisted.
   * @returns {Promise<Permission>} The saved Permission instance.
   */
  async savePermission(instance) {
    return await instance.save();
  }

  /**
   * Inserts a new permission record into the database.
   * @async
   * @param {Object} data - The raw data object for the new permission.
   * @returns {Promise<Permission>} The newly created Permission instance.
   */
  async createPermission(data) {
    return await Permission.create(data);
  }

  /**
   * Updates an existing Permission instance with provided data.
   * @async
   * @param {Permission} instance - The current Sequelize instance to update.
   * @param {Object} data - New values to be applied to the instance.
   * @returns {Promise<Permission>} The updated Permission instance.
   */
  async updatePermission(instance, data) {
    await instance.set(data);
    return await instance.save();
  }

  /**
   * Permanently removes a permission record from the database.
   * @async
   * @param {Permission} instance - The Sequelize instance to be deleted.
   * @returns {Promise<void>}
   */
  async deletePermission(instance) {
    return await instance.destroy();
  }
}

module.exports = new PermissionRepository();