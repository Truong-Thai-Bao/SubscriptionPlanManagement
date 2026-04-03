/**
 * @file BaseController.js
 * @description Base controller to handle standard CRUD operations. 
 * Other controllers should extend this class to avoid code duplication.
 */

class BaseController {
    /**
     * @param {Object} service - The specific service instance (e.g., planService)
     * @param {string} namespace - The i18n prefix for messages (e.g., 'plan', 'tenant')
     */
    constructor(service, namespace) {
        this.service = service;
        this.namespace = namespace;
    }

    // Use arrow functions so 'this' remains bound to the class instance 
    // when passed as an Express route handler.

    getAll = async (req, res, next) => {
        try {
            // Note: Ensure all your services use standard method names like 'getAll', 'getById', 'create', etc.
            const data = await this.service.getAll();
            return res.status(200).json({ 
                success: true, 
                data: data 
            });
        } catch (error) {
            next(error); // Always pass errors to the global errorHandler
        }
    };

    getById = async (req, res, next) => {
        try {
            const data = await this.service.getById(req.params.id,req.user);
            if (!data) {
                // Dynamically generate the error key: e.g., 'plan.not_found'
                const error = new Error(`${this.namespace}.not_found`);
                error.statusCode = 404;
                throw error;
            }
            return res.status(200).json({ 
                success: true, 
                data: data, 
                message: req.t(`${this.namespace}.success.get`) 
            });
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            const newData = await this.service.create(req.body,req.user);
            return res.status(201).json({
                success: true,
                message: req.t(`${this.namespace}.success.create`),
                data: newData
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const updatedData = await this.service.update(req.params.id, req.body,req.user);
            return res.status(200).json({ 
                success: true, 
                data: updatedData, 
                message: req.t(`${this.namespace}.success.update`) 
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            await this.service.delete(req.params.id,req.user);
            return res.status(200).json({ 
                success: true, 
                message: req.t(`${this.namespace}.success.delete`) 
            });
        } catch (error) {
            next(error);
        }
    };

    deactivate = async (req, res, next) => {
        try {
            const success = await this.service.deactivate(req.params.id,req.user);
            if (!success) {
                const error = new Error(`${this.namespace}.not_found`);
                error.statusCode = 404;
                throw error;
            }
            return res.status(200).json({ 
                success: true, 
                message: req.t(`${this.namespace}.success.deactivate`) 
            });
        } catch (error) {
            next(error);
        }
    };

    activate = async (req, res, next) => {
        try {
            const success = await this.service.activate(req.params.id,req.user);
            if (!success) {
                const error = new Error(`${this.namespace}.not_found`);
                error.statusCode = 404;
                throw error;
            }
            return res.status(200).json({ 
                success: true, 
                message: req.t(`${this.namespace}.success.activate`) 
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = BaseController;