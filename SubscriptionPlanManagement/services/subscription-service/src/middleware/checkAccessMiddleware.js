// /**
//  * @file checkAccess.js
//  * @description Middleware to verify if the tenant's current active subscription plan includes a specific feature.
//  */

// const subscriptionRepository = require('../repositories/subscriptionRepository');

// /**
//  * @param {string} requiredFeatureKey - The feature_key to check 
//  */
// const checkAccess = (requiredFeatureKey) => {
//     return async (req, res, next) => {
//         try {
//             //get tenant id from body
//             const tenantId = req.user?.tenant_id;

//             //if not tenant id return false
//             if (!tenantId) {
//                 return res.status(401).json({
//                     success: false,
//                     message: req.t("tenant.not_found")
//                 });
//             }

//             // Pass tenantId, the string 'active', and the requiredFeatureKey
//             const hasAccess = await subscriptionRepository.checkAccess(
//                 tenantId, 
//                 requiredFeatureKey
//             );
//             //if not access => block
//             if (!hasAccess) {
//                 return res.status(403).json({
//                     success: false,
//                     message: req.t("plan.required_upgrade",{feature:requiredFeatureKey})
//                 });
//             }
//             // if can access, go to next
//             next();

//         } catch (error) {
//             //Bring err to next block
//             next(error); 
//         }
//     };
// };

// module.exports = checkAccess;