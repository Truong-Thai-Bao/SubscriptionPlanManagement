/**
 * Internationalization (i18n) Middleware.
 * * This middleware detects the preferred language from the client's request headers
 * and attaches it to the request object (`req.lang`) for downstream services.
 * * It ensures that the application provides localized responses based on the 
 * "Accept-Language" header, defaulting to English if no supported language is found.
 * * @module middlewares/i18nMiddleware
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const i18nMiddleware = (req, res, next) => {
    // Retrieves the language preference from headers, defaulting to "en"
    const rawLang = req.headers["accept-language"] || "en";
    
    // Normalizes the language string (e.g., "en-US,en;q=0.9" -> "en")
    const lang = rawLang.split(',')[0].split('-')[0].trim().toLowerCase();
    
    /**
     * Set the global language for the current request context.
     * Currently supports: 'vi' (Vietnamese) and 'en' (English - Default).
     * @type {string}
     */
    req.lang = (lang === 'vi') ? 'vi' : 'en'; 
    
    console.log(`>>> Global Lang: ${req.lang}`);
    next();
};
module.exports = i18nMiddleware;
