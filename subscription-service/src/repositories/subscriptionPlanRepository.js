/**
 * Repository for Subscription Plan entity operations.
 * * This class provides an abstraction layer for accessing subscription plan data.
 * It is primarily used to retrieve predefined service tiers and their associated 
 * features, ensuring the Service layer interacts with a clean data interface.
 * * @module repositories/SubscriptionPlanRepository
 * @requires models/Subscription_plan
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const Subcription_plan = require("../models/Subscription_plan");

class SubscriptionPlanRepository {
  /**
   * Retrieves a specific subscription plan by its Primary Key.
   * @async
   * @param {number|string} id - The unique identifier of the subscription plan.
   * @returns {Promise<Subcription_plan|null>} The Subscription Plan instance or null.
   */
  async getSubscriptionPlanById(id) {
    return await Subcription_plan.findByPk(id);
  }

  /**
   * Fetches all available subscription plans from the database.
   * @async
   * @returns {Promise<Subcription_plan[]>} An array of all Subscription Plan instances.
   */
  async getAllSubscriptionPlan() {
    return await Subcription_plan.findAll();
  }

  /**
   * Queries subscription plans based on dynamic conditions (e.g., specific features).
   * @async
   * @param {Object} condition - Sequelize 'where' clause object.
   * @returns {Promise<Subcription_plan[]>} An array of matching Subscription Plan instances.
   */
  async getSubscriptionPlanByCondition(condition) {
    return await Subcription_plan.findAll({
      where: condition,
    });
  }
}

module.exports = new SubscriptionPlanRepository();