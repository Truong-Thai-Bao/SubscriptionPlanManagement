/**
 * Standardized Response Data Transfer Object.
 * * This class ensures a consistent JSON structure for all API responses across the system.
 * It encapsulates the status code, localized messages, success flags, and the actual 
 * data payload or error details.
 * * @class ResponseDTO
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-18
 */

class ResponseDTO{
    /**
     * Creates an instance of ResponseDTO.
     * * @param {string} message - Localized descriptive message for the client.
     * @param {number} statusCode - HTTP status code (e.g., 200, 400, 404, 500).
     * @param {boolean} [success=false] - Boolean flag indicating if the operation was successful.
     * @param {Object|Array|null} [result=null] - The main data payload returned to the client.
     * @param {Object|Array|null} [errors=null] - Detailed error information (if any).
     */
    constructor(message, statusCode, success = false, result = null, errors = null) {
        /** @type {number} */
        this.statusCode = statusCode;

        /** @type {string} */
        this.message = message || "";

        /** @type {boolean} */
        this.isSuccess = success;

        /** @type {Object|Array|null} */
        this.result = result;

        /** @type {Object|Array|null} */
        this.errors = errors;
    }

    /**
     * Serializes the ResponseDTO instance to a JSON string.
     * * Equivalent to overriding ToString() using JsonSerializer in .NET.
     * Useful for logging or sending raw string responses.
     * * @returns {string} JSON string representation of the object.
     */
    toString() {
        return JSON.stringify(this);
    }
}

module.exports = ResponseDTO;