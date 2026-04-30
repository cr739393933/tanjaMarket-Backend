const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryFull
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("admin"), createCategory);
router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

router.get("/:id/full",protect,authorize("admin"),getCategoryFull);

module.exports = router;
