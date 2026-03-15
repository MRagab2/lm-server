const { rateLimit } = require("express-rate-limit");

/**
 * Max 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per window
  message: { message: "Too many requests, please try again after 15 minutes." },
  standardHeaders: true, // adds RateLimit headers to response
  legacyHeaders: false, // disables X-RateLimit headers
});

/**
 * Strict limiter for auth routes — prevents brute force attacks
 * Max 10 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // only 10 login/register attempts
  message: {
    message: "Too many auth attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, authLimiter };
