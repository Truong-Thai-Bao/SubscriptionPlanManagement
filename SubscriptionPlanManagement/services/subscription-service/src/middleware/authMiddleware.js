/**
 * This file to authenticate and auth 
 */

const authMiddleware = (req,res,next) => {
    //get infor from req
    const userId = req.headers['x-user-id']
    const tenantId = req.headers['x-tenant-id']
    const userRole = req.headers['x-user-role'] //get role name

    // Check if hacker bypass Gateway call directly into port of this Mircoservice
    if(!userId){
        return res.status(401).json({
            success:false,
            message: req.t('auth.missing')
        })
    }  

    // Pack into Json type 
    req.user = {
        id : userId,
        tenant_id : tenantId,
        role : userRole
    }

    next();
}

module.exports = authMiddleware;