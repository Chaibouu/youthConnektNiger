import appConfig from "@/settings";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch dynamic settings from the database if needed
    // const settings = await getSettings();

    return {
      title: {
        default: appConfig.websiteTitle || "Youth Connekt Niger",
        template: `%s | ${appConfig.websiteTitle || "Youth Connekt Niger"}`,
      },
      description:
        appConfig.websiteDescription ||
        "Plateforme officielle de Youth Connekt Niger. Connecter les jeunes nigériens aux opportunités d'emploi, d'entrepreneuriat et d'engagement citoyen.",
      keywords: [
        "Youth Connekt",
        "Niger",
        "Jeunesse",
        "Entrepreneuriat Niger",
        "Emploi Niger",
        "PNUD Niger",
        "Formation",
        "Opportunités",
        "Engagement citoyen",
        "Youth Connekt Niger",
        "Plateforme pour l'autonomisation des jeunes au Niger",
      ],
      authors: [{ name: "Chaibouu" }],
      creator: "Chaibouu",
      publisher: "Chaibouu",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      ),
      alternates: {
        canonical: "/",
      },
      openGraph: {
        type: "website",
        locale: "fr_FR",
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        title: appConfig.websiteTitle || "Youth Connekt Niger",
        description:
          appConfig.websiteDescription ||
          "Plateforme officielle de Youth Connekt Niger. Connecter les jeunes nigériens aux opportunités d'emploi, d'entrepreneuriat et d'engagement citoyen.",
        siteName: appConfig.appName || "Youth Connekt Niger",
        images: appConfig.logoUrl
          ? [
              {
                url: `${process.env.NEXT_PUBLIC_APP_URL}${appConfig.logoUrl}`,
                width: 1200,
                height: 630,
                alt: "Youth Connekt Niger Logo",
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: appConfig.websiteTitle || "Youth Connekt Niger",
        description:
          appConfig.websiteDescription ||
          "Plateforme officielle de Youth Connekt Niger. Connecter les jeunes nigériens aux opportunités d'emploi, d'entrepreneuriat et d'engagement citoyen.",
        images: appConfig.logoUrl
          ? [`${process.env.NEXT_PUBLIC_APP_URL}${appConfig.logoUrl}`]
          : [],
        creator: "@youthconnektniger",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        google: process.env.GOOGLE_VERIFICATION,
        yandex: process.env.YANDEX_VERIFICATION,
        yahoo: process.env.YAHOO_VERIFICATION,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la génération des métadonnées:", error);

    // Retourner des métadonnées par défaut en cas d'erreur
    return {
      title: "Youth Connekt Niger",
      description: "Plateforme officielle de Youth Connekt Niger. Connecter les jeunes nigériens aux opportunités d'emploi, d'entrepreneuriat et d'engagement citoyen.",
    };
  }
}
