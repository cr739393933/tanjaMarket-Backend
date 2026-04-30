const asyncHandler = require("express-async-handler");
const subcategoryService = require("../services/subcategoryService");

// GET /api/subcategories
// GET /api/subcategories?category=664f1e2b
const getSubcategories = asyncHandler(async (req, res) => {
  const subcategories = await subcategoryService.getAllSubcategories(req.query);
  res.status(200).json(subcategories);
});

// GET /api/subcategories/:id
const getSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await subcategoryService.getSubcategoryById(req.params.id);
  res.status(200).json(subcategory);
});

// POST /api/subcategories
const createSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await subcategoryService.createSubcategory(req.body);
  res.status(201).json({ message: "Subcategory created", data: subcategory });
});

// PUT /api/subcategories/:id
const updateSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await subcategoryService.updateSubcategory(req.params.id, req.body);
  res.status(200).json({ message: "Subcategory updated", data: subcategory });
});

// DELETE /api/subcategories/:id
const deleteSubcategory = asyncHandler(async (req, res) => {
  await subcategoryService.deleteSubcategory(req.params.id);
  res.status(200).json({ message: "Subcategory deleted" });
});

module.exports = {
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};