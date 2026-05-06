"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Users2, CalendarDays } from "lucide-react";

const highlights = [
  {
    title: "Développez vos compétences",
    description:
      "Formations certifiantes, mentorat et bootcamps pour renforcer votre employabilité et booster votre carrière au Niger et en Afrique.",
    icon: Lightbulb,
    href: "#programmes",
    gradient: "from-secondary via-secondary/90 to-[#c45e0a]",
    glow: "bg-secondary/30",
    badge: "Formation",
  },
  {
    title: "Rejoignez la communauté",
    description:
      "Intégrez un réseau dynamique de jeunes leaders, entrepreneurs et innovateurs qui construisent l'avenir du Niger ensemble.",
    icon: Users2,
    href: "/auth/signup",
    gradient: "from-[#024a36] via-[#035740] to-[#046a50]",
    glow: "bg-primary/30",
    badge: "Communauté",
  },
  {
    title: "Événements & opportunités",
    description:
      "Conventions nationales, projets et programmes en cours : restez informés et saisissez toutes les opportunités disponibles.",
    icon: CalendarDays,
    href: "/events",
    gradient: "from-[#035740] via-[#024a36] to-secondary/80",
    glow: "bg-primary/20",
    badge: "Événements",
  },
];

export function HighlightsSection() {
  return (
    <section className="relative z-10 -mt-12 pb-4 lg:-mt-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ y: 28, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            >
              <Link href={h.href} className="group block h-full cursor-pointer">
                <div
                  className={`relative h-full overflow-hidden rounded-2xl bg-gradient-to-br ${h.gradient} p-6 shadow-xl shadow-black/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-black/20`}
                >
                  {/* Orbe lumineux en arrière-plan */}
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full ${h.glow} blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-90`}
                  />

                  {/* Motif pointillés */}
                  <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #fff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Contenu */}
                  <div className="relative flex flex-col h-full gap-4">
                    {/* Badge + Icône */}
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                        {h.badge}
                      </span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <h.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Texte */}
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white leading-snug lg:text-lg">
                        {h.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/70 leading-relaxed line-clamp-3">
                        {h.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-white/90 transition-all duration-200 group-hover:gap-2.5 group-hover:text-white">
                      En savoir plus
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
