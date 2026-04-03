/**
 * Internationalization (i18n) Logic Provider.
 * * This utility acts as the central engine for multi-language support. 
 * It dynamically resolves nested keys from static JSON dictionaries 
 * (e.g., 'validation.register.email') into human-readable messages.
 * * Supports: English (en), Vietnamese (vi).
 * * @module lang/i18n
 * @requires ./en.json
 * @requires ./vi.json
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const en = require('./en.json');
const vi = require('./vi.json');

const translations = { en, vi };

/**
 * Resolves a dot-notation key into a localized string.
 * * Implementation logic:
 * 1. Falls back to English ('en') if the requested language is unavailable.
 * 2. Traverses the JSON object tree using the dot-separated path.
 * 3. Returns the original key as a fallback to prevent empty UI labels.
 * * @function getMessage
 * @param {string} lang - The target language code (e.g., 'en', 'vi').
 * @param {string} key - The dictionary path (e.g., "function.moodle.sync_success").
 * @returns {string} The translated message or the raw key if not found.
 */
const getMessage = (lang, key) => {
  const keys = key.split('.');
  let message = translations[lang] || translations['en'];

  keys.forEach(k => {
    message = message ? message[k] : null;
  });

  return message || key; // Trả về key nếu không tìm thấy nội dung
};

module.exports = { getMessage };