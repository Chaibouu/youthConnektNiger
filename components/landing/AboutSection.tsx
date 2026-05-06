"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Users,
  Globe,
  Rocket,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import appConfig from "@/settings";

const features = [
  "Initiative nationale du programme panafricain Youth Connekt Africa",
  "Portée par le PNUD et ses partenaires institutionnels",
  "Présence dans les 8 régions du Niger",
  "Accompagnement personnalisé des jeunes porteurs de projets",
];

const impactCards = [
  { icon: Users,  value: "10 000+", label: "Jeunes", color: "bg-secondary text-white" },
  { icon: Globe,  value: "8",       label: "Régions", color: "bg-white text-primary"  },
  { icon: Rocket, value: "500+",    label: "Startups", color: "bg-white text-primary" },
  { icon: Award,  value: "50+",     label: "Partenaires", color: "bg-secondary/90 text-white" },
];

export function AboutSection() {
  return (
    <section className="py-16 lg:py-28 overflow-hidden" id="a-propos">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">

          {/* ──────────────────────────────
              Colonne gauche : panneau visuel
          ────────────────────────────────── */}
          <motion.div
            initial={{ x: -28, opacity: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative"
          >
            {/* Cercles décoratifs derrière */}
            <div className="absolute -top-8 -left-8 h-36 w-36 rounded-full border-[6px] border-primary/10 -z-10" />
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full border-[6px] border-secondary/15 -z-10" />
            <div className="absolute top-1/2 -right-4 h-12 w-12 rounded-full bg-secondary/10 -z-10" />

            {/* Panneau principal — fond vert + logo centré */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-[#024a36] via-[#035740] to-[#046a50] shadow-2xl shadow-primary/20">

              {/* Motif de fond */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              {/* Logo centré */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-36 w-36 overflow-hidden rounded-full ring-4 ring-white/30 shadow-xl">
                  <Image
                    src={appConfig.logoUrl}
                    alt="Youth Connekt Niger"
                    fill
                    className="object-cover"
                    sizes="144px"
                    priority
                  />
                </div>
              </div>

              {/* Dégradé en bas */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#012e22]/80 to-transparent" />

              {/* Texte en bas du panneau */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">
                  Depuis 2019
                </p>
                <p className="text-lg font-bold text-white leading-tight">
                  Youth Connekt Niger
                </p>
                <p className="text-sm text-white/70 mt-0.5">
                  Programme panafricain · Niamey, Niger
                </p>
              </div>

              {/* Orbe lumineux */}
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />
            </div>

            {/* ── Grille de 4 mini-cards flottantes ── */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="absolute -bottom-8 left-4 right-4 grid grid-cols-4 gap-2"
            >
              {impactCards.map((card) => (
                <div
                  key={card.label}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 shadow-lg text-center ${card.color}`}
                >
                  <card.icon className="h-4 w-4 opacity-80" />
                  <p className="text-base font-extrabold leading-none">{card.value}</p>
                  <p className="text-[10px] font-medium opacity-75 leading-none">{card.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ──────────────────────────────
              Colonne droite : texte
          ────────────────────────────────── */}
          <div className="mt-8 lg:mt-0">
            {/* Badge section */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                À propos
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl xl:text-[2.6rem] leading-[1.15]">
                Autonomiser la jeunesse{" "}
                <span className="relative inline-block">
                  nigérienne
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary/50 rounded-full" />
                </span>
              </h2>
            </motion.div>

            {/* Texte */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="mt-5 space-y-4"
            >
              <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                Youth Connekt Niger est l&apos;initiative nationale du programme
                panafricain{" "}
                <span className="font-semibold text-foreground">
                  Youth Connekt Africa
                </span>
                , portée par le PNUD et ses partenaires. Elle connecte les
                jeunes aux opportunités d&apos;emploi, d&apos;entrepreneuriat,
                d&apos;éducation et d&apos;engagement citoyen.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                À travers des programmes structurés et des partenariats solides,
                nous accompagnons les jeunes dans les huit régions du Niger pour
                qu&apos;ils deviennent des acteurs clés du développement
                économique et social du pays.
              </p>
            </motion.div>

            {/* Features */}
            <motion.ul
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
              className="mt-7 space-y-3"
            >
              {features.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ x: -8, opacity: 0 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.22 + i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </span>
                  <span className="text-sm text-foreground leading-snug">{f}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.32 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Button
                asChild
                className="rounded-full px-7 bg-primary hover:bg-primary/90 cursor-pointer shadow-md shadow-primary/20 transition-all duration-200"
              >
                <Link href="/about" className="inline-flex items-center gap-2">
                  En savoir plus
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline underline-offset-4 cursor-pointer transition-colors"
              >
                Rejoindre le programme
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
