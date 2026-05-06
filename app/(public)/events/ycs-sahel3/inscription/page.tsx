import type { Metadata } from "next";
import { CalendarDays, MapPin, Users, CheckCircle2, Mail, Clock } from "lucide-react";
import { YcsSahel3RegistrationForm } from "@/components/events/YcsSahel3RegistrationForm";

export const metadata: Metadata = {
  title: "Inscription | YouthConnekt Sahel 3 — 2026",
  description:
    "Inscrivez-vous gratuitement à la 3e édition de YouthConnekt Sahel — Forum international panafricain de la jeunesse, Niamey, 15 septembre 2026.",
};

const PERKS = [
  "Billet numérique envoyé par e-mail",
  "Accès à tous les ateliers & conférences",
  "Mise en réseau avec 500+ jeunes leaders",
  "Certificat de participation officiel",
  "Repas et rafraîchissements inclus",
];

export default function InscriptionYcsSahel3Page() {
  return (
    <div className="min-h-screen bg-muted/30">

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#012e22] via-[#035740] to-[#046a50] text-white">
        {/* Dot pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Orbs */}
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:py-16">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest ring-1 ring-inset ring-secondary/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
            Forum panafricain · Édition 2026
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Youth Connekt{" "}
            <span className="text-secondary">Sahel 3</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/75 sm:text-lg">
            Rejoignez les jeunes leaders du Sahel. Inscription gratuite — votre
            billet numérique vous sera envoyé par e-mail.
          </p>

          {/* Event meta badges */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <CalendarDays className="h-4 w-4 text-secondary" />
              15 septembre 2026
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-secondary" />
              Niamey, Niger
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-secondary/30 px-4 py-2 text-sm font-bold ring-1 ring-secondary/50">
              <Users className="h-4 w-4" />
              Inscription gratuite
            </span>
          </div>

          {/* Progress bar hint at the bottom */}
          <div className="mt-10 flex items-center gap-3">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-1/3 rounded-full bg-secondary" />
            </div>
            <p className="text-xs text-white/50">3 étapes · moins de 5 minutes</p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-5 lg:items-start">

          {/* Form — 3/5 */}
          <div className="lg:col-span-3">
            <YcsSahel3RegistrationForm />
          </div>

          {/* Sidebar — 2/5 (sticky on desktop) */}
          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-24 space-y-4">

              {/* What you get */}
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
                <div className="border-b border-border/60 bg-primary/5 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Ce que vous obtenez
                  </p>
                </div>
                <ul className="divide-y divide-border/40">
                  {PERKS.map((perk) => (
                    <li key={perk} className="flex items-start gap-3 px-5 py-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Event details card */}
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
                <div className="border-b border-border/60 bg-secondary/5 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                    Infos pratiques
                  </p>
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <CalendarDays className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">15 septembre 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Lieu</p>
                      <p className="text-sm font-medium">Niamey, Niger</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Heure d&apos;ouverture</p>
                      <p className="text-sm font-medium">09h00 (heure locale)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Des questions ?
                </p>
                <a
                  href="mailto:contact@youthconnektniger.org"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  contact@youthconnektniger.org
                </a>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
