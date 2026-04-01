/**
 * @file errorHandler.js
 * @description  Error Handling Middleware. Catches all errors and formats the response.
 */
const errorLog = require('../models/ErrorLog.js');
const errorLogRepository = require('../repositories/errorLogRepository.js');

const errorHandler = async (err, req, res, next) => {

    // Khởi tạo fallback an toàn cho t() phòng trường hợp req.t bị thiếu
    const t = typeof req.t === 'function' ? req.t.bind(req) : (key => key);

    //Format 
    let statusCode = err.statusCode || 500;
    let msg = err.message ? t(err.message):  t('server.internal_error');
    let level = 'error';

    // Catch Validation error of Sequelize
    if(err.name === 'SequelizeValidationError'){
        // Translate each error code (VD: "policy.validation.max_storage_int") through t()
        const translatedMessages = err.errors.map(e => t(e.message));
        
        statusCode = 400;
        msg = translatedMessages.join(', ');
        level = 'warning';
    }
    //Catch Foreign key error
    else if(err.name === 'SequelizeForeignKeyConstraintError'){
        statusCode = 409;
        msg = t('plan.error.delete_constraint');
        level = 'warning';
    }

    //Catch error custom 
    else if (err.message === 'plan.validation.not_delete'){
        statusCode = 400;
        msg = t('plan.validation.not_delete');
        level = 'warning';
    }
    else if (statusCode >= 500){
        level = 'critical'
    }

    //Store log into database
    try{
        //get ip address 
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        //get id if API go through middleware
        const userId = req.user && req.user.id ? req.user.id : null;

        //store in db
        await errorLogRepository.create({
            level : level,
            message: msg.substring(0,1000),
            stack_trace: err.stack ? err.stack : null,
            url : req.originalUrl,
            method : req.method,
            ip_address : ipAddress,
            user_id : userId
        });
    }
    catch(error){
        console.error(error);
    }

    return res.status(statusCode).json({
        success:false,
        message:msg
    })
};

module.exports = errorHandler;