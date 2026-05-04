"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ImageDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatYcsSahel3TicketRef } from "@/lib/ycsSahel3TicketRef";
import appConfig from "@/settings";
import { toast } from "sonner";

const TICKET_TEMPLATE_URL = "/events/ycs-sahel3/ticket_ycs3.html";

/** Infos événement affichées sur le billet (cohérent avec le template HTML Sahel 3) */
const TICKET_EVENT_META = {
  headLine: "YouthConnekt Sahel",
  metaDate: "Août 2026",
  metaTime: "—",
  metaDay: "10 · 11 · 12",
  metaClass: "PARTICIPANT",
  stubMeta: "10–12 août · Niamey",
} as const;

type BilletPayload = {
  eventTitle: string;
  registrationId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  city: string | null;
  countryOfResidence: string;
  organisationEntreprise: string | null;
  registeredAt: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Applique les données d’inscription au HTML statique (placeholders __YCS_*__). */
function buildTicketSrcDoc(
  html: string,
  payload: BilletPayload,
  siteDisplay: string
): string {
  const fullName =
    `${payload.firstName} ${payload.lastName}`.trim() || "Participant";
  const ref = formatYcsSahel3TicketRef(payload.registrationId);

  const theme = `:root{--primary:${appConfig.primaryColor};--secondary:${appConfig.secondaryColor};--primary-light:${appConfig.primaryLightColor}}`;

  let doc = html.replace(
    "</head>",
    `<style id="ycs-ticket-theme">${theme}</style><style id="ycs-ticket-live">html,body{max-width:100%;overflow-x:hidden}.demo-title{display:none!important}</style></head>`
  );

  const map: Record<string, string> = {
    __YCS_HEAD__: escapeHtml(TICKET_EVENT_META.headLine),
    __YCS_EVENT__: escapeHtml(payload.eventTitle),
    __YCS_NAME__: escapeHtml(fullName),
    __YCS_REF__: escapeHtml(ref),
    __YCS_META_DATE__: escapeHtml(TICKET_EVENT_META.metaDate),
    __YCS_META_TIME__: escapeHtml(TICKET_EVENT_META.metaTime),
    __YCS_META_DAY__: escapeHtml(TICKET_EVENT_META.metaDay),
    __YCS_META_CLASS__: escapeHtml(TICKET_EVENT_META.metaClass),
    __YCS_STUB_META__: escapeHtml(
      `${TICKET_EVENT_META.stubMeta} · ${siteDisplay}`
    ),
  };

  for (const [token, value] of Object.entries(map)) {
    doc = doc.split(token).join(value);
  }

  return doc;
}

function websiteHostname(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL;
  if (!raw) return "youthconnektniger.ne";
  try {
    return new URL(raw).hostname;
  } catch {
    return raw.replace(/^https?:\/\//i, "").split("/")[0] ?? raw;
  }
}

export function YcsSahel3BilletContent() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("registrationId");
  const token = searchParams.get("token");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [data, setData] = useState<BilletPayload | null>(null);
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPng, setDownloadingPng] = useState(false);

  const siteDisplay = useMemo(() => websiteHostname(), []);

  useEffect(() => {
    if (!registrationId || !token) {
      setError("Lien de billet incomplet (registrationId ou token manquant).");
      setLoading(false);
      return;
    }

    const apiUrl = `/api/events/ycs-sahel3/billet-data?registrationId=${encodeURIComponent(registrationId)}&token=${encodeURIComponent(token)}`;

    let cancelled = false;

    async function load() {
      try {
        const [apiRes, tplRes] = await Promise.all([
          fetch(apiUrl),
          fetch(TICKET_TEMPLATE_URL),
        ]);

        if (cancelled) return;

        if (!tplRes.ok) {
          throw new Error("Template billet introuvable.");
        }

        const html = await tplRes.text();

        if (!apiRes.ok) {
          const json = await apiRes.json().catch(() => ({}));
          setError(
            typeof json.error === "string" ? json.error : "Billet introuvable."
          );
          setLoading(false);
          return;
        }

        const payload = (await apiRes.json()) as BilletPayload;
        const doc = buildTicketSrcDoc(html, payload, siteDisplay);

        if (!cancelled) {
          setData(payload);
          setSrcDoc(doc);
        }
      } catch {
        if (!cancelled) {
          setError("Impossible de charger le billet.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [registrationId, token, siteDisplay]);

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.focus();
    iframeRef.current?.contentWindow?.print();
  };

  const handleDownloadPng = async () => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc || !data) {
      toast.error("Billet non disponible.");
      return;
    }
    const el = doc.querySelector(".ticket-shell");
    /* Ne pas utiliser node instanceof HTMLElement (fenêtre parent) : faux pour l’iframe */
    if (!el || el.nodeType !== Node.ELEMENT_NODE) {
      toast.error("Impossible de préparer l’image.");
      return;
    }
    const node = el as HTMLElement;
    setDownloadingPng(true);
    try {
      await doc.fonts.ready;
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const ref = formatYcsSahel3TicketRef(data.registrationId);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `billet-${ref}.png`;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image PNG enregistrée.");
    } catch (err) {
      console.error(err);
      toast.error(
        "Export PNG impossible. Réessayez ou utilisez Imprimer / PDF."
      );
    } finally {
      setDownloadingPng(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        Chargement du billet…
      </div>
    );
  }

  if (error || !data || !srcDoc) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Billet indisponible</CardTitle>
          <CardDescription>
            {error ?? "Impossible d'afficher ce billet."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/events/ycs-sahel3/inscription">
              Retour à l&apos;inscription
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const registered = new Date(data.registeredAt).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-muted-foreground">
        {data.eventTitle} — présentez ce billet à l&apos;entrée.
      </p>

      <div className="mx-auto w-full min-w-0 max-w-[820px] overflow-x-hidden">
        <iframe
          ref={iframeRef}
          title="Billet YouthConnekt Sahel — 3e édition"
          srcDoc={srcDoc}
          width="100%"
          className="mx-auto block aspect-[100/42] h-auto w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-transparent print:border-0"
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Inscription enregistrée le {registered}
        {data.email ? ` · ${data.email}` : null}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button
          type="button"
          onClick={handlePrint}
          style={{ backgroundColor: appConfig.primaryColor }}
        >
          Imprimer / PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={downloadingPng}
          onClick={() => void handleDownloadPng()}
        >
          {downloadingPng ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Préparation…
            </>
          ) : (
            <>
              <ImageDown className="mr-2 h-4 w-4" />
              Télécharger en PNG
            </>
          )}
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Accueil</Link>
        </Button>
      </div>
    </div>
  );
}
