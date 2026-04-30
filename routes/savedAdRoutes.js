const express = require("express");
const {
  toggleSave,
  getSavedAds,
  checkSaved,
  getSavedAdsCount,
  getSavedAdIds
} = require("../controllers/savedAdController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getSavedAds);
router.get("/ids", getSavedAdIds);
router.get("/count", getSavedAdsCount);
router.get("/check/:adId", checkSaved);
router.post("/:adId", toggleSave);
module.exports = router;
