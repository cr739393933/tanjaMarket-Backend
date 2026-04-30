// middleware/rateLimitMiddleware.js
const rateLimit = require("express-rate-limit");

const createLimiter = (max, windowMs = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: "Too many requests, please try again later"
    }
  });
};

module.exports = createLimiter;