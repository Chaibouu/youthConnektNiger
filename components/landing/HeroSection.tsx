"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Sparkles,
  Globe,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Slides du carrousel arrière-plan
   ➜ Pour utiliser de vraies photos :
     1. Ajoute tes images dans /public/hero/
     2. Renseigne le champ `image` de chaque slide
        ex: image: "/hero/jeunes-niamey.jpg"
   ───────────────────────────────────────────────────────────── */
const slides = [
  {
    id: 1,
    image: '/connekt-amb.jpeg' as string | null,
    gradient: "from-[#012e22] via-[#024a36] to-[#035740]",
    glow1: "top-0 right-0 bg-secondary/20",
    glow2: "bottom-0 left-0 bg-white/5",
  },
  {
    id: 2,
    image: '/cta.png' as string | null,
    gradient: "from-[#035740] via-[#046a50] to-[#024a36]",
    glow1: "top-0 left-1/2 -translate-x-1/2 bg-secondary/15",
    glow2: "bottom-0 right-0 bg-primary/20",
  },
  {
    id: 3,
    image: '/campus.webp' as string | null,
    gradient: "from-[#024a36] via-[#035740] to-[#013526]",
    glow1: "top-0 left-0 bg-white/10",
    glow2: "bottom-0 right-0 bg-secondary/25",
  },
];

const INTERVAL = 5000;

const partnerLogos = ["PNUD", "UNICEF", "UE", "AFD", "BM"];

const heroStats = [
  { icon: Users,      value: "+10 000", label: "Jeunes connectés",      accent: true  },
  { icon: Globe,      value: "8",       label: "Régions couvertes",     accent: false },
  { icon: TrendingUp, value: "+500",    label: "Startups accompagnées", accent: false },
  { icon: Sparkles,   value: "+50",     label: "Partenaires actifs",    accent: true  },
];

const features = [
  "Programmes de formation certifiants",
  "Accès à des financements et ressources",
  "Réseau de 50+ mentors et partenaires",
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden min-h-[92vh] flex flex-col justify-center text-primary-foreground"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ────── Carrousel arrière-plan ────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {slide.image ? (
            /* ── Photo réelle ── */
            <>
              <Image
                src={slide.image}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Overlay sombre pour lisibilité */}
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
            </>
          ) : (
            /* ── Slide dégradé (fallback) ── */
            <>
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
              {/* Motif pointillés */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </>
          )}

          {/* Orbes lumineux spécifiques à chaque slide */}
          <div className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none ${slide.glow1}`} />
          <div className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none ${slide.glow2}`} />
        </motion.div>
      </AnimatePresence>

      {/* ────── Contenu ────── */}
      <div className="container relative mx-auto px-4 py-24 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Colonne gauche : texte ── */}
          <div>
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-secondary" />
              <span>Programme panafricain · Niger</span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.25rem] leading-[1.1]"
            >
              Connecter la Jeunesse au{" "}
              <span className="relative inline-block text-secondary">
                Futur
                <svg
                  className="absolute -bottom-1.5 left-0 w-full"
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M0 5 Q50 0 100 4 Q150 8 200 3"
                    stroke="#E26E12"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 16, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
              className="mt-6 text-lg text-white/85 leading-relaxed max-w-xl"
            >
              Emploi, entrepreneuriat, citoyenneté et éducation : Youth Connekt
              Niger accompagne les jeunes à saisir les opportunités et à bâtir
              l&apos;avenir du pays.
            </motion.p>

            <motion.ul
              initial={{ y: 16, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.28 }}
              className="mt-6 space-y-2.5"
            >
              {features.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.36 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button
                size="lg"
                className="bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/25 rounded-full px-8 h-12 font-semibold cursor-pointer transition-all duration-200"
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
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-full px-8 h-12 backdrop-blur-sm cursor-pointer transition-all duration-200"
                asChild
              >
                <Link href="/about">Découvrir nos actions</Link>
              </Button>
            </motion.div>

            {/* Partenaires */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-12 pt-8 border-t border-white/10"
            >
              <p className="text-xs font-medium tracking-widest uppercase text-white/40 mb-4">
                Partenaires officiels
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {partnerLogos.map((p) => (
                  <span
                    key={p}
                    className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70 backdrop-blur-sm"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Colonne droite : cartes stats (desktop) ── */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ y: 24, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 + i * 0.09 }}
                className={`rounded-2xl border backdrop-blur-sm p-6 flex flex-col gap-4 ${
                  stat.accent
                    ? "bg-secondary/20 border-secondary/25"
                    : "bg-white/10 border-white/15"
                }`}
              >
                <div className="rounded-xl bg-white/15 p-2.5 self-start">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/65 mt-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats mobile */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:hidden"
        >
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm p-4 text-center"
            >
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-xs text-white/65">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ────── Dots de navigation ────── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setCurrent(i); setPaused(false); }}
            aria-label={`Slide ${i + 1}`}
            className="relative h-1.5 cursor-pointer rounded-full transition-all duration-500 focus:outline-none"
            style={{ width: i === current ? "2rem" : "0.375rem" }}
          >
            {/* Track de fond */}
            <span className="absolute inset-0 rounded-full bg-white/30" />
            {/* Barre de progression animée */}
            {i === current && !paused && (
              <motion.span
                key={`prog-${s.id}`}
                className="absolute inset-0 rounded-full bg-white origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: INTERVAL / 1000, ease: "linear" }}
              />
            )}
            {/* Dot actif (en pause) */}
            {i === current && paused && (
              <span className="absolute inset-0 rounded-full bg-white" />
            )}
          </button>
        ))}
      </div>

      {/* ────── Vague de transition ────── */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg
          viewBox="0 0 1440 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-14"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 Q360 0 720 28 Q1080 56 1440 16 L1440 56 L0 56 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
