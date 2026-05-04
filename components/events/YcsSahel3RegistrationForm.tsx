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
import {
  Gender,
  ProfessionalStatus,
  YcsSahel3EducationLevel,
  YcsSahel3Interest,
} from "@prisma/client";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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

/** Astérisque rouge — champ obligatoire (schéma Zod) */
function Req() {
  return (
    <span className="ml-0.5 font-semibold text-destructive" aria-hidden="true">
      *
    </span>
  );
}

type FormPath = FieldPath<YcsSahel3RegistrationFormValues>;

const EDUCATION_OPTIONS: { value: YcsSahel3EducationLevel; label: string }[] = [
  { value: YcsSahel3EducationLevel.AUCUN, label: "Aucun" },
  { value: YcsSahel3EducationLevel.SECONDAIRE, label: "Secondaire" },
  { value: YcsSahel3EducationLevel.LICENCE, label: "Licence" },
  { value: YcsSahel3EducationLevel.MASTER, label: "Master" },
  { value: YcsSahel3EducationLevel.DOCTORAT, label: "Doctorat" },
];

const STATUS_OPTIONS: { value: ProfessionalStatus; label: string }[] = [
  { value: ProfessionalStatus.ETUDIANT, label: "Étudiant" },
  { value: ProfessionalStatus.ENTREPRENEUR, label: "Entrepreneur" },
  { value: ProfessionalStatus.SALARIE, label: "Salarié" },
  { value: ProfessionalStatus.SANS_EMPLOI, label: "Sans emploi" },
  { value: ProfessionalStatus.FONCTIONNAIRE, label: "Fonctionnaire" },
  { value: ProfessionalStatus.AUTRE, label: "Autre" },
];

const INTEREST_OPTIONS: { value: YcsSahel3Interest; label: string }[] = [
  { value: YcsSahel3Interest.ENTREPRENEURIAT, label: "Entrepreneuriat" },
  { value: YcsSahel3Interest.INNOVATION, label: "Innovation" },
  { value: YcsSahel3Interest.EMPLOI, label: "Emploi" },
  { value: YcsSahel3Interest.LEADERSHIP, label: "Leadership" },
  { value: YcsSahel3Interest.FORMATION, label: "Formation" },
];

type StepDef = {
  id: string;
  title: string;
  shortTitle: string;
  description?: string;
  fields: FormPath[];
};

const STEPS: StepDef[] = [
  {
    id: "identite",
    title: "Informations personnelles",
    shortTitle: "Identité",
    description: "Identifier le participant.",
    fields: [
      "lastName",
      "firstName",
      "gender",
      "countryOfResidence",
      "city",
      "phone",
      "email",
    ],
  },
  {
    id: "profil",
    title: "Profil socio-professionnel",
    shortTitle: "Profil",
    description: "Important pour les rapports (PNUD, partenaires).",
    fields: [
      "educationLevel",
      "professionalStatus",
      "activityDomain",
      "organisationEntreprise",
    ],
  },
  {
    id: "evenement",
    title: "Participation, entrepreneuriat, impact et consentement",
    shortTitle: "Événement",
    description:
      "Participation à l’événement, votre entreprise, organisations de jeunes et traitement des données.",
    fields: [
      "participatedYouthConnektBefore",
      "interests",
      "hasCompany",
      "companyName",
      "companySector",
      "isYouthOrganizationMember",
      "hasBenefitedFromSupportProgram",
      "consentDataProcessing",
    ],
  },
];

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
  /** Permet de ne pas répondre (valeur `undefined`) */
  optional?: boolean;
}) {
  const options: { v: YesNoValue; label: string }[] = [
    { v: true, label: "Oui" },
    { v: false, label: "Non" },
  ];
  if (optional) {
    options.push({ v: undefined, label: "Ne pas répondre" });
  }

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn(
        "inline-flex w-full rounded-xl border bg-background p-1",
        optional ? "max-w-lg flex-wrap gap-1 sm:flex-nowrap" : "max-w-xs sm:w-auto"
      )}
    >
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
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

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

  return (
    <div className="space-y-4">
      {/* Libellé étape courante — lisible partout */}
      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground">
          Étape {current + 1} sur {total}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">
          {STEPS[current].shortTitle}
        </p>
      </div>

      {/* Référence visuelle : cercles numérotés + segments (primaire / gris) */}
      <div
        className={cn(
          "w-full overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden"
        )}
      >
        <nav
          className="flex min-w-max items-center px-0 sm:min-w-full"
          aria-label="Progression du formulaire"
        >
          {STEPS.map((s, i) => {
            const filled = i <= current;
            const segmentDone = i < current;
            const isReachable = i <= maxReached;
            const isActive = i === current;

            return (
              <Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => isReachable && onJump(i)}
                  disabled={!isReachable}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Étape ${i + 1} — ${s.shortTitle}`}
                  className={cn(
                    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    filled
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground ring-1 ring-border",
                    isReachable && !filled && "hover:bg-muted/80",
                    !isReachable && "opacity-50"
                  )}
                >
                  {i + 1}
                </button>
                {i < total - 1 ? (
                  <div
                    aria-hidden
                    className={cn(
                      "mx-1.5 h-1 min-w-[1rem] flex-1 rounded-full transition-colors sm:mx-2 sm:h-1.5",
                      segmentDone ? "bg-primary" : "bg-muted"
                    )}
                  />
                ) : null}
              </Fragment>
            );
          })}
        </nav>
      </div>

      {/* Légende courte sous la ligne (desktop: évite de perdre le contexte) */}
      <ul className="hidden grid-cols-3 gap-1 text-center text-[10px] leading-tight text-muted-foreground sm:grid sm:text-[11px]">
        {STEPS.map((s, i) => (
          <li
            key={`lbl-${s.id}`}
            className={cn(
              i === current && "font-medium text-primary",
              i < current && "text-foreground/70"
            )}
          >
            {s.shortTitle}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function YcsSahel3RegistrationForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
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

  const hasCompany = form.watch("hasCompany") === true;
  const consentAccepted = form.watch("consentDataProcessing") === true;
  const isLastStep = step === STEPS.length - 1;

  useEffect(() => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const goNext = async () => {
    const ok = await form.trigger(STEPS[step].fields, { shouldFocus: true });
    if (!ok) return;
    const next = Math.min(step + 1, STEPS.length - 1);
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  const jumpTo = (i: number) => {
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
          setSubmitError(
            data.error ?? "Cette adresse e-mail est déjà inscrite."
          );
          setStep(0);
          return;
        }

        if (!res.ok) {
          if (data.errors && typeof data.errors === "object") {
            for (const [key, message] of Object.entries(data.errors)) {
              if (typeof message === "string") {
                form.setError(key as Parameters<typeof form.setError>[0], {
                  message,
                });
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
      <div ref={formTopRef} />
      <form
        onSubmit={(e) => {
          /* Jamais de submit HTML (Entrée, etc.) — l’API n’est appelée que via le bouton « Valider » */
          e.preventDefault();
        }}
        className="space-y-6"
        noValidate
      >
        <Stepper current={step} maxReached={maxReached} onJump={jumpTo} />

        <section className="rounded-2xl border bg-card p-5 sm:p-7 shadow-sm">
          <header className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              Étape {step + 1} sur {STEPS.length}
            </p>
            <h2 className="mt-1 text-lg font-semibold sm:text-xl">
              {STEPS[step].title}
            </h2>
            {STEPS[step].description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {STEPS[step].description}
              </p>
            ) : null}
          </header>

          <div key={STEPS[step].id} className="space-y-5">
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nom
                        <Req />
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          autoComplete="family-name"
                          className="h-11"
                        />
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
                      <FormLabel>
                        Prénom
                        <Req />
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          autoComplete="given-name"
                          className="h-11"
                        />
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
                      <FormLabel>Sexe</FormLabel>
                      <Select
                        onValueChange={(v) =>
                          field.onChange(
                            v === "__none__" ? undefined : (v as Gender)
                          )
                        }
                        value={field.value ?? "__none__"}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Optionnel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">
                            Non renseigné
                          </SelectItem>
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
                      <FormLabel>
                        Pays de résidence
                        <Req />
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          autoComplete="country-name"
                          className="h-11"
                        />
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
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          autoComplete="address-level2"
                          placeholder="Optionnel"
                          className="h-11"
                        />
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
                      <FormLabel>
                        Téléphone
                        <span className="ml-1 font-normal text-muted-foreground">
                          (WhatsApp de préférence)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          disabled={isPending}
                          placeholder="Optionnel"
                          className="h-11"
                        />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          disabled={isPending}
                          placeholder="Optionnel"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 1 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="educationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niveau d&apos;étude</FormLabel>
                        <Select
                          onValueChange={(v) =>
                            field.onChange(
                              v === "__none__"
                                ? undefined
                                : (v as YcsSahel3EducationLevel)
                            )
                          }
                          value={field.value ?? "__none__"}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Optionnel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__none__">
                              Non renseigné
                            </SelectItem>
                            {EDUCATION_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
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
                        <FormLabel>Statut professionnel</FormLabel>
                        <Select
                          onValueChange={(v) =>
                            field.onChange(
                              v === "__none__"
                                ? undefined
                                : (v as ProfessionalStatus)
                            )
                          }
                          value={field.value ?? "__none__"}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Optionnel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__none__">
                              Non renseigné
                            </SelectItem>
                            {STATUS_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
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
                      <FormLabel>Domaine d&apos;activité</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={3}
                          disabled={isPending}
                          placeholder="Optionnel — ex. agriculture, numérique, artisanat…"
                          className={cn(
                            "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
                            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            "disabled:cursor-not-allowed disabled:opacity-50"
                          )}
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
                      <FormLabel>
                        Organisation / entreprise{" "}
                        <span className="font-normal text-muted-foreground">
                          (optionnel)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          disabled={isPending}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <div className="space-y-10">
                <div className="space-y-5">
                  <h3 className="border-b border-border pb-2 text-sm font-semibold tracking-wide text-foreground">
                    Participation
                  </h3>
                  <FormField
                    control={form.control}
                    name="participatedYouthConnektBefore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Avez-vous déjà participé à YouthConnekt ?
                        </FormLabel>
                        <FormControl>
                          <YesNo
                            name="participation-precedente"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isPending}
                            optional
                          />
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
                        <FormLabel>Intérêts principaux</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Optionnel — sélectionnez tout ce qui vous intéresse.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {INTEREST_OPTIONS.map(({ value, label }) => {
                            const checked = field.value.includes(value);
                            return (
                              <button
                                key={value}
                                type="button"
                                disabled={isPending}
                                aria-pressed={checked}
                                onClick={() => {
                                  if (checked) {
                                    field.onChange(
                                      field.value.filter(
                                        (v: YcsSahel3Interest) => v !== value
                                      )
                                    );
                                  } else {
                                    field.onChange([...field.value, value]);
                                  }
                                }}
                                className={cn(
                                  "rounded-full border px-4 py-2 text-sm transition-colors",
                                  checked
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-input bg-background hover:border-primary/40 hover:bg-muted/50"
                                )}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-5">
                  <h3 className="border-b border-border pb-2 text-sm font-semibold tracking-wide text-foreground">
                    Entreprise
                  </h3>
                  <FormField
                    control={form.control}
                    name="hasCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avez-vous une entreprise ?</FormLabel>
                        <FormControl>
                          <YesNo
                            name="a-une-entreprise"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isPending}
                            optional
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {hasCompany ? (
                    <div className="grid gap-4 rounded-xl border border-dashed bg-muted/30 p-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nom de l&apos;entreprise
                              <Req />
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value ?? ""}
                                disabled={isPending}
                                className="h-11 bg-background"
                              />
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
                            <FormLabel>
                              Secteur d&apos;activité
                              <Req />
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value ?? ""}
                                disabled={isPending}
                                className="h-11 bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : null}
                </div>

                <div className="space-y-5">
                  <h3 className="border-b border-border pb-2 text-sm font-semibold tracking-wide text-foreground">
                    Impact
                  </h3>
                  <FormField
                    control={form.control}
                    name="isYouthOrganizationMember"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Êtes-vous membre d&apos;une organisation de jeunes ?
                        </FormLabel>
                        <FormControl>
                          <YesNo
                            name="organisation-jeunes"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isPending}
                            optional
                          />
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
                        <FormLabel>
                          Avez-vous déjà bénéficié d&apos;un programme
                          d&apos;appui ?
                        </FormLabel>
                        <FormControl>
                          <YesNo
                            name="programme-appui"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isPending}
                            optional
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-5">
                  <h3 className="border-b border-border pb-2 text-sm font-semibold tracking-wide text-foreground">
                    Consentement
                  </h3>
                  <FormField
                    control={form.control}
                    name="consentDataProcessing"
                    render={({ field }) => (
                      <FormItem className="space-y-0 rounded-lg border bg-background p-4">
                        <div className="flex gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(v) =>
                                field.onChange(v === true)
                              }
                              disabled={isPending}
                              className="mt-1 shrink-0"
                            />
                          </FormControl>
                          <div className="min-w-0 space-y-3 leading-snug">
                            <FormLabel className="text-sm font-normal text-foreground">
                              J&apos;accepte que mes données personnelles
                              soient utilisées pour les finalités suivantes&nbsp;:
                            </FormLabel>
                            <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
                              <li>
                                l&apos;organisation de l&apos;événement
                                YouthConnekt Sahel&nbsp;;
                              </li>
                              <li>
                                la production de statistiques anonymes
                                agrégées&nbsp;;
                              </li>
                              <li>
                                la préparation de rapports et synthèses à
                                destination des partenaires et organisateurs.
                              </li>
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
          </div>
        </section>

        {submitError ? (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {submitError}
          </p>
        ) : null}

        {/* Navigation — sticky en mobile */}
        <div
          className={cn(
            "sticky bottom-0 -mx-4 mt-2 flex flex-col-reverse gap-2 border-t bg-background/95 px-4 py-3 backdrop-blur",
            "sm:static sm:mx-0 sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:border sm:bg-card sm:p-4 sm:shadow-sm"
          )}
        >
          {step === 0 ? (
            <Button asChild variant="ghost" type="button">
              <Link href="/">Annuler</Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={goPrev}
              disabled={isPending}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Précédent
            </Button>
          )}

          {isLastStep ? (
            <Button
              type="button"
              disabled={isPending || !consentAccepted}
              className="bg-primary text-primary-foreground hover:bg-primary/90 sm:min-w-[220px]"
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                "Valider mon inscription"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goNext}
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 sm:min-w-[180px]"
            >
              Suivant
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
