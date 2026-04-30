const asyncHandler = require("express-async-handler");
const savedAdService = require("../services/savedAdService");

// POST /api/saved/:adId — toggle save/unsave
const toggleSave = asyncHandler(async (req, res) => {
  const result = await savedAdService.toggleSave(req.user.id, req.params.adId);
  res.status(200).json(result);
});

// GET /api/saved — get all saved ads
const getSavedAds = asyncHandler(async (req, res) => {
  const ads = await savedAdService.getSavedAds(req.user.id);
  res.status(200).json({ data: ads });
});

const checkSaved = asyncHandler(async (req, res) => {
  const result = await savedAdService.isSaved(req.user.id, req.params.adId);
  res.status(200).json({ isSaved: result });
});

const getSavedAdsCount = asyncHandler(async (req, res) => {
  const count = await savedAdService.getSavedAdsCount(req.user.id);
  res.status(200).json({ count });
});
const getSavedAdIds = asyncHandler(async (req, res) => {
  const ids = await savedAdService.getSavedAdIds(req.user.id);
  res.status(200).json({ ids });
})
module.exports = { toggleSave, getSavedAds ,checkSaved,getSavedAdsCount ,getSavedAdIds};