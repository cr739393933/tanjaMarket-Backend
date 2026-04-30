const asyncHandler = require("express-async-handler");
const adService = require("../../services/adService");

// GET /api/admin/ads
// GET /api/admin/ads?status=draft&category=id
const getAllAds = asyncHandler(async (req, res) => {
  const ads = await adService.getAllAdsAdmin(req.query);
  res.status(200).json(ads);
});

// PUT /api/admin/ads/:id/status
const changeAdStatus = asyncHandler(async (req, res) => {
  const ad = await adService.updateAdStatus(req.params.id, req.body.status,{isAdmin:true});
  res.status(200).json({ message: "Ad status updated", data: ad });
});

// DELETE /api/admin/ads/:id
const deleteAd = asyncHandler(async (req, res) => {
  await adService.deleteAd(req.params.id, { isAdmin: true });
  res.status(200).json({ message: "Ad deleted" });
});

// POST /api/admin/ads/bulk-delete
const bulkDeleteAds = asyncHandler(async (req, res) => {
  const result = await adService.bulkDeleteAds(req.body.ids);
  res.status(200).json({ message: `${result.deleted} ads deleted` });
});

module.exports = {
  getAllAds,
  changeAdStatus,
  deleteAd,
  bulkDeleteAds,
};
