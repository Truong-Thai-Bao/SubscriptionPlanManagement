// src/dtos/subscriptionResponse.dto.js

const policyDto = require("./policyDto");

class SubscriptionResponseDto {
    /**
     * Transform raw DB data into safe Usage Dashboard response
     */
    static toUsageDashboard(rawData, activeUsersCount) {
        if (!rawData) return null;

        // Safely extract nested policy data
        const policy = policyDto.formatPolicy(rawData.plan?.policy) || {};
        const maxUsers = policy.max_users || 0;

        return {
            plan_name: rawData.plan?.name || 'Unknown Plan',
            status: rawData.subscription_state?.name || 'Unknown Status',
            start_date: rawData.start_date,
            end_date: rawData.end_date,
            policy : policy,
            usage: {
                users: {
                    used: activeUsersCount,
                    limit: maxUsers,
                    // Calculate percentage safely (avoid division by zero)
                    percentage: maxUsers > 0 ? ((activeUsersCount / maxUsers) * 100).toFixed(1) : 0
                },
                // Extend easily for storage, courses later...
                storage: {
                    limit: policy.max_storage || 0
                }
            }
        };
    }
}

module.exports = SubscriptionResponseDto;