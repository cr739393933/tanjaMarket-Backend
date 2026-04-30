const express = require("express");
const {
  getFields,
  getField,
  createField,
  updateField,
  deleteField,
} = require("../controllers/fieldTemplateController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(getFields).post(protect, authorize("admin"), createField);
router
  .route("/:id")
  .get(getField)
  .put(protect, authorize("admin"), updateField)
  .delete(protect, authorize("admin"), deleteField);

module.exports = router;
