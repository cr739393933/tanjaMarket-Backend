const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ErrorResponse("No Token", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw new ErrorResponse("User no longer exists", 401);
  } catch (err) {
    throw new ErrorResponse("Token expired or invalid", 401);
  }

  if (req.user.status !== "active") {
    throw new ErrorResponse("Your account has been banned or suspended", 403);
  }

  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorResponse(
        `User Role ${req.user.role} not Authorized to this route `,
        403,
      );
    }
    next();
  };
};
module.exports = { protect, authorize };
