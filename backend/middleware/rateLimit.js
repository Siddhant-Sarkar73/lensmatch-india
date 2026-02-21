const rateLimit = require('express-rate-limit');

// General rate limiter: 100 requests per 15 minutes
const generalLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// Stricter rate limiter for refresh endpoints
// 1 request per 10 minutes per IP per lensId
const refreshLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1,
  keyGenerator: (req) => {
    return `${req.ip}-${req.params.lensId}`;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ success: false, rateLimited: true, retryAfterMinutes: 8 });
  }
});

module.exports = {
  generalLimit,
  refreshLimit
};
