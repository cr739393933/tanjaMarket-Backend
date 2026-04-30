const User = require("../models/User");
const Ad = require("../models/Ad");
const ErrorResponse = require("../utils/ErrorResponse");

const getAllUsers = async (filter = {}) => {
  const query = {};
  query.role = { $ne: "admin" };

  if (filter.status) query.status = filter.status;
  if (filter.search) {
    query.$or = [
      { fullName: new RegExp(filter.search, "i") },
      { email: new RegExp(filter.search, "i") },
      { phone: new RegExp(filter.search, "i") },
    ];
  }

  const page = Number(filter.page) || 1;
  const limit = Number(filter.limit) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query,"-password -role -avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  // Fetch ad counts for all users in one query
  const userIds = users.map((u) => u._id);
  const adCounts = await Ad.aggregate([
    { $match: { user: { $in: userIds } } },
    { $group: { _id: "$user", count: { $sum: 1 } } },
  ]);

  // Map counts back to each user
  const adCountMap = Object.fromEntries(
    adCounts.map(({ _id, count }) => [_id.toString(), count]),
  );

  const usersWithAdCount = users.map((u) => ({
    ...u,
    adsCount: adCountMap[u._id.toString()] ?? 0,
  }));

  return {
    data: usersWithAdCount,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password -role -avatar").lean();
  if (!user) throw new ErrorResponse(`User not found with id: ${id}`, 404);

  const ads = await Ad.find({ user: id })
    .populate("category", "name")
    .populate("subcategory", "name")
    .sort({ createdAt: -1 })
    .lean();

  return { ...user, ads };
};

const banUser = async (id, status) => {
  const ALLOWED = ["active", "banned", "suspended"];
  if (!ALLOWED.includes(status)) {
    throw new ErrorResponse(`Invalid status "${status}"`, 400);
  }

  const user = await User.findById(id);
  if (!user) throw new ErrorResponse(`User not found with id: ${id}`, 404);

  if (user.role === "admin") {
    throw new ErrorResponse("Cannot ban an admin", 403);
  }

  user.status = status;
  await user.save();

  const adStatus = status === "active" ? "published" : "rejected";
  await Ad.updateMany({ user: id }, { status: adStatus });

  return user;
};

const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ErrorResponse(`User not found with id: ${id}`, 404);

  if (user.role === "admin") {
    throw new ErrorResponse("Cannot delete an admin", 403);
  }

  // delete all his ads first
  await Ad.deleteMany({ user: id });
  await user.deleteOne();
};

module.exports = {
  getAllUsers,
  getUserById,
  banUser,
  deleteUser,
};
