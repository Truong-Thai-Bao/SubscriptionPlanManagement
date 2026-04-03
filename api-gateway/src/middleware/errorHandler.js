export class AppError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.code = statusCode >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 handler
export const notFoundHandler = (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.originalUrl}`));
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  const payload = {
    success: false,
    error: {
      code: err.code || (statusCode >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR'),
      message,
    },
  };

  if (err.details) {
    payload.error.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.error.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};