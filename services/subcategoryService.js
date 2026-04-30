const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const Ad = require("../models/Ad");
const ErrorResponse = require("../utils/ErrorResponse");

const getAllSubcategories = async (filter = {}) => {
  const query = { isActive: true };

  if (filter.category) query.category = filter.category;

  return await Subcategory.find(query).populate("category", "name icon").lean();
};

const getSubcategoryById = async (id) => {
  const subcategory = await Subcategory.findById(id)
    .populate("category", "name icon")
    .lean();

  if (!subcategory) {
    throw new ErrorResponse(`Subcategory not found with id: ${id}`, 404);
  }

  return subcategory;
};

const createSubcategory = async (data) => {
  const category = await Category.findById(data.category);
  if (!category) {
    throw new ErrorResponse(
      `Category not found with id: ${data.category}`,
      404,
    );
  }

  const existing = await Subcategory.findOne({
    name: data.name,
    category: data.category,
  });
  if (existing) {
    throw new ErrorResponse(
      `A subcategory with name "${data.name}" already exists in this category`,
      409,
    );
  }

  const subcategory = await Subcategory.create(data);
  return subcategory.populate("category", "name icon");
};

const updateSubcategory = async (id, data) => {
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw new ErrorResponse(`Subcategory not found with id: ${id}`, 404);
  }

  if (data.category) {
    const category = await Category.findById(data.category);
    if (!category) {
      throw new ErrorResponse(
        `Category not found with id: ${data.category}`,
        404,
      );
    }
  }

  return await Subcategory.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("category", "name icon")
    .lean();
};

const deleteSubcategory = async (id) => {
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw new ErrorResponse(`Subcategory not found with id: ${id}`, 404);
  }
  const hasAds = await Ad.exists({ subcategory: id, status: "published" });
  if (hasAds)
    throw new ErrorResponse("Cannot delete subcategory with active ads", 400);

  await subcategory.deleteOne();
};

module.exports = {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
