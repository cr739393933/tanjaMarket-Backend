const asyncHandler = require("express-async-handler");
const categoryService = require("../services/categoryService");

// GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json(categories);
});

// GET /api/categories/:id
const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.status(200).json(category);
});

// POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ message: "Category created", data: category });
});

// PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({ message: "Category updated", data: category });
});

// DELETE /api/admin/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json({ message: "Category deleted" });
});

const getCategoryFull = asyncHandler(async(req,res) => {
  const data = await categoryService.getCategoryFull(req.params.id);
  res.status(200).json(data);
})

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryFull,
};