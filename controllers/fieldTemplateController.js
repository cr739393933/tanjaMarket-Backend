const asyncHandler = require("express-async-handler");
const fieldTemplateService = require("../services/fieldTemplateService");

// GET /api/fields?subcategory=id
const getFields = asyncHandler(async (req, res) => {
  const fields = await fieldTemplateService.getFieldsBySubcategory(req.query.subcategory);
  res.status(200).json(fields);
});

// GET /api/fields/:id
const getField = asyncHandler(async (req, res) => {
  const field = await fieldTemplateService.getFieldById(req.params.id);
  res.status(200).json(field);
});

// POST /api/fields
const createField = asyncHandler(async (req, res) => {
  const field = await fieldTemplateService.createField(req.body);
  res.status(201).json({ message: "Field created", data: field });
});

// PUT /api/fields/:id
const updateField = asyncHandler(async (req, res) => {
  const field = await fieldTemplateService.updateField(req.params.id, req.body);
  res.status(200).json({ message: "Field updated", data: field });
});

// DELETE /api/fields/:id
const deleteField = asyncHandler(async (req, res) => {
  await fieldTemplateService.deleteField(req.params.id);
  res.status(200).json({ message: "Field deleted" });
});

module.exports = {
  getFields,
  getField,
  createField,
  updateField,
  deleteField,
};