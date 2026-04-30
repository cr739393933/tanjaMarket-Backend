const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  updatePassword,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const createLimiter = require("../middlewares/rateLimitMiddleware");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");
const validate = require("../middlewares/validate");

// ─── Auth routes (/api/auth) ──────────────────────────────────────────────────
const authRouter = express.Router();

authRouter.post(
  "/register",
  createLimiter(5),
  validate(registerSchema),
  register,
);
authRouter.post("/login",  validate(loginSchema), login);
authRouter.post("/refresh", createLimiter(20), refresh);
authRouter.post("/logout", logout);
authRouter.post("/logout-all", protect, logoutAll);
authRouter.post("/forgot-password", createLimiter(5), forgotPassword);
authRouter.post("/reset-password", createLimiter(5), resetPassword);

// ─── User routes (/api/users) ─────────────────────────────────────────────────
const userRouter = express.Router();

userRouter.get("/me", protect, getMe);
userRouter.put("/me", protect, updateMe);
userRouter.put("/me/password", protect, createLimiter(10), updatePassword);

module.exports = { authRouter, userRouter };
