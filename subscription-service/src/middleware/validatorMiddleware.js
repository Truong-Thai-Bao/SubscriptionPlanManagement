/**
 * Generic Validation Middleware Factory.
 * * This high-order function wraps Joi validation logic. It dynamically 
 * injects the current request language into the schema, executes validation, 
 * and formats error messages into a standardized ResponseDTO.
 * * Key features:
 * - Dynamic language injection (i18n).
 * - Automatic field name conversion to PascalCase for DTO compatibility.
 * - Non-blocking: Proceeds to next middleware if validation passes.
 * * @module middlewares/validate
 * @requires dtos/ResponseDTO
 * @param {Function} schemaFunction - A function that returns a Joi schema based on the language.
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const ResponseDTO = require("../dtos/responseDTO");

const validate = (schemaFunction) => {
  return (req, res, next) => {

    // 1. Get language from request object (set by i18nMiddleware), default is 'en'
    const lang = req.lang || 'en';

    /** @type {Object} Joi Schema generated with specific language context */
    const schema = schemaFunction(lang);

    /** @vavlue - Validated data (with types casted) | @error - Joi validation error details */
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const formattedErrors = {};

      error.details.forEach((err) => {
        // 1. Lấy tên field gốc từ Joi (ví dụ: 'name', 'email')
        const field = err.path[0];

        // 2. Tự động viết hoa chữ cái đầu (Ví dụ: 'name' -> 'Name')
        // Cách này giúp khớp với chuẩn PascalCase của DTO mà không cần check từng chữ
        const pascalField = field.charAt(0).toUpperCase() + field.slice(1);
        
        if (!formattedErrors[pascalField]) {
          formattedErrors[pascalField] = [];
        }
        formattedErrors[pascalField].push(err.message);
      });

      // Returns standardized 400 Bad Request with formatted validation errors
      return res.status(400).json(
        new ResponseDTO(
          lang === 'vi' ? "Dữ liệu không hợp lệ" : "Validation Failed",
          400,
          false,
          null,
          formattedErrors
        )
      );
    }

    // Nếu không có lỗi, gán giá trị đã validate vào req.body và cho đi tiếp (next)
    req.body = value;
    next();
  };
};

module.exports = validate;