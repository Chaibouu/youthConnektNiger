"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, Clock, CheckCircle2, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ─── Contact info items ─── */
const infos = [
  {
    icon: MapPin,
    title: "Adresse",
    value: "Niamey, Niger",
    href: null,
    color: "bg-secondary/20 text-secondary",
  },
  {
    icon: Mail,
    title: "Email",
    value: "contact@youthconnektniger.org",
    href: "mailto:contact@youthconnektniger.org",
    color: "bg-white/15 text-white",
  },
  {
    icon: Phone,
    title: "Téléphone",
    value: "+227 12 34 56 78",
    href: "tel:+22712345678",
    color: "bg-white/15 text-white",
  },
];

const SUBJECTS = [
  "Demande d'information générale",
  "Inscription à un programme",
  "Partenariat / Collaboration",
  "Presse & Médias",
  "Signalement / Réclamation",
  "Autre",
];

const MAX_CHARS = 500;

/* ─── Form right panel ─── */
function ContactForm() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const remaining = MAX_CHARS - message.length;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up to /api/contact
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border/60 bg-card p-10 shadow-sm text-center h-full"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary">Message envoyé !</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Merci pour votre message. Notre équipe vous répondra dans les 24 heures.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs font-semibold text-secondary hover:underline"
        >
          Envoyer un autre message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ x: 20, opacity: 0 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border/60 bg-card p-8 shadow-sm lg:col-span-3"
    >
      {/* Response-time badge */}
      <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-2.5 text-xs font-medium text-primary w-fit">
        <Clock className="h-3.5 w-3.5 text-secondary" />
        Réponse garantie sous&nbsp;<strong>24h</strong> en jours ouvrés
      </div>

      {/* Name + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Nom complet <span className="text-secondary">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Votre nom"
            required
            className="h-11 rounded-xl border-border/70 bg-background focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Adresse email <span className="text-secondary">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="votre@email.org"
            required
            className="h-11 rounded-xl border-border/70 bg-background focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Subject select */}
      <div className="space-y-1.5">
        <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sujet
        </Label>
        <div className="relative">
          <select
            id="subject"
            name="subject"
            defaultValue=""
            className="h-11 w-full appearance-none rounded-xl border border-border/70 bg-background px-3 pr-10 text-sm text-foreground ring-offset-background transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              Choisissez un sujet…
            </option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Message + char counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Message <span className="text-secondary">*</span>
          </Label>
          <span
            className={`text-[11px] tabular-nums transition-colors ${
              remaining < 50 ? "font-semibold text-secondary" : "text-muted-foreground"
            }`}
          >
            {remaining} / {MAX_CHARS}
          </span>
        </div>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={MAX_CHARS}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Décrivez votre demande en détail…"
          required
          className="flex w-full resize-none rounded-xl border border-border/70 bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground ring-offset-background placeholder:text-muted-foreground transition-all focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {/* Progress bar */}
        <div className="h-0.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              remaining < 50 ? "bg-secondary" : "bg-primary/40"
            }`}
            style={{ width: `${((MAX_CHARS - remaining) / MAX_CHARS) * 100}%` }}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <p className="text-[11px] text-muted-foreground">
          En soumettant ce formulaire, vous acceptez notre{" "}
          <a href="/privacy" className="font-medium text-primary hover:underline">
            politique de confidentialité
          </a>
          .
        </p>
        <Button
          type="submit"
          size="lg"
          className="shrink-0 rounded-full bg-secondary px-7 font-semibold text-white shadow-md shadow-secondary/25 transition-all duration-200 hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/30 active:scale-95"
        >
          <Send className="mr-2 h-4 w-4" />
          Envoyer le message
        </Button>
      </div>
    </motion.form>
  );
}

/* ─── Main section ─── */
export function ContactSection() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden" id="contact">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-secondary/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/4 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Restons en contact
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            Une question ou un projet ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Écrivez-nous, l&apos;équipe Youth Connekt Niger vous répondra dans
            les plus brefs délais.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">

          {/* Contact info — left */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#012e22] via-[#035740] to-[#046a50] p-8 text-white shadow-xl">
              {/* Dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Glow orb */}
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

              <div className="relative">
                <h3 className="text-xl font-bold">Bureau Youth Connekt Niger</h3>
                <p className="mt-2 text-sm text-white/70">
                  Notre équipe est disponible du lundi au vendredi, de 8h à 17h.
                </p>

                <ul className="mt-8 space-y-5">
                  {infos.map((info) => {
                    const Icon = info.icon;
                    return (
                      <li key={info.title} className="flex gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${info.color} transition-transform duration-200 hover:scale-105`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary">
                            {info.title}
                          </p>
                          {info.href ? (
                            <a
                              href={info.href}
                              className="break-all text-sm font-medium text-white/90 hover:text-white hover:underline transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-white/90">{info.value}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Availability badge */}
                <div className="mt-10 flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                  </span>
                  <p className="text-xs font-medium text-white/80">
                    Équipe disponible · Lun – Ven, 8h–17h
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form — right */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

        </div>
      </div>
    </section>
  );
}
