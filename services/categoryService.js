const Ad = require("../models/Ad");
const Subcategory = require("../models/Subcategory");
const FieldTemplate = require("../models/FieldTemplate");
const Category = require("../models/Category");
const ErrorResponse = require("../utils/ErrorResponse");

const getAllCategories = async () => {
  return await Category.find({ isActive: true }).lean();
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id).lean();
  if (!category) {
    throw new ErrorResponse(`Category not found with id: ${id}`, 404);
  }
  return category;
};
const createCategory = async (data) => {
  if (!data.name || data.name.trim() === "") {
    throw new ErrorResponse("Category name is required", 400);
  }

  const existing = await Category.findOne({ name: data.name });
  if (existing) {
    throw new ErrorResponse(
      `A category with name "${data.name}" already exists`,
      409,
    );
  }

  return await Category.create(data);
};

const updateCategory = async (id, data) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ErrorResponse(`Category not found with id: ${id}`, 404);
  }

  return await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new ErrorResponse("Category not found", 404);

  const hasAds = await Ad.exists({ category: id, status: "published" });
  if (hasAds) {
    throw new ErrorResponse("Cannot delete category with active ads", 400);
  }

  await category.deleteOne();
};

const getCategoryFull = async (id) => {
  const category = await Category.findById(id).lean();
  if (!category) throw new ErrorResponse("Category not found", 404);

  const subcategories = await Subcategory.find({ category: id }).lean();

  const fields = await FieldTemplate.find({
    subcategory: { $in: subcategories.map((s) => s._id) },
  }).lean();

  // attach fields to their subcategory
  const subcategoriesWithFields = subcategories.map((sub) => ({
    ...sub,
    fields: fields.filter(
      (f) => f.subcategory.toString() === sub._id.toString(),
    ),
  }));

  return { category, subcategories: subcategoriesWithFields };
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryFull,
};
