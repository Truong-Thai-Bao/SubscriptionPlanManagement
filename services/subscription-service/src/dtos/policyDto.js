class policyDto {
    /**
     * Format policy data safely before DB insert
     */
    static formatPolicy(data) {
        return {
            max_days: parseInt(data.max_days, 10) || 0,
            max_users: parseInt(data.max_users, 10) || 0,
            max_storage: parseInt(data.max_storage, 10) || 0,
            max_courses: parseInt(data.max_courses, 10) || 0,
            ai_tokens: parseInt(data.ai_tokens, 10) || 0,
            grace_period: parseInt(data.grace_period, 10) || 0
        };
    }
}

module.exports = policyDto;