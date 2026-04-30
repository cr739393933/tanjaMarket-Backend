const FieldTemplate = require("../models/FieldTemplate");
const Subcategory = require("../models/Subcategory");
const ErrorResponse = require("../utils/ErrorResponse");

const getFieldsBySubcategory = async (subcategoryId) => {
  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) {
    throw new ErrorResponse(`Subcategory not found with id: ${subcategoryId}`, 404);
  }

  return await FieldTemplate.find({ subcategory: subcategoryId })
    .sort({ order: 1 })
    .lean();
};

const getFieldById = async (id) => {
  const field = await FieldTemplate.findById(id)
    .populate("subcategory", "name")
    .lean();

  if (!field) {
    throw new ErrorResponse(`Field not found with id: ${id}`, 404);
  }

  return field;
};

const createField = async (data) => {
  const subcategory = await Subcategory.findById(data.subcategory);
  if (!subcategory) {
    throw new ErrorResponse(`Subcategory not found with id: ${data.subcategory}`, 404);
  }

  // options required for select and multiselect
  if (["select", "multiselect"].includes(data.type) && (!data.options || data.options.length === 0)) {
    throw new ErrorResponse(`Options are required for type "${data.type}"`, 400);
  }

  const existing = await FieldTemplate.findOne({
    name: data.name,
    subcategory: data.subcategory,
  });
  if (existing) {
    throw new ErrorResponse(
      `A field with name "${data.name}" already exists in this subcategory`,
      409
    );
  }

  return await FieldTemplate.create(data);
};

const updateField = async (id, data) => {
  const field = await FieldTemplate.findById(id);
  if (!field) {
    throw new ErrorResponse(`Field not found with id: ${id}`, 404);
  }

  const type = data.type || field.type;
  if (["select", "multiselect"].includes(type) && data.options && data.options.length === 0) {
    throw new ErrorResponse(`Options cannot be empty for type "${type}"`, 400);
  }

  return await FieldTemplate.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
};

const deleteField = async (id) => {
  const field = await FieldTemplate.findById(id);
  if (!field) {
    throw new ErrorResponse(`Field not found with id: ${id}`, 404);
  }

  await field.deleteOne();
};

module.exports = {
  getFieldsBySubcategory,
  getFieldById,
  createField,
  updateField,
  deleteField,
};