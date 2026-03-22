/**
 * @file errorHandler.js
 * @description  Error Handling Middleware. Catches all errors and formats the response.
 */

const errorHandler = (err, req, res, next) => {
    // Catch Validation error of Sequelize
    if(err.name === 'SequelizeValidationError'){
        // Merge all key into an array
        const cleanKeys = err.errors.map(e => e.message);
        
        return res.status(400).json({
            success: false,
            message: cleanKeys 
        });
    }

    //Handling the other errors
    const statusCode = err.statusCode || 500;
    const message = err.message || req.t('server.internal_error');

    return res.status(statusCode).json({
        success:false,
        message:message
    })
};

module.exports = errorHandler;