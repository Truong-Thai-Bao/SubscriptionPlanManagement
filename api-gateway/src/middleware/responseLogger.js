import logger from "../utils/logger.js";

export default function responseLogger(req, res, next) {
  const oldSend = res.send;

  res.send = function (data) {
    const statusCode = res.statusCode;
    const level =
      statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

    logger[level]({
      message: "Outgoing Response",
      method: req.method,
      url: req.originalUrl,
      statusCode,
      correlationId: req.correlationId,
    });

    return oldSend.apply(res, arguments);
  };

  next();
}
