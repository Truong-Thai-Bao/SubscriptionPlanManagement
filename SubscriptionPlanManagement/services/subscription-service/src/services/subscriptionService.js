const planService = require("./planService");
const tenantUserRepo = require('../repositories/tenantUserRepo.js');
const SubscriptionResponseDto = require('../dtos/subscriptionDto.js');
const subscriptionRepository = require('../repositories/subscriptionRepository.js');


class SubscriptionService {
    async checkActiveSub (tenantId, userId,subId){
        return await subscriptionRepository.checkAccess(tenantId,userId,subId);
    }

    async checkFeature (tenantId,userId,subId,featureKey){
        return await subscriptionRepository.checkFeature(tenantId,userId,subId,featureKey);
    }

    async getInfor(tenantId,userId){

        const infor = await subscriptionRepository.getInfor(tenantId,userId);

        // If no subscription information is found, return null immediately.
        if(!infor){
            return null;
        }

        //get current user 
        const numberUsingUser = await tenantUserRepo.countTenantUser(tenantId);

        //return dto
        return SubscriptionResponseDto.toUsageDashboard(infor,numberUsingUser);
    }
}

module.exports = new SubscriptionService;