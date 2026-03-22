/**
 * @file AppError.js
 * @description Custom Error class to handle operational errors globally.
 */

class AppError extends Error {
    /**
     * @param {string} messageKey - The i18n translation key (e.g., 'plan.not_found')
     * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
     */
    constructor(messageKey, statusCode) {
        super(messageKey); // Gắn translation key vào biến message mặc định của Error

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        // Đánh dấu đây là lỗi đã được dự liệu trước (Operational), không phải bug hệ thống
        this.isOperational = true;

        // Ghi lại Stack Trace để biết lỗi xảy ra ở dòng code nào (rất tốt khi debug)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;