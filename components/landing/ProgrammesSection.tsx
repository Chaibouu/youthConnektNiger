"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Rocket,
  Vote,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const piliers = [
  {
    title: "Emploi",
    description:
      "Formation professionnelle, stages et mise en relation avec les employeurs pour faciliter l'insertion des jeunes sur le marché du travail.",
    icon: Briefcase,
    href: "/events/projets",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Entrepreneuriat",
    description:
      "Accompagnement des porteurs de projets et startups : incubation, financement et mentorat pour transformer les idées en entreprises viables.",
    icon: Rocket,
    href: "/events/projets",
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Citoyenneté",
    description:
      "Engagement civique, volontariat et leadership pour que les jeunes participent activement à la vie publique et au développement communautaire.",
    icon: Vote,
    href: "/about",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Éducation",
    description:
      "Accès à des formations qualifiantes, au numérique et aux compétences du 21e siècle pour une jeunesse mieux armée face aux défis actuels.",
    icon: GraduationCap,
    href: "/about",
    color: "bg-secondary/10 text-secondary",
  },
];

export function ProgrammesSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ y: 24, opacity: 0.9 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            Programmes & Initiatives
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Quatre piliers pour accompagner la jeunesse nigérienne vers
            l&apos;autonomie et la réussite.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {piliers.map((pilier, i) => (
            <motion.div
              key={pilier.title}
              initial={{ y: 22, opacity: 0.9, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
            >
              <Card className="h-full transition hover:shadow-lg">
                <CardHeader>
                  <div
                    className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg ${pilier.color}`}
                  >
                    <pilier.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-primary">{pilier.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {pilier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={pilier.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    En savoir plus
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
