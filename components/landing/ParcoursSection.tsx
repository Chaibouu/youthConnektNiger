"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ClipboardList,
  GraduationCap,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Je m'informe",
    description:
      "Découvrez les programmes, événements et opportunités adaptés à votre profil.",
    icon: GraduationCap,
    cta: { label: "Voir les programmes", href: "#programmes" },
  },
  {
    step: "02",
    title: "Je candidate",
    description:
      "Créez votre compte et postulez en ligne en quelques minutes.",
    icon: ClipboardList,
    cta: { label: "Créer un compte", href: "/auth/signup" },
  },
  {
    step: "03",
    title: "Je suis accompagné",
    description:
      "Formation, mentorat et mise en réseau pour concrétiser votre projet.",
    icon: Handshake,
    cta: { label: "Nous contacter", href: "#contact" },
  },
];

export function ParcoursSection() {
  return (
    <section className="py-16 lg:py-24" id="parcours">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Votre parcours
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            Comment ça marche ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Trois étapes pour rejoindre le mouvement Youth Connekt Niger.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="absolute left-7 top-7 hidden h-0.5 w-[calc(100%-3.5rem)] bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 md:block"
            style={{ left: "calc(16.66% + 1rem)", width: "66.66%" }}
          />

          <div className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center md:items-start md:text-left"
              >
                {/* Step badge */}
                <div className="relative mb-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md ring-4 ring-primary/15">
                    {s.step}
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md">
                    <s.icon className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-primary">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <Button
                  variant="link"
                  className="mt-4 h-auto p-0 font-semibold text-secondary"
                  asChild
                >
                  <Link
                    href={s.cta.href}
                    className="inline-flex items-center gap-1"
                  >
                    {s.cta.label}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
