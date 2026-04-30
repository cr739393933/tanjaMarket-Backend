const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subcategorySchema.index({ category: 1, name: 1 }, { unique: true });

// cascade delete 
subcategorySchema.post("deleteOne", { document: true, query: false }, async function () {
  const FieldTemplate = mongoose.model("FieldTemplate");
  await FieldTemplate.deleteMany({ subcategory: this._id });
});

module.exports = mongoose.model("Subcategory", subcategorySchema);