const sequelize = require('../config/db.js');
const tenantUserService = require('../services/tenantUserService.js');
const BaseController = require('./BaseController.js');
const {TENANT_USER_STATUS} = require('../constant/enum.js')

/**
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
class TenantUserController extends BaseController {
    constructor() {
        super(tenantUserService,'tenant_user');
    }

    /**
     * Change status of a tenant user dynamically (active, inactive, banned)
     */
    changeStatus = async (req, res, next) => {
        try {
            const { id, state } = req.params;
            const allowedStates = Object.values(TENANT_USER_STATUS);
            if (!allowedStates.includes(state)) {
                const error = new Error('tenant_user.validation.invalid_status');
                error.statusCode = 400;
                throw error;
            }

            await tenantUserService.changeStatus(id, state);

            return res.status(200).json({
                success: true,
                // return message
                message: req.t(`${this.namespace}.success.${state}`)
            });

        } catch (error) {
            next(error);
        }
    };

    /**
     * Assign new tenant role for tenant user
     */
    assignRole = async (req,res,next) =>{
        try{
            const {id} = req.params;
            const {roleId} = req.body;
            await tenantUserService.assignRole(id,roleId);

            return res.status(200).json({
                success:true,
                message: req.t(`tenant_user.assigned.success`)
            })
        }catch(err){
            next(err);
        }
    }
    //Create a new tenant user
    create = async (req, res, next) => {
        try {
            const tenantId = req.headers['x-tenant-id'];
            const newData = await tenantUserService.create(req.body,req.user,tenantId);
            return res.status(201).json({
                success: true,
                message: req.t(`tenant_user.success.create`),
                data: newData
            });
        } catch (error) {
            next(error);
        }
    };

    
}

module.exports = new TenantUserController;