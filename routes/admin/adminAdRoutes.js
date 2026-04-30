const express = require("express");
const {
  getAllAds,
  changeAdStatus,
  deleteAd,
  bulkDeleteAds,
} = require("../../controllers/admin/adminAdController");

const router = express.Router();

router.route("/").get(getAllAds);
router.route("/bulk-delete").post(bulkDeleteAds);
router.route("/:id").delete(deleteAd);
router.route("/:id/status").put(changeAdStatus);

module.exports = router;
