const planRepo = require('../repositories/planRepository.js');
const planService = require('../services/planService.js');

/**
 * Retrieve a list of all subscription plans.
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await planService.getAllPlans();
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create a new subscription plan.
 * @param {Object} req - Express request (req.body contains payload)
 * @param {Object} res - Express response
 */
exports.createPlan = async (req, res, next) => {
    try {
        const data = req.body;

        const newPlan = await planService.createPlan(data);

        return res.status(201).json({
            success: true,
            message: req.t('plan.success.create'),
            data: newPlan
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Soft delete (deactivate) a subscription plan by ID.
 * @param {Object} req - Express request (req.params.id contains plan ID)
 * @param {Object} res - Express response
 */
exports.deactivatePlan = async (req, res) => {
    try {
        const success = await planRepo.deactivatePlan(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: req.t('plan.not_found') });
        res.status(200).json({ success: true, message: req.t('plan.success.deactivate') });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Permanently delete a subscription plan by ID.
 * @param {Object} req - Express request (req.params.id contains plan ID)
 * @param {Object} res - Express response
 */
exports.deletePlan = async (req, res) => {
    try {
        await planRepo.deletePlan(req.params.id);
        res.status(200).json({ success: true, message: req.t('plan.success.delete') });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Update an existing subscription plan by ID.
 * @param {Object} req - Express request (params.id & body payload)
 * @param {Object} res - Express response
 */
exports.updatePlan = async (req, res) => {
    try {
        const newPlan = await planService.updatePlan(req.params.id, req.body);
        res.status(200).json({ success: true, data: newPlan, message: req.t('plan.success.update') });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};