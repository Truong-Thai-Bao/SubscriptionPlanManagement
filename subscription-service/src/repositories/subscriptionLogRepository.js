/**
 * Repository for Subscription Log entity operations.
 * * This class implements the Repository Pattern to handle audit trails and 
 * historical logging for subscriptions. It focuses on persistence and 
 * retrieval of log entries to maintain system transparency.
 * * @module repositories/SubscriptionLogRepository
 * @requires models/Subscription_log
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const SubcriptionLog = require("../models/Subscription_log");

class SubcriptionLogRepository {
  /**
   * Fetches a specific log entry by its Primary Key.
   * @async
   * @param {number|string} id - The unique ID of the log entry.
   * @returns {Promise<SubcriptionLog|null>} The Subscription Log instance or null.
   */
  async getLogById(id) {
    return await SubcriptionLog.findByPk(id);
  }

  /**
   * Retrieves all subscription logs from the database.
   * @async
   * @returns {Promise<SubcriptionLog[]>} An array of all log records.
   */
  async getAllLog() {
    return await SubcriptionLog.findAll();
  }

  /**
   * Finds logs based on dynamic criteria (e.g., by user_id or category).
   * @async
   * @param {Object} condition - Sequelize 'where' clause.
   * @returns {Promise<SubcriptionLog[]>} An array of matching log instances.
   */
  async getLogByCondition(condition) {
    return await SubcriptionLog.findAll({
      where: condition,
    });
  }

  /**
   * Persists changes to an existing log instance.
   * @async
   * @param {SubcriptionLog} instance - The Sequelize model instance to save.
   * @returns {Promise<SubcriptionLog>} The updated log instance.
   */
  async saveLog(instance) {
    return await instance.save(); 
  }

  /**
   * Creates a new audit log record.
   * @async
   * @param {Object} data - Log details including entry content, category, and user_id.
   * @returns {Promise<SubcriptionLog>} The newly created log instance.
   */
  async createLog(data) {
    return await SubcriptionLog.create(data);
  }

  /**
   * Updates an existing log entry with new data.
   * @async
   * @param {SubcriptionLog} instance - The existing log instance.
   * @param {Object} data - New values to apply.
   * @returns {Promise<SubcriptionLog>} The updated log instance.
   */
  async updateLog(instance, data) {
    await instance.set(data);
    return await instance.save();
  }
}

module.exports = new SubcriptionLogRepository();