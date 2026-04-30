const express = require("express");
const {
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getSubcategories)
  .post(protect, authorize("admin"), createSubcategory);
router
  .route("/:id")
  .get(getSubcategory)
  .put(protect, authorize("admin"), updateSubcategory)
  .delete(protect, authorize("admin"), deleteSubcategory);

module.exports = router;
