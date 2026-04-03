//Add middleware to verify JWTs on protected routes.
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

// Allow specific routes to skip JWT validation (e.g., /health).
const publicRoutes = [
  '/api/health',
  '/auth/api/login',
  '/auth/api/register',
  '/auth/api/send-otp',
  '/auth/api/verify-otp',
  '/api/subscriptions/api/auth/login',
  '/api/subscriptions/api/auth/register',
  '/api/subscriptions/api/auth/send-otp',
  '/api/subscriptions/api/auth/verify-otp',
  '/subscriptions/api/auth/login',
  '/subscriptions/api/auth/register',
  '/subscriptions/api/auth/send-otp',
  '/subscriptions/api/auth/verify-otp',
  '/favicon.ico'
];

const jwtMiddleware = (req, res, next) => {
  const path = req.path;
  const correlationId = req.headers['x-correlation-id'] || 'no-id';

  if (publicRoutes.some(route => path.startsWith(route))) {

    return next();
  }
  // Return 401 Unauthorized when token is invalid or expired.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn(`[${correlationId}] Missing or invalid Authorization header for path: ${path}`);
    return next(new AppError(401, 'Unauthorized: No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {

    // Extract claims from JWT payload for user context.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Store decoded user info in req.user for downstream use.
    req.user = {
      user_id: decoded.id,
      role: decoded.role_id,
      // tenant_id: decoded.tenant_id || 'default'
    };

    // Log token checks, failures, and correlation IDs for traceability.
    console.log(`[${correlationId}] Token validated for user_id: ${req.user.user_id}, path: ${path}`);
    next();
  } catch (err) {

    if (err.name === 'TokenExpiredError') {
      // Return 401 Unauthorized when token is invalid or expired.
      return next(new AppError(401, 'Unauthorized: Token expired'));
    }
    // Return 401 Unauthorized when token is invalid or expired.
    return next(new AppError(401, 'Unauthorized: Invalid token'));
  }
};

export default jwtMiddleware;
