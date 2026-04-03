import logger from "../utils/logger.js";

export default function requestLogger(req, res, next) {
  logger.info({
    message: "Incoming Request",
    method: req.method,
    url: req.originalUrl,
    correlationId: req.correlationId,
  });

  next();
}