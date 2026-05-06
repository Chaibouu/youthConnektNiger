"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Rocket, Vote, GraduationCap, ArrowRight } from "lucide-react";

const piliers = [
  {
    num: "01",
    title: "Emploi",
    description:
      "Formation professionnelle, stages et mise en relation avec les employeurs pour faciliter l'insertion des jeunes sur le marché du travail.",
    icon: Briefcase,
    href: "/events/projets",
    // Carte foncée (primary)
    style: "dark-primary" as const,
  },
  {
    num: "02",
    title: "Entrepreneuriat",
    description:
      "Accompagnement des porteurs de projets et startups : incubation, financement et mentorat pour transformer les idées en entreprises viables.",
    icon: Rocket,
    href: "/events/projets",
    // Carte claire (secondary)
    style: "light-secondary" as const,
  },
  {
    num: "03",
    title: "Citoyenneté",
    description:
      "Engagement civique, volontariat et leadership pour que les jeunes participent activement à la vie publique et au développement communautaire.",
    icon: Vote,
    href: "/about",
    // Carte claire (primary)
    style: "light-primary" as const,
  },
  {
    num: "04",
    title: "Éducation",
    description:
      "Accès à des formations qualifiantes, au numérique et aux compétences du 21e siècle pour une jeunesse mieux armée face aux défis actuels.",
    icon: GraduationCap,
    href: "/about",
    // Carte foncée (secondary)
    style: "dark-secondary" as const,
  },
];

const styleMap = {
  "dark-primary": {
    wrapper: "bg-gradient-to-br from-[#024a36] via-[#035740] to-[#046a50]",
    num: "text-white/10",
    iconBg: "bg-white/15 text-white",
    title: "text-white",
    desc: "text-white/65",
    cta: "text-white/80 hover:text-white",
    ctaBorder: "border-white/20",
    glow: "bg-secondary/20",
  },
  "light-secondary": {
    wrapper: "bg-white border border-border",
    num: "text-secondary/10",
    iconBg: "bg-secondary/10 text-secondary",
    title: "text-secondary",
    desc: "text-muted-foreground",
    cta: "text-secondary hover:text-secondary/80",
    ctaBorder: "border-secondary/20",
    glow: "bg-secondary/5",
  },
  "light-primary": {
    wrapper: "bg-white border border-border",
    num: "text-primary/10",
    iconBg: "bg-primary/10 text-primary",
    title: "text-primary",
    desc: "text-muted-foreground",
    cta: "text-primary hover:text-primary/80",
    ctaBorder: "border-primary/20",
    glow: "bg-primary/5",
  },
  "dark-secondary": {
    wrapper: "bg-gradient-to-br from-secondary via-secondary/90 to-[#c45e0a]",
    num: "text-white/10",
    iconBg: "bg-white/15 text-white",
    title: "text-white",
    desc: "text-white/65",
    cta: "text-white/80 hover:text-white",
    ctaBorder: "border-white/20",
    glow: "bg-white/10",
  },
};

export function ProgrammesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">

        {/* ── En-tête ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Nos piliers
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            Programmes & Initiatives
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Quatre piliers pour accompagner la jeunesse nigérienne vers
            l&apos;autonomie et la réussite.
          </p>
        </motion.div>

        {/* ── Grille des cartes ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {piliers.map((pilier, i) => {
            const s = styleMap[pilier.style];
            return (
              <motion.div
                key={pilier.title}
                initial={{ y: 28, opacity: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
                className="h-full"
              >
                <div
                  className={`group relative h-full overflow-hidden rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col ${s.wrapper}`}
                >
                  {/* Orbe de fond */}
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full ${s.glow} blur-3xl opacity-70`}
                  />

                  {/* Numéro décoratif */}
                  <span
                    className={`absolute right-4 top-3 select-none text-7xl font-black leading-none pointer-events-none ${s.num}`}
                  >
                    {pilier.num}
                  </span>

                  {/* Icône */}
                  <div
                    className={`relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${s.iconBg}`}
                  >
                    <pilier.icon className="h-7 w-7" />
                  </div>

                  {/* Titre */}
                  <h3 className={`relative text-xl font-bold mb-3 ${s.title}`}>
                    {pilier.title}
                  </h3>

                  {/* Description */}
                  <p className={`relative text-sm leading-relaxed flex-1 ${s.desc}`}>
                    {pilier.description}
                  </p>

                  {/* CTA */}
                  <div className={`relative mt-6 pt-5 border-t ${s.ctaBorder}`}>
                    <Link
                      href={pilier.href}
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-all duration-200 group-hover:gap-2.5 ${s.cta}`}
                    >
                      En savoir plus
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
