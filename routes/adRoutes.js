const express = require("express");
const {
  getAllAds,
  getAdById,
  getAdsByUser,
  createAd,
  updateAd,
  deleteAd,
  changeAdStatus,
} = require("../controllers/adController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { createAdSchema } = require("../validations/createAdSchema");

const router = express.Router();

router.route("/").get(getAllAds).post(protect, validate(createAdSchema), createAd);

router.route("/user").get(protect, getAdsByUser);

router.route("/:id/status").put(protect, changeAdStatus);

router
  .route("/:id")
  .get(getAdById)
  .put(protect,validate(createAdSchema.partial()), updateAd) // .partial() makes all fields optional for PATCH/PUT
  .delete(protect, deleteAd);


module.exports = router;
