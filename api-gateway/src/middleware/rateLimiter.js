//Implement rate limiting (express-rate-limit)
import rateLimit from 'express-rate-limit';
//Add IP throttling to prevent abuse and DDoS attacks
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' },
});

export default rateLimiter;
