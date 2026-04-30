const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// cascade delete 
categorySchema.post("deleteOne", { document: true, query: false }, async function () {
  const Subcategory = mongoose.model("Subcategory");
  const FieldTemplate = mongoose.model("FieldTemplate");

  const subcategories = await Subcategory.find({ category: this._id }).select("_id");
  const subcategoryIds = subcategories.map((s) => s._id);

  await FieldTemplate.deleteMany({ subcategory: { $in: subcategoryIds } });
  await Subcategory.deleteMany({ category: this._id });
});

module.exports = mongoose.model("Category", categorySchema);