// Import the core i18next library
const i18next = require('i18next');
// Import the file system backend to read JSON translation files
const Backend = require('i18next-fs-backend');
// Import HTTP middleware to integrate i18next with Express.js
const middleware = require('i18next-http-middleware');
// Import Node.js path module for resolving directory paths
const path = require('path');


/**
 * @file i18n.js
 * @description Configures internationalization (i18n) for the application.
 * This module sets up 'i18next' to dynamically load translation files (JSON)
 * and automatically detect the client's preferred language via HTTP headers.
 * This eliminates hardcoded strings and supports multi-language API responses.
 */


i18next
  // 1. Use the file system backend to load translation resources
  .use(Backend)
  
  // 2. Use the language detector to identify the user's language 
  // (e.g., from the 'Accept-Language' header in the HTTP request)
  .use(middleware.LanguageDetector)
  
  // 3. Initialize the i18next instance with specific configurations
  .init({
    // Set Vietnamese ('vi') as the default fallback language if the requested language is missing
    fallbackLng: 'en', 
    
    // Configuration for the file system backend
    backend: {
      // Define the dynamic path pattern to load the JSON language files. 
      // '{{lng}}' will be replaced by the detected language code (e.g., 'en' or 'vi')
      loadPath: path.join(__dirname, './lang/{{lng}}.json') 
    }
  });

// Export the configured i18next instance and the Express middleware
module.exports = { i18next, middleware };