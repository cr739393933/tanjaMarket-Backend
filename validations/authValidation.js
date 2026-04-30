const { z } = require("zod");

exports.registerSchema = z.object({
  fullName: z
    .string({ required_error: "Veuillez entrer votre nom complet" })
    .trim()
    .min(3, "Le nom complet est trop court — 3 caractères minimum")
    .max(50, "Le nom complet est trop long — 50 caractères maximum"),

  email: z
    .string({ required_error: "Veuillez entrer votre adresse email" })
    .trim()
    .toLowerCase()
    .email("Veuillez entrer une adresse email valide"),

  password: z
    .string({ required_error: "Veuillez entrer un mot de passe" })
    .min(6, "Le mot de passe est trop court — 6 caractères minimum"),

  phone: z
    .string({ required_error: "Veuillez entrer votre numéro de téléphone" })
    .regex(
      /^(\+212|0)([ \-]?\d){9}$/,
      "Veuillez entrer un numéro de téléphone marocain valide (ex: 0612345678)"
    ),
});

exports.loginSchema = z.object({
  email: z
    .string({ required_error: "Veuillez entrer votre adresse email" })
    .trim()
    .toLowerCase()
    .email("Veuillez entrer une adresse email valide"),

  password: z
    .string({ required_error: "Veuillez entrer votre mot de passe" }),
});