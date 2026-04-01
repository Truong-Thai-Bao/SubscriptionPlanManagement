class planDto {
    /**
     * Format plan data safely before DB insert
     */
    static formatPlan(data, policyId) {
        return {
            name: data.name,
            user_type: data.user_type || 'b2b',
            payment_term: data.payment_term,
            currency: data.currency || 'VND',
            price: parseFloat(data.price) || 0,
            status: data.status !== undefined ? parseInt(data.status, 10) : 1,
            current_version: data.version || '1.0',
            subscription_policy_id: policyId
        };
    }
}

module.exports = planDto;