const express = require("express");
const { protect, authorize } = require("../../middlewares/authMiddleware");

const router = express.Router();

// protect all admin routes in one place
router.use(protect, authorize("admin"));

router.use("/ads", require("./adminAdRoutes"));

router.use("/users", require("./adminUserRoutes"));


// router.use("/stats", require("./adminStatsRoutes"));

module.exports = router;
