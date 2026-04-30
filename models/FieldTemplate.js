const mongoose = require("mongoose");

const fieldTemplateSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["text", "number", "select", "multiselect", "boolean", "date"],
    },

    placeholder: {
      type: String,
      default: "",
    },

    options: {
      type: [String],
      default: [],
    },

    required: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    min: {
      type: Number,
    },

    max: {
      type: Number,
    },

    unit: {
      type: String,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
  },
  { timestamps: true }
);

fieldTemplateSchema.index({ subcategory: 1, name: 1 }, { unique: true });

module.exports = mongoose.models.FieldTemplate || mongoose.model("FieldTemplate", fieldTemplateSchema);