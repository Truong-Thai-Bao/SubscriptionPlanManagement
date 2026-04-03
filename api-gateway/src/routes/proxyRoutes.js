import express from 'express';
import { forwardWithRetry } from '../services/proxyService.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  subscriptionServiceUrl as subscriptionService,
  lmsServiceUrl as lmsService,
  communityServiceUrl as communityService,
} from '../config/services.js';

const router = express.Router();

const routeMap = [
  { prefix: '/subscriptions', target: subscriptionService },
  { prefix: '/lms', target: lmsService },
  { prefix: '/community', target: communityService },
];

router.use(async (req, res, next) => {
  // req.path is already normalized by Express (mount point /api is removed)
  // e.g., POST /api/subscriptions/api/auth/login => req.path = /subscriptions/api/auth/login
  const match = routeMap.find((r) => req.path.startsWith(r.prefix));
  console.log('req.originalUrl:', req.originalUrl, 'req.path:', req.path, 'matched route:', match?.prefix);
  
  if (!match || !match.target) {
    return next(new AppError(404, `Service route not found: ${req.originalUrl}`));
  }

  try {
    const response = await forwardWithRetry({
      req,
      targetBaseUrl: match.target,
      timeoutMs: Number(process.env.PROXY_TIMEOUT_MS || 5000),
      retryCount: Number(process.env.PROXY_RETRY_COUNT || 2),
      matchedPrefix: match.prefix,
    });

    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      return next(new AppError(504, 'Gateway timeout', { upstream: match.target }));
    }
    return next(
      new AppError(502, 'Upstream service unavailable', {
        upstream: match.target,
        cause: err.message,
      }),
    );
  }
});

export default router;
