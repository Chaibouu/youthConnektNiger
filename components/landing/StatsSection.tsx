"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, MapPin, Rocket, Handshake } from "lucide-react";

const stats = [
  {
    value: 10000,
    suffix: "+",
    label: "Jeunes Connectés",
    icon: Users,
    accent: "secondary" as const,
  },
  {
    value: 8,
    suffix: "",
    label: "Régions couvertes",
    icon: MapPin,
    accent: "white" as const,
  },
  {
    value: 500,
    suffix: "+",
    label: "Startups accompagnées",
    icon: Rocket,
    accent: "white" as const,
  },
  {
    value: 50,
    suffix: "+",
    label: "Partenaires actifs",
    icon: Handshake,
    accent: "secondary" as const,
  },
];

function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  function startCount() {
    if (started) return;
    setStarted(true);
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  return (
    <motion.span onViewportEnter={startCount}>
      {count.toLocaleString("fr-FR")}
      {suffix}
    </motion.span>
  );
}

export function StatsSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Fond vert foncé avec motif subtil */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#024a36] via-[#035740] to-[#024a36]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative mx-auto px-4 py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.09 }}
              className="flex flex-col items-center gap-4 px-6 py-2 text-center first:pl-0 last:pr-0"
            >
              {/* Icône */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  stat.accent === "secondary"
                    ? "bg-secondary/25 text-secondary"
                    : "bg-white/10 text-white/80"
                }`}
              >
                <stat.icon className="h-6 w-6" />
              </div>

              {/* Chiffre */}
              <div>
                <p
                  className={`text-4xl font-extrabold leading-none md:text-5xl ${
                    stat.accent === "secondary" ? "text-secondary" : "text-white"
                  }`}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-white/60">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Vague basse vers la section suivante */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-10"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20 Q360 0 720 18 Q1080 36 1440 10 L1440 40 L0 40 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
