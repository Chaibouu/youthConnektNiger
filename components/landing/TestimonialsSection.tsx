"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const temoignages = [
  {
    quote:
      "Youth Connekt Niger m'a permis de suivre une formation en entrepreneuriat et d'obtenir un premier financement. Aujourd'hui mon entreprise emploie 5 personnes.",
    author: "Amina M.",
    role: "Entrepreneure",
    location: "Niamey",
    initials: "AM",
    rating: 5,
    program: "Entrepreneuriat",
    avatarGrad: "from-primary to-[#046a50]",
    programColor: "bg-primary/10 text-primary",
  },
  {
    quote:
      "Grâce au programme d'emploi, j'ai trouvé un stage puis un CDI dans le secteur du numérique. Une vraie opportunité pour ma carrière.",
    author: "Ibrahim S.",
    role: "Développeur",
    location: "Zinder",
    initials: "IS",
    rating: 5,
    program: "Emploi",
    avatarGrad: "from-secondary to-[#c45e0a]",
    programColor: "bg-secondary/10 text-secondary",
  },
  {
    quote:
      "L'accompagnement en citoyenneté m'a donné les outils pour monter des actions dans ma commune. Je suis fier de contribuer au développement de ma région.",
    author: "Fatouma H.",
    role: "Volontaire",
    location: "Maradi",
    initials: "FH",
    rating: 5,
    program: "Citoyenneté",
    avatarGrad: "from-primary to-[#046a50]",
    programColor: "bg-primary/10 text-primary",
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "fill-secondary text-secondary" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Fond vert dégradé subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#024a36]/5 via-transparent to-secondary/5" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">

        {/* ── En-tête ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Témoignages
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            Ce que disent nos jeunes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Des centaines de jeunes nigériens ont déjà transformé leur vie grâce
            à Youth Connekt Niger.
          </p>

          {/* Note globale */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-secondary/20 bg-white px-5 py-3 shadow-sm">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
              ))}
            </div>
            <div className="h-5 w-px bg-border" />
            <p className="text-sm font-bold text-foreground">
              4,9{" "}
              <span className="font-normal text-muted-foreground">
                · +500 bénéficiaires
              </span>
            </p>
          </div>
        </motion.div>

        {/* ── Grille de témoignages ── */}
        <div className="grid gap-6 md:grid-cols-3">
          {temoignages.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ y: 28, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col">

                {/* Guillemet décoratif géant */}
                <span className="pointer-events-none absolute right-4 top-2 select-none text-8xl font-black leading-none text-primary/5">
                  &ldquo;
                </span>

                {/* Étoiles + badge programme */}
                <div className="flex items-center justify-between mb-5">
                  <StarRow count={t.rating} />
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${t.programColor}`}>
                    {t.program}
                  </span>
                </div>

                {/* Citation */}
                <p className="relative flex-1 text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Auteur */}
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.avatarGrad} text-sm font-bold text-white ring-2 ring-white shadow-md`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.role} · {t.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
