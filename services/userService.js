const User = require("../models/User");
const Token = require("../models/Token");
const ErrorResponse = require("../utils/ErrorResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

const register = async (data, device) => {
  const { fullName, email, password, phone, location } = data;

  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    if (existing.email === email)
      throw new ErrorResponse(
        "This email is already associated with an account",
        409,
      );
    if (existing.phone === phone)
      throw new ErrorResponse(
        "This phone is already associated with an account",
        409,
      );
  }

  const user = await User.create({
    fullName,
    email,
    password: await hashPassword(password),
    phone,
    location,
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken();

  await Token.create({
    user: user._id,
    token: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    device: device || "unknown",
  });

  return {
    accessToken,
    refreshToken,
  };
};

const login = async ({ email, password }, device) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ErrorResponse("Invalid email or password", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ErrorResponse("Invalid email or password", 401);

  if (user.status === "banned") {
    throw new ErrorResponse("Your account has been banned", 403);
  }
  if (user.status === "suspended") {
    throw new ErrorResponse("Your account has been suspended", 403);
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken();

  await Token.create({
    user: user._id,
    token: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    device: device || "unknown",
  });

  return {
    accessToken,
    refreshToken,
  };
};

const refresh = async (rawRefreshToken) => {
  if (!rawRefreshToken) throw new ErrorResponse("No refresh token", 401);

  const tokenDoc = await Token.findOne({
    token: hashToken(rawRefreshToken),
    expiresAt: { $gt: Date.now() },
  }).populate("user", "role");

  if (!tokenDoc)
    throw new ErrorResponse("Invalid or expired refresh token", 401);

  // Delete old token
  await Token.deleteOne({ _id: tokenDoc._id });

  // Generate both new tokens
  const accessToken = generateAccessToken(
    tokenDoc.user._id,
    tokenDoc.user.role,
  );
  const refreshToken = generateRefreshToken();

  // Save new refresh token to DB
  await Token.create({
    user: tokenDoc.user._id,
    token: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    device: tokenDoc.device,
  });

  return { accessToken, refreshToken }; // ✅ return both
};

const logout = async (rawRefreshToken) => {
  if (!rawRefreshToken) throw new ErrorResponse("No refresh token", 401);
  await Token.deleteOne({ token: hashToken(rawRefreshToken) });
};

const logoutAll = async (userId) => {
  // logout from all devices
  await Token.deleteMany({ user: userId });
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ErrorResponse("No account found with this email", 404);

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = hashToken(resetToken);
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <p>Hi ${user.fullName},</p>
      <p>You requested a password reset.</p>
      <p>Your reset token: <strong>${resetToken}</strong></p>
      <p>This token expires in 10 minutes.</p>
    `,
  });
};

const resetPassword = async ({ resetToken, newPassword }) => {
  const user = await User.findOne({
    resetPasswordToken: hashToken(resetToken),
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new ErrorResponse("Invalid or expired token", 400);

  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};

// ─── User ─────────────────────────────────────────────────────────────────────

const getMe = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new ErrorResponse("User not found", 404);
  return user;
};

const updateMe = async (userId, data) => {
  delete data.password;
  delete data.role;
  delete data.email;
  delete data.status;

  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) throw new ErrorResponse("User not found", 404);
  return user;
};

const updatePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new ErrorResponse("User not found", 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ErrorResponse("Current password is incorrect", 401);

  user.password = await hashPassword(newPassword);
  await user.save();
};

module.exports = {
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
};
