const subscriptionService = require("../services/subscriptionService");

class subscriptionController {

    validateStatus = async (req,res,next) =>{
        try{
            const tenantId = req.headers['x-tenant-id'];
            const userId = req.headers['x-user-id'];
            const subId = req.params.id;
            const isActive = await subscriptionService.checkActiveSub(tenantId,userId,subId);
            
            if(!isActive){
                return res.status(403).json({
                    message: req.t('subscription.validate.not_active')
                })
            }
            
            return res.status(200).json({
                success: true,
                is_active: isActive
            });
        }catch(error){
            next(error);
        }
    }
    validateFeature = async (req,res,next) =>{
        try{
            const tenantId = req.headers['x-tenant-id'];
            const userId = req.headers['x-user-id'];
            const subId = req.params.id;
            const feature_key = req.body.feature_key;
            const isActive = await subscriptionService.checkFeature(tenantId,userId,subId,feature_key);
            
            if(!isActive){
                return res.status(403).json({
                    message: req.t('subscription.validate.not_allow_feature')
                })
            }
            
            return res.status(200).json({
                success: true,
                is_active: isActive
            });
        }catch(error){
            next(error);
        }
    }

    getUsage = async (req,res,next) => {
        try{
            const userId = req.headers['x-user-id'];
            const {tenantId} = req.params;
            console.log(userId,tenantId)
            const getInfor = await subscriptionService.getInfor(tenantId,userId);

            if(!getInfor){
                return res.status(404).json({
                    message: req.t('subscription.not_found')
                })
            }

            return res.status(200).json({
                success : true,
                data:getInfor
            })
        }catch(err){
            next(err);
        }
    }

}

module.exports = new subscriptionController;