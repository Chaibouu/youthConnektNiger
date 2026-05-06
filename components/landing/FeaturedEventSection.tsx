"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Ticket, Clock, Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────
   Date cible de l'événement
   → Modifie EVENT_DATE selon la vraie date
   ───────────────────────────────────────────── */
const EVENT_DATE = new Date("2026-09-15T09:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(target: Date): TimeLeft {
  const calc = (): TimeLeft => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calc);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-primary/10 bg-primary/5 px-3 py-3.5">
      <span className="text-3xl font-extrabold tabular-nums leading-none text-primary">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function FeaturedEventSection() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);

  return (
    <section className="py-10 lg:py-16" aria-labelledby="featured-event-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl shadow-xl shadow-primary/10"
        >
          <div className="grid lg:grid-cols-2">

            {/* ── Panneau gauche : visuel de l'événement ── */}
            <div className="relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#012e22] via-[#035740] to-[#046a50] p-8 lg:p-12">
              {/* Motif pointillés */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              {/* Orbes */}
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

              {/* Badge live pulsant */}
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-white shadow-lg shadow-secondary/30">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  Événement phare · 2026
                </span>
              </div>

              {/* Date mise en valeur */}
              <div className="relative my-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Date de l&apos;événement
                </p>
                <p className="text-6xl font-black leading-none text-white">
                  15{" "}
                  <span className="text-secondary">Sept</span>
                </p>
                <p className="mt-2 text-2xl font-bold text-white/60">2026</p>
              </div>

              {/* Infos */}
              <div className="relative space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-white/80">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <MapPin className="h-4 w-4 text-secondary" />
                  </span>
                  Niamey, Niger
                </div>
                <div className="flex items-center gap-2.5 text-sm text-white/80">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Users className="h-4 w-4 text-secondary" />
                  </span>
                  Inscription gratuite · Places limitées
                </div>
                <div className="flex items-center gap-2.5 text-sm text-white/80">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <CalendarDays className="h-4 w-4 text-secondary" />
                  </span>
                  Forum international panafricain
                </div>
              </div>
            </div>

            {/* ── Panneau droit : titre + compte à rebours + CTAs ── */}
            <div className="flex flex-col justify-center gap-7 bg-white p-8 lg:p-12">
              {/* Titre */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  Forum international
                </p>
                <h2
                  id="featured-event-heading"
                  className="text-3xl font-bold tracking-tight text-primary leading-tight md:text-4xl"
                >
                  Youth Connekt{" "}
                  <span className="text-secondary">Sahel 3</span>
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Rejoignez les jeunes leaders du Sahel pour des échanges
                  enrichissants, des formations pratiques et une mise en réseau
                  panafricaine unique. Un rendez-vous incontournable.
                </p>
              </div>

              {/* Compte à rebours */}
              <div>
                <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Compte à rebours
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <CountdownUnit value={days}    label="Jours" />
                  <CountdownUnit value={hours}   label="Heures" />
                  <CountdownUnit value={minutes} label="Min" />
                  <CountdownUnit value={seconds} label="Sec" />
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Button
                  className="rounded-full bg-secondary text-white hover:bg-secondary/90 shadow-md shadow-secondary/20 px-6 cursor-pointer transition-all duration-200"
                  asChild
                >
                  <Link
                    href="/events/ycs-sahel3/inscription"
                    className="inline-flex items-center gap-2"
                  >
                    S&apos;inscrire gratuitement
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-primary/25 text-primary hover:bg-primary/5 px-6 cursor-pointer transition-all duration-200"
                  asChild
                >
                  <Link
                    href="/events/ycs-sahel3/billet"
                    className="inline-flex items-center gap-2"
                  >
                    <Ticket className="h-4 w-4" />
                    Mon billet
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
