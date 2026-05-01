"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import appConfig from "@/settings";

export function AboutSection() {
  return (
    <section className="py-16 lg:py-24" id="a-propos">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ x: -24, opacity: 1 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
          >
            <Image
              src={appConfig.logoUrl}
              alt="Youth Connekt Niger - Jeunesse nigérienne"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
          <div>
            <motion.h2
              initial={{ y: 16, opacity: 1 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-primary lg:text-4xl"
            >
              À propos de Youth Connekt Niger
            </motion.h2>
            <motion.div
              initial={{ y: 16, opacity: 1 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 space-y-4 text-muted-foreground"
            >
              <p className="text-lg leading-relaxed">
                Youth Connekt Niger est l&apos;initiative nationale du programme
                panafricain Youth Connekt Africa, portée par le PNUD et ses
                partenaires. Elle vise à autonomiser la jeunesse nigérienne en
                connectant les jeunes aux opportunités d&apos;emploi,
                d&apos;entrepreneuriat, d&apos;éducation et d&apos;engagement
                citoyen.
              </p>
              <p className="leading-relaxed">
                À travers des programmes structurés et des partenariats solides,
                nous accompagnons les jeunes dans les huit régions du Niger pour
                qu&apos;ils deviennent des acteurs clés du développement
                économique et social du pays.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
