const SavedAd = require("../models/SavedAd");

const toggleSave = async (userId, adId) => {
  const existing = await SavedAd.findOne({ user: userId, ad: adId });
  if (existing) {
    await existing.deleteOne();
    return { saved: false };
  }
  await SavedAd.create({ user: userId, ad: adId });
  return { saved: true };
};

const getSavedAds = async (userId) => {
  const saved = await SavedAd.find({ user: userId })
    .populate({
      path: "ad",
      populate: [
        { path: "category", select: "name icon" },
        { path: "subcategory", select: "name" },
      ],
    })
    .sort({ createdAt: -1 })
    .lean();

  return saved.map((item) => item.ad);
};

const isSaved = async (userId, adId) => {
  const existing = await SavedAd.findOne({ user: userId, ad: adId });
  return !!existing;
};
const getSavedAdsCount = async (userId) => {
  return await SavedAd.countDocuments({ user: userId });
};
const getSavedAdIds = async (userId) => {
  const saved = await SavedAd.find({ user: userId }).select("ad -_id");
  return saved.map((s) => s.ad.toString());
};
module.exports = { toggleSave, getSavedAds, isSaved ,getSavedAdsCount,getSavedAdIds};