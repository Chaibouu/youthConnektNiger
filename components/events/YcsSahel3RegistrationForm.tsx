"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Gender,
  ProfessionalStatus,
  YcsSahel3EducationLevel,
  YcsSahel3Interest,
} from "@prisma/client";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  User,
  Briefcase,
  Star,
  Building2,
  BarChart3,
  Shield,
  Send,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  ycsSahel3RegistrationFormSchema,
  type YcsSahel3RegistrationFormValues,
} from "@/schemas/ycsSahel3Registration";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ─── Required asterisk ─────────────────────────────────── */
function Req() {
  return (
    <span className="ml-0.5 font-bold text-secondary" aria-hidden="true">
      *
    </span>
  );
}

/* ─── Label style helper ─────────────────────────────────── */
const labelClass =
  "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";

/* ─── Input class helper ─────────────────────────────────── */
const inputClass =
  "h-11 rounded-xl border-border/70 bg-background transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30";

/* ─── Select trigger class ───────────────────────────────── */
const selectClass =
  "h-11 rounded-xl border-border/70 focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all";

type FormPath = FieldPath<YcsSahel3RegistrationFormValues>;

/* ─── Options ─────────────────────────────────────────────── */
const EDUCATION_OPTIONS: { value: YcsSahel3EducationLevel; label: string }[] = [
  { value: YcsSahel3EducationLevel.AUCUN,      label: "Aucun" },
  { value: YcsSahel3EducationLevel.SECONDAIRE, label: "Secondaire" },
  { value: YcsSahel3EducationLevel.LICENCE,    label: "Licence" },
  { value: YcsSahel3EducationLevel.MASTER,     label: "Master" },
  { value: YcsSahel3EducationLevel.DOCTORAT,   label: "Doctorat" },
];

const STATUS_OPTIONS: { value: ProfessionalStatus; label: string }[] = [
  { value: ProfessionalStatus.ETUDIANT,     label: "Étudiant(e)" },
  { value: ProfessionalStatus.ENTREPRENEUR, label: "Entrepreneur(e)" },
  { value: ProfessionalStatus.SALARIE,      label: "Salarié(e)" },
  { value: ProfessionalStatus.SANS_EMPLOI,  label: "Sans emploi" },
  { value: ProfessionalStatus.FONCTIONNAIRE,label: "Fonctionnaire" },
  { value: ProfessionalStatus.AUTRE,        label: "Autre" },
];

const INTEREST_OPTIONS: { value: YcsSahel3Interest; label: string; emoji: string }[] = [
  { value: YcsSahel3Interest.ENTREPRENEURIAT, label: "Entrepreneuriat", emoji: "🚀" },
  { value: YcsSahel3Interest.INNOVATION,      label: "Innovation",      emoji: "💡" },
  { value: YcsSahel3Interest.EMPLOI,          label: "Emploi",          emoji: "💼" },
  { value: YcsSahel3Interest.LEADERSHIP,      label: "Leadership",      emoji: "🌟" },
  { value: YcsSahel3Interest.FORMATION,       label: "Formation",       emoji: "📚" },
];

/* ─── Steps ───────────────────────────────────────────────── */
type StepDef = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ReactNode;
  fields: FormPath[];
};

const STEPS: StepDef[] = [
  {
    id: "identite",
    title: "Informations personnelles",
    shortTitle: "Identité",
    description: "Vos coordonnées pour créer votre billet.",
    icon: <User className="h-4 w-4" />,
    fields: ["lastName","firstName","gender","countryOfResidence","city","phone","email"],
  },
  {
    id: "profil",
    title: "Profil socio-professionnel",
    shortTitle: "Profil",
    description: "Permet d'adapter le programme et les rapports officiels.",
    icon: <Briefcase className="h-4 w-4" />,
    fields: ["educationLevel","professionalStatus","activityDomain","organisationEntreprise"],
  },
  {
    id: "evenement",
    title: "Participation & consentement",
    shortTitle: "Finalisation",
    description: "Vos intérêts, votre entreprise et l'accord de traitement des données.",
    icon: <Star className="h-4 w-4" />,
    fields: [
      "participatedYouthConnektBefore","interests","hasCompany","companyName",
      "companySector","isYouthOrganizationMember","hasBenefitedFromSupportProgram",
      "consentDataProcessing",
    ],
  },
];

/* ─── Section divider ─────────────────────────────────────── */
function SectionDivider({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="text-sm font-semibold text-foreground">{title}</span>
      <div className="flex-1 h-px bg-border/70" />
    </div>
  );
}

/* ─── YesNo toggle ────────────────────────────────────────── */
type YesNoValue = boolean | undefined;

function YesNo({
  value,
  onChange,
  disabled,
  name,
  optional,
}: {
  value: YesNoValue;
  onChange: (v: YesNoValue) => void;
  disabled?: boolean;
  name: string;
  optional?: boolean;
}) {
  const options: { v: YesNoValue; label: string }[] = [
    { v: true,      label: "Oui" },
    { v: false,     label: "Non" },
    ...(optional ? [{ v: undefined as YesNoValue, label: "Ne pas répondre" }] : []),
  ];

  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map(({ v, label }) => {
        const active = value === v;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer",
              active
                ? v === true
                  ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                  : v === false
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-muted-foreground/30 bg-muted text-muted-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {active && v === true && <Check className="h-3.5 w-3.5" />}
            {active && v === false && <span className="h-3.5 w-3.5 text-red-400">✕</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Stepper ─────────────────────────────────────────────── */
function Stepper({
  current,
  maxReached,
  onJump,
}: {
  current: number;
  maxReached: number;
  onJump: (i: number) => void;
}) {
  const total = STEPS.length;
  const progress = (current / (total - 1)) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span className="font-medium">
          Étape{" "}
          <span className="text-primary font-bold">{current + 1}</span>{" "}
          sur {total}
        </span>
        <span className="font-semibold text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          animate={{ width: `${current === 0 ? 5 : progress}%` }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        />
      </div>

      {/* Step circles */}
      <nav
        className="flex items-start justify-between pt-1"
        aria-label="Progression du formulaire"
      >
        {STEPS.map((s, i) => {
          const completed  = i < current;
          const active     = i === current;
          const reachable  = i <= maxReached;

          return (
            <Fragment key={s.id}>
              <button
                type="button"
                onClick={() => reachable && onJump(i)}
                disabled={!reachable}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex flex-col items-center gap-2 focus-visible:outline-none group",
                  !reachable && "opacity-40 cursor-not-allowed",
                  reachable && !active && "cursor-pointer"
                )}
              >
                <motion.div
                  className={cn(
                    "relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                    completed
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : active
                        ? "border-2 border-primary bg-white text-primary shadow-lg shadow-primary/20"
                        : "border-2 border-border bg-background text-muted-foreground"
                  )}
                  animate={active ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                  {/* Pulsing ring for active */}
                  {active && (
                    <span className="absolute inset-0 rounded-full ring-4 ring-primary/20 animate-pulse" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "max-w-[80px] text-center text-[11px] leading-tight transition-colors",
                    active
                      ? "font-bold text-primary"
                      : completed
                        ? "font-medium text-foreground/70"
                        : "text-muted-foreground"
                  )}
                >
                  {s.shortTitle}
                </span>
              </button>

              {/* Animated connector line */}
              {i < total - 1 && (
                <div className="mt-5 flex-1 overflow-hidden rounded-full h-0.5 mx-2 bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    animate={{ width: i < current ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </nav>
    </div>
  );
}

/* ─── Main form component ─────────────────────────────────── */
export function YcsSahel3RegistrationForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [maxReached, setMaxReached] = useState(0);
  const formTopRef = useRef<HTMLDivElement | null>(null);

  const defaultValues = useMemo<YcsSahel3RegistrationFormValues>(
    () => ({
      lastName: "",
      firstName: "",
      gender: undefined,
      countryOfResidence: "",
      city: "",
      phone: "",
      email: "",
      educationLevel: undefined,
      professionalStatus: undefined,
      activityDomain: "",
      organisationEntreprise: undefined,
      participatedYouthConnektBefore: undefined,
      interests: [],
      hasCompany: undefined,
      companyName: undefined,
      companySector: undefined,
      isYouthOrganizationMember: undefined,
      hasBenefitedFromSupportProgram: undefined,
      consentDataProcessing: false,
    }),
    []
  );

  const form = useForm<YcsSahel3RegistrationFormValues>({
    resolver: zodResolver(ycsSahel3RegistrationFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  const hasCompany     = form.watch("hasCompany") === true;
  const consentAccepted= form.watch("consentDataProcessing") === true;
  const isLastStep     = step === STEPS.length - 1;

  useEffect(() => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const goNext = async () => {
    const ok = await form.trigger(STEPS[step].fields, { shouldFocus: true });
    if (!ok) return;
    const next = Math.min(step + 1, STEPS.length - 1);
    setDirection(1);
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const jumpTo = (i: number) => {
    if (i > step) setDirection(1);
    else setDirection(-1);
    if (i <= maxReached) setStep(i);
  };

  const onSubmit = (values: YcsSahel3RegistrationFormValues) => {
    setSubmitError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/events/ycs-sahel3/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            organisationEntreprise: values.organisationEntreprise || undefined,
            companyName: values.companyName || undefined,
            companySector: values.companySector || undefined,
          }),
        });
        const data = await res.json();

        if (res.status === 409) {
          setSubmitError(data.error ?? "Cette adresse e-mail est déjà inscrite.");
          setStep(0);
          return;
        }

        if (!res.ok) {
          if (data.errors && typeof data.errors === "object") {
            for (const [key, message] of Object.entries(data.errors)) {
              if (typeof message === "string") {
                form.setError(key as Parameters<typeof form.setError>[0], { message });
                const owningStep = STEPS.findIndex((s) =>
                  s.fields.includes(key as FormPath)
                );
                if (owningStep !== -1) setStep(owningStep);
              }
            }
          }
          setSubmitError(data.error ?? "Une erreur est survenue.");
          return;
        }

        toast.success("Inscription enregistrée !");
        const path =
          typeof data.ticketPagePath === "string"
            ? data.ticketPagePath
            : `/events/ycs-sahel3/billet?registrationId=${encodeURIComponent(data.id)}&token=${encodeURIComponent(data.ticketToken)}`;
        router.push(path);
      } catch {
        setSubmitError("Erreur réseau. Réessayez.");
      }
    });
  };

  return (
    <Form {...form}>
      <div ref={formTopRef} className="-mt-2" />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-6"
        noValidate
      >
        {/* Stepper */}
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm sm:p-6">
          <Stepper current={step} maxReached={maxReached} onJump={jumpTo} />
        </div>

        {/* Step card */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
          {/* Card header */}
          <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {STEPS[step].icon}
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                  Étape {step + 1} · {STEPS[step].shortTitle}
                </p>
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  {STEPS[step].title}
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground pl-12">
              {STEPS[step].description}
            </p>
          </div>

          {/* Card body — animated step transition */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ x: direction * 24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -24, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="p-5 sm:p-7"
              >
                {/* ── Step 0: Identité ── */}
                {step === 0 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Nom <Req /></FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isPending} autoComplete="family-name" className={inputClass} placeholder="Votre nom de famille" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Prénom <Req /></FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isPending} autoComplete="given-name" className={inputClass} placeholder="Votre prénom" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Sexe</FormLabel>
                          <Select
                            onValueChange={(v) => field.onChange(v === "__none__" ? undefined : (v as Gender))}
                            value={field.value ?? "__none__"}
                            disabled={isPending}
                          >
                            <FormControl>
                              <SelectTrigger className={selectClass}>
                                <SelectValue placeholder="Optionnel" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="__none__">Non renseigné</SelectItem>
                              <SelectItem value={Gender.Masculin}>Homme</SelectItem>
                              <SelectItem value={Gender.Feminin}>Femme</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="countryOfResidence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Pays de résidence <Req /></FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isPending} autoComplete="country-name" className={inputClass} placeholder="ex. Niger, Burkina Faso…" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Ville <span className="font-normal normal-case text-muted-foreground">(optionnel)</span></FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isPending} autoComplete="address-level2" placeholder="ex. Niamey, Zinder…" className={inputClass} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            Téléphone{" "}
                            <span className="font-normal normal-case text-muted-foreground">(WhatsApp de préférence)</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" inputMode="tel" autoComplete="tel" disabled={isPending} placeholder="+227 …" className={inputClass} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className={labelClass}>
                            Email{" "}
                            <span className="font-normal normal-case text-muted-foreground">(reçoit votre billet)</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="email" inputMode="email" autoComplete="email" disabled={isPending} placeholder="votre@email.com" className={inputClass} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* ── Step 1: Profil ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="educationLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>Niveau d&apos;étude</FormLabel>
                            <Select
                              onValueChange={(v) => field.onChange(v === "__none__" ? undefined : (v as YcsSahel3EducationLevel))}
                              value={field.value ?? "__none__"}
                              disabled={isPending}
                            >
                              <FormControl>
                                <SelectTrigger className={selectClass}>
                                  <SelectValue placeholder="Optionnel" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="__none__">Non renseigné</SelectItem>
                                {EDUCATION_OPTIONS.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="professionalStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>Statut professionnel</FormLabel>
                            <Select
                              onValueChange={(v) => field.onChange(v === "__none__" ? undefined : (v as ProfessionalStatus))}
                              value={field.value ?? "__none__"}
                              disabled={isPending}
                            >
                              <FormControl>
                                <SelectTrigger className={selectClass}>
                                  <SelectValue placeholder="Optionnel" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="__none__">Non renseigné</SelectItem>
                                {STATUS_OPTIONS.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="activityDomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            Domaine d&apos;activité{" "}
                            <span className="font-normal normal-case text-muted-foreground">(optionnel)</span>
                          </FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              rows={3}
                              disabled={isPending}
                              placeholder="ex. agriculture, numérique, artisanat, santé…"
                              className="flex w-full resize-none rounded-xl border border-border/70 bg-background px-3.5 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground transition-all focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organisationEntreprise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            Organisation / entreprise{" "}
                            <span className="font-normal normal-case text-muted-foreground">(optionnel)</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} disabled={isPending} className={inputClass} placeholder="Nom de votre organisation ou entreprise" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* ── Step 2: Participation & consentement ── */}
                {step === 2 && (
                  <div className="space-y-8">

                    {/* Participation */}
                    <div className="space-y-5">
                      <SectionDivider icon={<Star className="h-3.5 w-3.5" />} title="Participation" />
                      <FormField
                        control={form.control}
                        name="participatedYouthConnektBefore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>Avez-vous déjà participé à YouthConnekt ?</FormLabel>
                            <FormControl>
                              <YesNo name="participation-precedente" value={field.value} onChange={field.onChange} disabled={isPending} optional />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Intérêts principaux{" "}
                              <span className="font-normal normal-case text-muted-foreground">(plusieurs choix possibles)</span>
                            </FormLabel>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {INTEREST_OPTIONS.map(({ value, label, emoji }) => {
                                const checked = field.value.includes(value);
                                return (
                                  <button
                                    key={value}
                                    type="button"
                                    disabled={isPending}
                                    aria-pressed={checked}
                                    onClick={() => {
                                      if (checked) {
                                        field.onChange(field.value.filter((v: YcsSahel3Interest) => v !== value));
                                      } else {
                                        field.onChange([...field.value, value]);
                                      }
                                    }}
                                    className={cn(
                                      "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer",
                                      checked
                                        ? "border-primary bg-primary text-white shadow-sm shadow-primary/25"
                                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/50"
                                    )}
                                  >
                                    <span>{emoji}</span>
                                    {label}
                                    {checked && <Check className="h-3.5 w-3.5" />}
                                  </button>
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Entreprise */}
                    <div className="space-y-5">
                      <SectionDivider icon={<Building2 className="h-3.5 w-3.5" />} title="Entreprise" />
                      <FormField
                        control={form.control}
                        name="hasCompany"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>Avez-vous une entreprise ?</FormLabel>
                            <FormControl>
                              <YesNo name="a-une-entreprise" value={field.value} onChange={field.onChange} disabled={isPending} optional />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <AnimatePresence>
                        {hasCompany && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="grid gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className={labelClass}>Nom de l&apos;entreprise <Req /></FormLabel>
                                    <FormControl>
                                      <Input {...field} value={field.value ?? ""} disabled={isPending} className={cn(inputClass, "bg-white")} placeholder="Nom officiel" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="companySector"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className={labelClass}>Secteur d&apos;activité <Req /></FormLabel>
                                    <FormControl>
                                      <Input {...field} value={field.value ?? ""} disabled={isPending} className={cn(inputClass, "bg-white")} placeholder="ex. Agro-alimentaire, Tech…" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Impact */}
                    <div className="space-y-5">
                      <SectionDivider icon={<BarChart3 className="h-3.5 w-3.5" />} title="Impact" />
                      <FormField
                        control={form.control}
                        name="isYouthOrganizationMember"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>Êtes-vous membre d&apos;une organisation de jeunes ?</FormLabel>
                            <FormControl>
                              <YesNo name="organisation-jeunes" value={field.value} onChange={field.onChange} disabled={isPending} optional />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hasBenefitedFromSupportProgram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>Avez-vous bénéficié d&apos;un programme d&apos;appui ?</FormLabel>
                            <FormControl>
                              <YesNo name="programme-appui" value={field.value} onChange={field.onChange} disabled={isPending} optional />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Consentement */}
                    <div className="space-y-4">
                      <SectionDivider icon={<Shield className="h-3.5 w-3.5" />} title="Consentement" />
                      <FormField
                        control={form.control}
                        name="consentDataProcessing"
                        render={({ field }) => (
                          <FormItem>
                            <div
                              className={cn(
                                "flex gap-4 rounded-2xl border p-4 transition-colors duration-200",
                                field.value
                                  ? "border-primary/30 bg-primary/5"
                                  : "border-border bg-background"
                              )}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(v) => field.onChange(v === true)}
                                  disabled={isPending}
                                  className="mt-0.5 shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </FormControl>
                              <div className="min-w-0 space-y-2.5">
                                <FormLabel className="cursor-pointer text-sm font-medium leading-snug text-foreground">
                                  J&apos;accepte que mes données personnelles soient utilisées pour les finalités suivantes&nbsp;:
                                </FormLabel>
                                <ul className="space-y-1.5 text-sm text-muted-foreground">
                                  {[
                                    "L'organisation de l'événement YouthConnekt Sahel",
                                    "La production de statistiques anonymes agrégées",
                                    "La préparation de rapports à destination des partenaires",
                                  ].map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                                <FormMessage />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Error alert */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3.5 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {submitError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation bar */}
        <div
          className={cn(
            "sticky bottom-0 -mx-4 flex flex-col-reverse gap-2 border-t bg-background/97 px-4 py-3 backdrop-blur-md",
            "sm:static sm:mx-0 sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:border sm:border-border/60 sm:bg-white sm:px-5 sm:py-4 sm:shadow-sm"
          )}
        >
          {/* Left: back / cancel */}
          {step === 0 ? (
            <Button asChild variant="ghost" type="button" className="rounded-xl text-muted-foreground">
              <Link href="/">← Annuler</Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={goPrev}
              disabled={isPending}
              className="rounded-xl border-border/70 gap-1.5 text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
          )}

          {/* Right: next / submit */}
          {isLastStep ? (
            <Button
              type="button"
              disabled={isPending || !consentAccepted}
              onClick={() => form.handleSubmit(onSubmit)()}
              className="rounded-xl bg-secondary px-7 font-bold text-white shadow-md shadow-secondary/25 transition-all duration-200 hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/30 active:scale-95 disabled:opacity-50 sm:min-w-[220px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Valider mon inscription
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goNext}
              disabled={isPending}
              className="rounded-xl bg-primary px-7 font-bold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-95 sm:min-w-[180px]"
            >
              Suivant
              <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          )}
        </div>

      </form>
    </Form>
  );
}
