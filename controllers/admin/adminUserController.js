const asyncHandler = require("express-async-handler");
const adminUserService = require("../../services/Adminuserservice");

// GET /api/admin/users
// GET /api/admin/users?status=banned&search=john&page=1
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminUserService.getAllUsers(req.query);
  res.status(200).json(users);
});

// GET /api/admin/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await adminUserService.getUserById(req.params.id);
  res.status(200).json(user);
});

// PUT /api/admin/users/:id/ban
// body: { status: "banned" | "suspended" | "active" }
const banUser = asyncHandler(async (req, res) => {
  const user = await adminUserService.banUser(req.params.id, req.body.status);
  res.status(200).json({ message: `User status updated to "${req.body.status}"`, data: user });
});

// DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  await adminUserService.deleteUser(req.params.id);
  res.status(200).json({ message: "User and all his ads deleted" });
});

module.exports = {
  getAllUsers,
  getUserById,
  banUser,
  deleteUser,
};