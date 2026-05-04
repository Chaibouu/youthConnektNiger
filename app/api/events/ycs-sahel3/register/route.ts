import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getClientIP } from "@/lib/geo";
import { rateLimitRedisEmail } from "@/lib/rateLimit";
import { formatZodErrors } from "@/lib/validation-utils";
import { ycsSahel3RegistrationFormSchema } from "@/schemas/ycsSahel3Registration";

export const dynamic = "force-dynamic";

/** Chemin vers la page Next du billet HTML (à créer côté front). */
function buildTicketPagePath(
  registrationId: string,
  ticketToken: string
): string {
  const params = new URLSearchParams({
    registrationId,
    token: ticketToken,
  });
  return `/events/ycs-sahel3/billet?${params.toString()}`;
}

/**
 * POST /api/events/ycs-sahel3/register
 * Inscription publique — YouthConnekt Sahel, 3e édition.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const rlResponse = await rateLimitRedisEmail(ip);
    if (rlResponse) return rlResponse;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Corps de requête JSON invalide" },
        { status: 400 }
      );
    }

    const parsed = ycsSahel3RegistrationFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: formatZodErrors(parsed.error) },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const emailNorm = data.email?.trim().toLowerCase();

    if (emailNorm) {
      const existing = await db.youthConnektSahel3Registration.findFirst({
        where: { email: emailNorm },
      });
      if (existing) {
        return NextResponse.json(
          {
            error:
              "Une inscription avec cette adresse email existe déjà pour cet événement.",
          },
          { status: 409 }
        );
      }
    }

    const registration = await db.youthConnektSahel3Registration.create({
      data: {
        lastName: data.lastName.trim(),
        firstName: data.firstName.trim(),
        gender: data.gender ?? null,
        countryOfResidence: data.countryOfResidence.trim(),
        city: data.city?.trim() ?? null,
        phone: data.phone?.trim() ?? null,
        email: emailNorm ?? null,
        educationLevel: data.educationLevel ?? null,
        professionalStatus: data.professionalStatus ?? null,
        activityDomain: data.activityDomain?.trim() ?? null,
        organisationEntreprise: data.organisationEntreprise ?? null,
        participatedYouthConnektBefore:
          data.participatedYouthConnektBefore ?? null,
        interests: data.interests,
        hasCompany: data.hasCompany ?? null,
        companyName:
          data.hasCompany === true
            ? (data.companyName?.trim() ?? null)
            : null,
        companySector:
          data.hasCompany === true
            ? (data.companySector?.trim() ?? null)
            : null,
        isYouthOrganizationMember: data.isYouthOrganizationMember ?? null,
        hasBenefitedFromSupportProgram:
          data.hasBenefitedFromSupportProgram ?? null,
        consentEventOrganization: data.consentDataProcessing,
        consentAnonymousStatistics: data.consentDataProcessing,
        consentReports: data.consentDataProcessing,
      },
    });

    const ticketPagePath = buildTicketPagePath(
      registration.id,
      registration.ticketToken
    );
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
    const ticketPageUrl = appUrl ? `${appUrl}${ticketPagePath}` : ticketPagePath;

    return NextResponse.json(
      {
        message: "Inscription enregistrée avec succès.",
        id: registration.id,
        ticketToken: registration.ticketToken,
        ticketPagePath,
        ticketPageUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur inscription YCS Sahel 3 :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
