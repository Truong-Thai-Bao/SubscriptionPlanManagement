/**
 * Repository for Feature entity operations.
 * * This class implements the Repository Pattern to abstract the data access layer.
 * It provides methods to perform CRUD operations on the 'Feature' model,
 * keeping the business logic decoupled from the Sequelize ORM details.
 * * @module repositories/FeatureRepository
 * @requires models/Feature
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-24
 */

const Feature = require("../models/Feature");

class FeatureRepository {
  /**
   * Fetches a single feature by its Primary Key.
   * @async
   * @param {number|string} id - The unique ID of the feature.
   * @returns {Promise<Feature|null>} A promise that resolves to the Feature instance or null.
   */
  async getFeaturedById(id) {
    return await Feature.findByPk(id);
  }

  /**
   * Retrieves all feature records from the database.
   * @async
   * @returns {Promise<Feature[]>} A promise that resolves to an array of Feature instances.
   */
  async getAllFeature() {
    return await Feature.findAll();
  }

  /**
   * Finds features based on a specific filter condition.
   * @async
   * @param {Object} condition - Sequelize-formatted where clause (e.g., { status: 1 }).
   * @returns {Promise<Feature[]>} A promise that resolves to an array of matching Features.
   */
  async getFeatureByCondition(condition) {
    return await Feature.findAll({
      where: condition,
    });
  }

  /**
   * Persists an existing feature instance back to the database.
   * @async
   * @param {Feature} instance - The Sequelize model instance to be saved.
   * @returns {Promise<Feature>} The updated feature instance.
   */
  async saveFeature(instance) {
    return await instance.save();
  }

  /**
   * Creates a new feature record in the database.
   * @async
   * @param {Object} data - The data object for the new feature.
   * @returns {Promise<Feature>} The newly created feature instance.
   */
  async createFeature(data) {
    return await Feature.create(data);
  }

  /**
   * Updates an existing feature instance with new data.
   * @async
   * @param {Feature} instance - The existing Sequelize model instance.
   * @param {Object} data - The new data to apply to the instance.
   * @returns {Promise<Feature>} The updated feature instance.
   */
  async updateFeature(instance, data) {
    await instance.set(data);
    return await instance.save();
  }

  /**
   * Removes a feature record from the database.
   * @async
   * @param {Feature} instance - The Sequelize model instance to be destroyed.
   * @returns {Promise<void>}
   */
  async deleteFeature(instance) {
    return await instance.destroy();
  }
}

module.exports = new FeatureRepository();
