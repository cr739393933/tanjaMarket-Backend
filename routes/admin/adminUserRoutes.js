const express = require("express");
const {
  getAllUsers,
  getUserById,
  banUser,
  deleteUser,
} = require("../../controllers/admin/adminUserController");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById).delete(deleteUser);
router.route("/:id/ban").put(banUser);

module.exports = router;