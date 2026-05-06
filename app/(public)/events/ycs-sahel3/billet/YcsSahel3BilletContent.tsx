"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageDown, Loader2, Printer, Home, CheckCircle2,
  CalendarDays, MapPin, User, Hash, Clock, Mail,
  Share2, AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatYcsSahel3TicketRef } from "@/lib/ycsSahel3TicketRef";
import appConfig from "@/settings";
import { toast } from "sonner";

const TICKET_TEMPLATE_URL = "/events/ycs-sahel3/youthconnekt_sahel3_ticket.html";

/** Métadonnées événement (cohérentes avec la page inscription) */
const TICKET_EVENT_META = {
  headLine:  "YouthConnekt Sahel",
  metaDate:  "Sept. 2026",
  metaTime:  "09:00",
  metaDay:   "15",
  metaClass: "PARTICIPANT",
  stubMeta:  "15 sept. · Niamey",
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

function buildTicketSrcDoc(html: string, payload: BilletPayload, siteDisplay: string): string {
  const fullName = `${payload.firstName} ${payload.lastName}`.trim() || "Participant";
  const ref = formatYcsSahel3TicketRef(payload.registrationId);

  const theme = `:root{--primary:${appConfig.primaryColor};--secondary:${appConfig.secondaryColor};--primary-light:${appConfig.primaryLightColor}}`;

  let doc = html.replace(
    "</head>",
    `<style id="ycs-ticket-theme">${theme}</style><style id="ycs-ticket-live">html,body{max-width:100%;overflow-x:hidden}.demo-title{display:none!important}</style></head>`
  );

  const map: Record<string, string> = {
    __YCS_HEAD__:      escapeHtml(TICKET_EVENT_META.headLine),
    __YCS_EVENT__:     escapeHtml(payload.eventTitle),
    __YCS_NAME__:      escapeHtml(fullName),
    __YCS_REF__:       escapeHtml(ref),
    __YCS_META_DATE__: escapeHtml(TICKET_EVENT_META.metaDate),
    __YCS_META_TIME__: escapeHtml(TICKET_EVENT_META.metaTime),
    __YCS_META_DAY__:  escapeHtml(TICKET_EVENT_META.metaDay),
    __YCS_META_CLASS__:escapeHtml(TICKET_EVENT_META.metaClass),
    __YCS_STUB_META__: escapeHtml(`${TICKET_EVENT_META.stubMeta} · ${siteDisplay}`),
  };

  for (const [token, value] of Object.entries(map)) {
    doc = doc.split(token).join(value);
  }
  return doc;
}

function websiteHostname(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL;
  if (!raw) return "youthconnektniger.ne";
  try { return new URL(raw).hostname; }
  catch { return raw.replace(/^https?:\/\//i, "").split("/")[0] ?? raw; }
}

/* ─── Initials avatar ─── */
function Avatar({ name, className }: { name: string; className?: string }) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#046a50] font-black text-white shadow-md ${className ?? ""}`}>
      {initials}
    </div>
  );
}

/* ─── Next steps ─── */
const NEXT_STEPS = [
  { icon: ImageDown,    label: "Téléchargez votre billet", desc: "PNG ou imprimez en PDF" },
  { icon: CheckCircle2, label: "Présentez-le à l'entrée",  desc: "Le 15 septembre 2026" },
  { icon: Clock,        label: "Soyez là à 09h00",          desc: "Niamey, Niger" },
];

/* ─── Main component ─── */
export function YcsSahel3BilletContent() {
  const searchParams   = useSearchParams();
  const registrationId = searchParams.get("registrationId");
  const token          = searchParams.get("token");

  const iframeRef         = useRef<HTMLIFrameElement>(null);
  const [data, setData]   = useState<BilletPayload | null>(null);
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading]           = useState(true);
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
        const [apiRes, tplRes] = await Promise.all([fetch(apiUrl), fetch(TICKET_TEMPLATE_URL)]);
        if (cancelled) return;
        if (!tplRes.ok) throw new Error("Template billet introuvable.");
        const html = await tplRes.text();
        if (!apiRes.ok) {
          const json = await apiRes.json().catch(() => ({}));
          setError(typeof json.error === "string" ? json.error : "Billet introuvable.");
          setLoading(false);
          return;
        }
        const payload = (await apiRes.json()) as BilletPayload;
        const doc = buildTicketSrcDoc(html, payload, siteDisplay);
        if (!cancelled) { setData(payload); setSrcDoc(doc); }
      } catch {
        if (!cancelled) setError("Impossible de charger le billet.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [registrationId, token, siteDisplay]);

  const handlePrint = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.focus();
    // Small delay to let the browser finish any pending paint before opening the dialog
    setTimeout(() => win.print(), 80);
  };

  const handleDownloadPng = async () => {
    const iframe = iframeRef.current;
    const doc    = iframe?.contentDocument;
    if (!doc || !data) { toast.error("Billet non disponible."); return; }
    const el = doc.querySelector(".ticket-wrap") ?? doc.querySelector(".ticket-shell");
    if (!el || el.nodeType !== Node.ELEMENT_NODE) { toast.error("Impossible de préparer l'image."); return; }
    setDownloadingPng(true);
    try {
      await doc.fonts.ready;
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(el as HTMLElement, { pixelRatio: 2, cacheBust: true });
      const ref = formatYcsSahel3TicketRef(data.registrationId);
      const link = document.createElement("a");
      link.href = dataUrl; link.download = `billet-${ref}.png`; link.rel = "noopener";
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      toast.success("Image PNG enregistrée ✓");
    } catch (err) {
      console.error(err);
      toast.error("Export PNG impossible. Utilisez Imprimer / PDF.");
    } finally {
      setDownloadingPng(false);
    }
  };

  const handleShare = () => {
    if (!data) return;
    const ref  = formatYcsSahel3TicketRef(data.registrationId);
    const name = `${data.firstName} ${data.lastName}`.trim();
    const text = `🎉 Je suis inscrit(e) à YouthConnekt Sahel 3 ! Référence : ${ref} · ${name}\n👉 youthconnektniger.ne`;
    if (navigator.share) {
      void navigator.share({ text });
    } else {
      void navigator.clipboard.writeText(text);
      toast.success("Lien copié dans le presse-papiers !");
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Chargement de votre billet…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !data || !srcDoc) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-lg font-bold text-destructive">Billet indisponible</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error ?? "Impossible d'afficher ce billet."}</p>
          <Button asChild variant="outline" className="mt-6 rounded-xl">
            <Link href="/events/ycs-sahel3/inscription">Retour à l&apos;inscription</Link>
          </Button>
        </div>
      </div>
    );
  }

  const fullName   = `${data.firstName} ${data.lastName}`.trim();
  const ref        = formatYcsSahel3TicketRef(data.registrationId);
  const registered = new Date(data.registeredAt).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* ── Confirmation banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#012e22] via-[#035740] to-[#046a50] p-8 text-white shadow-xl">
          {/* Dot pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          />
          <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {/* Success icon */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-2 ring-white/25">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>

            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                Inscription confirmée
              </p>
              <h1 className="mt-1 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                Bienvenue, {data.firstName}&nbsp;! 🎉
              </h1>
              <p className="mt-1.5 text-sm text-white/75">
                {data.email
                  ? `Un e-mail de confirmation a été envoyé à ${data.email}.`
                  : "Votre inscription a bien été enregistrée."}
              </p>
            </div>

            {/* Ref badge */}
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-center backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Référence</p>
              <p className="mt-0.5 font-mono text-lg font-black tracking-widest text-secondary">{ref}</p>
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid gap-6 lg:grid-cols-5 lg:items-start">

          {/* LEFT: participant card + actions */}
          <div className="space-y-4 lg:col-span-2">

            {/* Participant card */}
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
              <div className="border-b border-border/50 bg-primary/5 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Votre fiche</p>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                  <Avatar name={fullName} className="h-12 w-12 text-sm" />
                  <div>
                    <p className="font-bold text-foreground">{fullName}</p>
                    {data.organisationEntreprise && (
                      <p className="text-xs text-muted-foreground">{data.organisationEntreprise}</p>
                    )}
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    { icon: Hash,         label: "Référence",  value: ref },
                    { icon: User,         label: "Statut",     value: "PARTICIPANT" },
                    ...(data.email ? [{ icon: Mail, label: "Email", value: data.email }] : []),
                    ...(data.city || data.countryOfResidence ? [{ icon: MapPin, label: "Lieu", value: [data.city, data.countryOfResidence].filter(Boolean).join(", ") }] : []),
                    { icon: CalendarDays, label: "Inscrit le", value: registered },
                  ].map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                        <p className="text-xs font-medium text-foreground break-all">{value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
              <div className="border-b border-border/50 bg-secondary/5 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Actions</p>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <Button
                  onClick={handlePrint}
                  className="w-full justify-start gap-2.5 rounded-xl bg-primary font-semibold text-white shadow-sm hover:bg-primary/90"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer / Enregistrer en PDF
                </Button>
                <Button
                  variant="outline"
                  disabled={downloadingPng}
                  onClick={() => void handleDownloadPng()}
                  className="w-full justify-start gap-2.5 rounded-xl border-border/70 font-semibold"
                >
                  {downloadingPng ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Préparation de l&apos;image…</>
                  ) : (
                    <><ImageDown className="h-4 w-4" />Télécharger en PNG</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full justify-start gap-2.5 rounded-xl border-border/70 font-semibold"
                >
                  <Share2 className="h-4 w-4" />
                  Partager mon inscription
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2.5 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <Link href="/"><Home className="h-4 w-4" />Retour à l&apos;accueil</Link>
                </Button>
              </div>
            </div>

          </div>

          {/* RIGHT: ticket preview */}
          <div className="space-y-3 lg:col-span-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Votre billet</p>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                À présenter à l&apos;entrée
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/30 p-3 shadow-sm sm:p-4">
              <iframe
                ref={iframeRef}
                title="Billet YouthConnekt Sahel 3"
                srcDoc={srcDoc}
                width="100%"
                className="mx-auto block aspect-[680/410] h-auto w-full min-w-0 max-w-full overflow-hidden rounded-xl"
              />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Inscription enregistrée le {registered}
              {data.email ? <> · <span className="font-medium">{data.email}</span></> : null}
            </p>
          </div>

        </div>

        {/* ── Next steps ── */}
        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <p className="mb-5 text-sm font-bold text-foreground">Prochaines étapes</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {NEXT_STEPS.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary">
                    Étape {i + 1}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
