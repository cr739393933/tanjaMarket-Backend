const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
      minlength: [5, "Le titre doit contenir au moins 5 caractères"],
      maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "La description ne peut pas dépasser 2000 caractères"],
    },

    price: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: [0, "Le prix ne peut pas être négatif"],
      max: [100000000, "Le prix est trop élevé"],
    },

    phone: {
      type: String,
      match: [
        /^(\+212|0)([ \-]?\d){9}$/,
        "Veuillez fournir un numéro de téléphone marocain valide",
      ],
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      validate: {
        validator: (images) => images.length <= 10,
        message: "Vous pouvez télécharger un maximum de 10 images",
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La catégorie est obligatoire"],
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: [true, "La sous-catégorie est obligatoire"],
    },

    fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'utilisateur est obligatoire"],
    },

    location: {
      address: {
        type: String,
        trim: true,
        maxlength: [200, "L'adresse ne peut pas dépasser 200 caractères"],
      },
      city: {
        type: String,
        trim: true,
        default: "Tanger",
      },
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "published", "rejected", "sold", "expired"],
        message: '"{VALUE}" n\'est pas un statut valide',
      },
      default: "published",
    },

    views: {
      type: Number,
      default: 0,
      min: [0, "Le nombre de vues ne peut pas être négatif"],
    },
  },
  { timestamps: true },
);

adSchema.index({ category: 1 });
adSchema.index({ subcategory: 1 });
adSchema.index({ user: 1 });
adSchema.index({ price: 1 });
adSchema.index({ status: 1 });
adSchema.index({ category: 1, status: 1 });
adSchema.index({ createdAt: -1 });
adSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Ad", adSchema);
