
import express from 'express';

// const authRoutes = require('./routes/authRoutes');
// const subscriptionRoutes = require('./routes/subscriptionRoutes');
// const lmsRoutes = require('./routes/lmsRoutes');
// const communityRoutes = require('./routes/communityRoutes');
import swaggerUI from 'swagger-ui-express';
import swaggerFile from './swagger-output.json' with { type: "json" };
import healthRoutes from './routes/healthRoutes.js';
import proxyRoutes from './routes/proxyRoutes.js';
import securityMiddleware from './middleware/securityMiddleware.js';
import requestMiddleware from './middleware/requestMiddleware.js';
import rateLimiter from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import correlationId from "./middleware/correlationId.js";
import requestLogger from "./middleware/requestLogger.js";
import responseLogger from "./middleware/responseLogger.js";
import errorLogger from "./middleware/errorLogger.js";
import jwtMiddleware from './middleware/jwtMiddleware.js';
import { authorizeRoles, subscriptionMiddleware } from './middleware/authMiddleware.js';

const app = express();
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));
//Cors and Helmet Security Headers
app.use(securityMiddleware);
//Request size limits 
app.use(requestMiddleware);
//Rate Limiting

app.use(correlationId);
app.use(requestLogger);
app.use(responseLogger);

app.use(jwtMiddleware);
app.use(authorizeRoles);
app.use(subscriptionMiddleware);

// app.use('/auth', authRoutes);
// app.use('/subscriptions', subscriptionRoutes);
// app.use('/lms', lmsRoutes);
// app.use('/community', communityRoutes);
app.use('/api/health', healthRoutes);
app.use(proxyRoutes);

app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);
export default app; 
