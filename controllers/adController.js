const asyncHandler = require("express-async-handler");
const adService = require("../services/adService");

// GET /api/ads
// GET /api/ads?category=id&subcategory=id&location=casablanca&minPrice=100&maxPrice=5000
const getAllAds = asyncHandler(async (req, res) => {
  const ads = await adService.getAllAds(req.query);
  res.status(200).json(ads);
});

// GET /api/ads/:id
const getAdById = asyncHandler(async (req, res) => {
  const ad = await adService.getAdById(req.params.id);
  res.status(200).json(ad);
});

// GET /api/ads/user  (uses req.user.id from protect middleware)
const getAdsByUser = asyncHandler(async (req, res) => {
  const ads = await adService.getAdsByUser(req.user.id, req.query);
  res.status(200).json(ads);
});


// POST /api/ads
const createAd = asyncHandler(async (req, res) => {
  const ad = await adService.createAd(req.body, req.user.id);
  res.status(201).json({ message: "Ad created", data: ad });
});

// PUT /api/ads/:id
const updateAd = asyncHandler(async (req, res) => {
  const ad = await adService.updateAd(req.params.id, req.body, req.user.id);
  res.status(200).json({ message: "Ad updated", data: ad });
});

// DELETE /api/ads/:id
const deleteAd = asyncHandler(async (req, res) => {
  await adService.deleteAd(req.params.id, { userId: req.user.id });
  res.status(200).json({ message: "Ad deleted" });
});

const changeAdStatus = asyncHandler(async (req, res) => {
  const ad = await adService.changeAdStatus(req.params.id, req.body.status,{userId:req.user.id});
  res.status(200).json({ message: "Ad status updated", data: ad });
});



const getPopularAds = asyncHandler(async(req,res) => {
    const ads = await adService.getPopularAds();
    
    res.status(200).json({
        message: 'Popular ads fetched successfully',
        count: ads.length,
        data: ads
    });
});

module.exports = {
  getAllAds,
  getAdById,
  changeAdStatus,
  getAdsByUser,
  getPopularAds,
  createAd,
  updateAd,
  deleteAd,
};