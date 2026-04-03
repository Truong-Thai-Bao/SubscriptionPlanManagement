import logger from "../utils/logger.js";

export default function errorLogger(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    statusCode: err.statusCode || 500,
    correlationId: req.correlationId,
  });

  next(err);
}
