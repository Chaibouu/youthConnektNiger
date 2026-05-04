import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/events/ycs-sahel3/billet-data?registrationId=…&token=…
 * Données affichables pour le template HTML du billet (vérifie ticketToken).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const registrationId = searchParams.get("registrationId");
    const token = searchParams.get("token");

    if (!registrationId || !token) {
      return NextResponse.json(
        { error: "registrationId et token requis" },
        { status: 400 }
      );
    }

    const row = await db.youthConnektSahel3Registration.findFirst({
      where: { id: registrationId, ticketToken: token },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        city: true,
        countryOfResidence: true,
        organisationEntreprise: true,
        createdAt: true,
      },
    });

    if (!row) {
      return NextResponse.json({ error: "Billet introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      eventTitle: "YouthConnekt Sahel — 3e édition",
      registrationId: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      city: row.city,
      countryOfResidence: row.countryOfResidence,
      organisationEntreprise: row.organisationEntreprise,
      registeredAt: row.createdAt.toISOString(),
    });
  } catch (e) {
    console.error("billet-data:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
