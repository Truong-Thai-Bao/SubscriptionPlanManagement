import apiClient from './apiClient';

const PLAN_ENDPOINT = '/plans'; // Định nghĩa Endpoint riêng cho file này

/**
 * @module planService
 * @description Handles all API requests related to Subscription Plans.
 */
const planService = {

    /**
     * Fetch all subscription plans.
     * @returns {Promise<Object>} API response data
     */
    getAllPlans: async () => {
        const res = await apiClient.get(PLAN_ENDPOINT);
        return res.data;
    },

    /**
     * Fetch a single plan by its ID.
     * @param {number|string} id - The ID of the plan
     * @returns {Promise<Object>} API response data
     */
    getPlanById: async (id) => {
        // Đã sửa lỗi /:${id} thành /${id}
        const res = await apiClient.get(`${PLAN_ENDPOINT}/${id}`);
        return res.data;
    },

    /**
     * Create a new subscription plan.
     * @param {Object} payload - Plan data
     * @returns {Promise<Object>} API response data
     */
    createPlan: async (payload) => {
        const res = await apiClient.post(PLAN_ENDPOINT, payload);
        return res.data;
    },

    /**
     * Update an existing plan by its ID.
     * @param {number|string} id - The ID of the plan
     * @param {Object} payload - Updated plan data
     * @returns {Promise<Object>} API response data
     */
    updatePlan: async (id, payload) => {
        const res = await apiClient.put(`${PLAN_ENDPOINT}/${id}`, payload);
        return res.data;
    },

    /**
     * Soft delete (deactivate) a plan by its ID.
     * @param {number|string} id - The ID of the plan
     * @returns {Promise<Object>} API response data
     */
    deactivatePlan: async (id) => {
        const res = await apiClient.patch(`${PLAN_ENDPOINT}/${id}/deactivate`);
        return res.data;
    },

    /**
     * Permanently delete a plan by its ID.
     * @param {number|string} id - The ID of the plan
     * @returns {Promise<Object>} API response data
     */
    deletePlan: async (id) => {
        const res = await apiClient.delete(`${PLAN_ENDPOINT}/${id}`);
        return res.data;
    }
};

export default planService;