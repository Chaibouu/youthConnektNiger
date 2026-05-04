import { z } from "zod";
import {
  Gender,
  ProfessionalStatus,
  YcsSahel3EducationLevel,
  YcsSahel3Interest,
} from "@prisma/client";
import { nameSchema } from "@/lib/validation-utils";

const optionalText = (max: number, label: string) =>
  z
    .string()
    .max(max, `${label} ne peut pas dépasser ${max} caractères`)
    .optional()
    .transform((v) => (v == null || v.trim() === "" ? undefined : v.trim()));

/** Oui / Non / non renseigné — pour JSON body */
const optionalBoolean = z.preprocess(
  (val) =>
    val === "" || val === null || val === undefined ? undefined : val,
  z.boolean().optional()
);

/**
 * Formulaire d'inscription — YouthConnekt Sahel, 3e édition.
 * Aligné sur le modèle Prisma `YouthConnektSahel3Registration`.
 */
export const ycsSahel3RegistrationFormSchema = z
  .object({
    lastName: nameSchema,
    firstName: nameSchema,
    gender: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? undefined : val,
      z.nativeEnum(Gender).optional()
    ),
    countryOfResidence: z
      .string()
      .min(2, "Le pays de résidence est requis")
      .max(120),
    city: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const s = String(val).trim();
      return s === "" ? undefined : s;
    }, z
      .string()
      .min(2, "La ville doit contenir au moins 2 caractères si renseignée")
      .max(120)
      .optional()),
    phone: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const s = String(val).trim();
      return s === "" ? undefined : s;
    }, z
      .string()
      .min(8, "Le numéro de téléphone est trop court si renseigné")
      .max(32, "Le numéro de téléphone est trop long")
      .optional()),
    email: z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        return typeof val === "string" ? val.trim().toLowerCase() : val;
      },
      z.union([z.undefined(), z.string().email("Email invalide")])
    ),
    educationLevel: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? undefined : val,
      z.nativeEnum(YcsSahel3EducationLevel).optional()
    ),
    professionalStatus: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? undefined : val,
      z.nativeEnum(ProfessionalStatus).optional()
    ),
    activityDomain: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const s = String(val).trim();
      return s === "" ? undefined : s;
    }, z
      .string()
      .min(
        2,
        "Le domaine d'activité doit contenir au moins 2 caractères si renseigné"
      )
      .max(500)
      .optional()),
    organisationEntreprise: optionalText(500, "L'organisation / entreprise"),
    participatedYouthConnektBefore: optionalBoolean,
    interests: z.preprocess(
      (val) => (val == null || !Array.isArray(val) ? [] : val),
      z.array(z.nativeEnum(YcsSahel3Interest))
    ),
    hasCompany: optionalBoolean,
    companyName: z
      .string()
      .max(200, "Le nom de l'entreprise ne peut pas dépasser 200 caractères")
      .optional(),
    companySector: z
      .string()
      .max(200, "Le secteur ne peut pas dépasser 200 caractères")
      .optional(),
    isYouthOrganizationMember: optionalBoolean,
    hasBenefitedFromSupportProgram: optionalBoolean,
    /** Case unique — répliquée en API vers les 3 flags Prisma (doit être acceptée pour valider) */
    consentDataProcessing: z
      .boolean()
      .refine((v) => v === true, {
        message:
          "Vous devez accepter le traitement de vos données pour finaliser l'inscription.",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.hasCompany !== true) return;

    const name = data.companyName?.trim() ?? "";
    const sector = data.companySector?.trim() ?? "";

    if (!name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le nom de l'entreprise est requis",
        path: ["companyName"],
      });
    }
    if (!sector) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le secteur d'activité est requis",
        path: ["companySector"],
      });
    }
  });

export type YcsSahel3RegistrationFormValues = z.infer<
  typeof ycsSahel3RegistrationFormSchema
>;
