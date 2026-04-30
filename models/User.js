const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Le nom complet est obligatoire"],
      trim: true,
      minlength: [3, "Le nom complet doit contenir au moins 3 caractères"],
      maxlength: [50, "Le nom complet ne peut pas dépasser 50 caractères"],
    },

    email: {
      type: String,
      required: [true, "L'adresse email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Veuillez fournir une adresse email valide",
      ],
    },

    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
      select: false,
    },

    phone: {
      type: String,
      required: [true, "Le numéro de téléphone est obligatoire"],
      trim: true,
      match: [
        /^(\+212|0)([ \-]?\d){9}$/,
        "Veuillez fournir un numéro de téléphone marocain valide",
      ],
    },

    avatar: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: {
        values: ["active", "banned", "suspended"],
        message: '"{VALUE}" n\'est pas un statut valide',
      },
      default: "active",
    },

    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: '"{VALUE}" n\'est pas un rôle valide',
      },
      default: "user",
    },

   
    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// indexes
userSchema.index({ phone: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model("User", userSchema);