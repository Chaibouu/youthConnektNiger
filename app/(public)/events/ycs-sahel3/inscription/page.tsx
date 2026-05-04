import type { Metadata } from "next";
import { YcsSahel3RegistrationForm } from "@/components/events/YcsSahel3RegistrationForm";

export const metadata: Metadata = {
  title: "Inscription | YouthConnekt Sahel — 3e édition",
  description:
    "Inscription à la troisième édition de YouthConnekt Sahel — Youth Connekt Niger.",
};

export default function InscriptionYcsSahel3Page() {
  return (
    <div className="bg-muted/30">
      {/* En-tête — fond couleur principale */}
      <div className="relative overflow-hidden bg-primary text-primary-foreground">
        {/* Halos discrets pour donner un peu de profondeur */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/5 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-secondary/40">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Événement · YouthConnekt Sahel
          </p>
          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
            Inscription à la 3<sup>e</sup> édition de YouthConnekt Sahel
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
            Quelques minutes pour confirmer votre participation. Vous recevrez
            ensuite votre billet à présenter à l&apos;entrée.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <YcsSahel3RegistrationForm />
      </div>
    </div>
  );
}
