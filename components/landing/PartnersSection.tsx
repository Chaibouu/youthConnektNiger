"use client";

import { motion } from "framer-motion";
import Image from "next/image";


export function PartnersSection() {

  const PARTNERS = [
  { name: "Ministère Jeunesse", logo: "/partners/jeunesse.png", url: "https://www.facebook.com/profile.php?id=100076320551116" },
  { name: "ANSI", logo: "/partners/ansii.png", url: "https://ansi.ne" },
  { name: "PNUD", logo: "/partners/undp.png", url: "https://www.undp.org/fr/niger" },
]

  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-muted/30 py-14 lg:py-20">
      {/* Soft glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Partenaires
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            Ils nous font confiance
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Youth Connekt Niger est soutenu par des acteurs nationaux et
            internationaux engagés pour la jeunesse.
          </p>
        </motion.div>
      </div>
              {/* Partenaires */}
        <section className="">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
        <div className="w-full ">
          <div className="relative overflow-hidden">
            <div className="logo-slider">
              <div className="logo-slide-track">
                {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                  <a
                    key={i}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="logo-slide flex-shrink-0 w-36 h-24 flex flex-col items-center justify-center gap-2 px-4 transition-all duration-300 group"
                  >
                    <Image src={partner.logo} alt={partner.name} width={160} height={100} className="object-contain h-28 w-auto" />
                    <span className="text-xs text-gray-400 group-hover:text-gray-700 font-medium transition-colors">{partner.name}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-muted to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-muted to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>
    </section>
  );
}
