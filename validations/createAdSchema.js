const { z } = require("zod");

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Identifiant invalide, veuillez réessayer");

exports.createAdSchema = z.object({
  title: z
    .string({ required_error: "Veuillez donner un titre à votre annonce" })
    .trim()
    .min(5, "Le titre est trop court — 5 caractères minimum")
    .max(100, "Le titre est trop long — 100 caractères maximum"),

  description: z
    .string()
    .trim()
    .max(2000, "La description est trop longue — 2000 caractères maximum")
    .optional(),

  price: z
    .number({
      required_error: "Veuillez indiquer un prix",
      invalid_type_error: "Le prix doit être un nombre",
    })
    .min(0, "Le prix ne peut pas être négatif")
    .max(100_000_000, "Ce prix est trop élevé"),

  phone: z
    .string()
    .regex(
      /^(\+212|0)([ \-]?\d){9}$/,
      "Veuillez entrer un numéro de téléphone marocain valide (ex: 0612345678)",
    ),
  images: z
    .array(
      z.object({
        url: z.string(),
        public_id: z.string(),
      }),
      { invalid_type_error: "Les images doivent être un tableau d'objets" },
    )
    .min(1, "Veuillez ajouter au moins une photo")
    .max(10, "Vous pouvez télécharger 10 images maximum"),
  category: objectId.refine(Boolean, "Veuillez sélectionner une catégorie"),

  subcategory: objectId.refine(
    Boolean,
    "Veuillez sélectionner une sous-catégorie",
  ),

  fields: z.record(z.unknown()).optional(),

  location: z
    .object({
      address: z
        .string()
        .trim()
        .max(200, "L'adresse est trop longue")
        .optional(),
      city: z
        .string()
        .trim()
        .max(100, "Le nom de la ville est trop long")
        .optional(),
    })
    .optional(),
});
