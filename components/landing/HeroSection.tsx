"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/95 text-primary-foreground">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
      <div className="container relative mx-auto px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ y: 24, opacity: 0.85, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur"
          >
            <Sparkles className="h-4 w-4" />
            <span>Autonomiser la jeunesse nigérienne</span>
          </motion.div>
          <motion.h1
            initial={{ y: 28, opacity: 0.85 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.08 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Connecter la Jeunesse au{" "}
            <span className="text-secondary">Futur</span>
          </motion.h1>
          <motion.p
            initial={{ y: 24, opacity: 0.85 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.16 }}
            className="mx-auto mt-6 max-w-2xl text-lg opacity-95 sm:text-xl"
          >
            Emploi, entrepreneuriat, citoyenneté et éducation : Youth Connekt
            Niger accompagne les jeunes à saisir les opportunités et à bâtir
            l&apos;avenir du pays.
          </motion.p>
          <motion.div
            initial={{ y: 24, opacity: 0.85 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.24 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              asChild
            >
              <Link href="/auth/signup" className="inline-flex items-center gap-2">
                Rejoindre le programme
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/about">Découvrir nos actions</Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ y: 24, opacity: 0.85, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.35 }}
          className="mt-16 flex justify-center"
        >
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur md:p-12">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-3">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-2xl font-bold">+10 000</p>
                  <p className="text-sm opacity-90">Jeunes connectés</p>
                </div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-3">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm opacity-90">Régions couvertes</p>
                </div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-3">
                  <ArrowRight className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-2xl font-bold">+500</p>
                  <p className="text-sm opacity-90">Startups accompagnées</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
