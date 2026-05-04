"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, LayoutDashboard, ShieldOff } from "lucide-react";
import { useSession } from "@/context/SessionContext";
import appConfig from "@/settings";
import { cn } from "@/lib/utils";

export default function UnauthorizedPage() {
  const { user, isAuthenticated } = useSession();

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-4 py-12 md:py-16"
      style={{
        background: `
          radial-gradient(ellipse 100% 85% at 50% -15%, rgba(255,255,255,.35), transparent 52%),
          radial-gradient(ellipse 75% 55% at 100% 90%, ${appConfig.primaryLightColor}55, transparent 50%),
          radial-gradient(ellipse 65% 50% at 0% 85%, rgba(255,255,255,.18), transparent 48%),
          linear-gradient(165deg, ${appConfig.primaryLightColor} 0%, ${appConfig.primaryColor} 38%, ${appConfig.primaryDarkColor} 100%)
        `,
      }}
    >
      {/* Grille décorative */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div
          className={cn(
            "rounded-3xl border bg-white p-6 shadow-xl backdrop-blur-sm md:p-10"
          )}
          style={{
            borderColor: `${appConfig.primaryColor}22`,
            boxShadow: `0 24px 64px -16px rgba(2, 74, 54, 0.35), 0 0 0 1px rgba(255,255,255,.8) inset`,
          }}
        >
          <div className="flex flex-col items-center text-center">
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{
                color: appConfig.primaryDarkColor,
                backgroundColor: appConfig.primaryLightTransparentColor,
                border: `1px solid ${appConfig.primaryTransparentColor}`,
              }}
            >
              <ShieldOff className="h-3.5 w-3.5 opacity-90" aria-hidden />
              403 — Accès refusé
            </span>

            <div className="mb-6 w-full max-w-[320px] md:max-w-[360px]">
              <div
                className="overflow-hidden rounded-2xl border bg-slate-50 shadow-md"
                style={{ borderColor: `${appConfig.primaryColor}18` }}
              >
                <Image
                  src="/Unauthorized.png"
                  alt="Illustration : vous n’êtes pas autorisé à accéder à cette page"
                  width={720}
                  height={480}
                  className="h-auto w-full object-cover object-center"
                  priority
                />
              </div>
            </div>

            <h1
              className="text-balance text-2xl font-bold tracking-tight md:text-3xl"
              style={{ color: appConfig.primaryDarkColor }}
            >
              Vous n’avez pas l’autorisation
            </h1>
            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-slate-600 md:text-base">
              Cette section est réservée à certains profils. Si vous pensez qu’il
              s’agit d’une erreur, contactez un administrateur ou reconnectez-vous
              avec un compte approprié.
            </p>

            {isAuthenticated && user?.email && (
              <p
                className="mt-4 rounded-xl border px-4 py-2 text-xs text-slate-600"
                style={{
                  backgroundColor: appConfig.primaryLightTransparentColor,
                  borderColor: `${appConfig.primaryColor}25`,
                }}
              >
                Connecté en tant que{" "}
                <span className="font-medium text-slate-800">{user.email}</span>
              </p>
            )}

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 active:scale-[0.98] sm:flex-initial"
                style={{
                  backgroundColor: appConfig.primaryColor,
                  boxShadow: `0 12px 28px -8px ${appConfig.primaryTransparentColor}`,
                }}
              >
                <Home className="h-4 w-4" aria-hidden />
                Accueil
              </Link>

              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-slate-50 active:scale-[0.98] sm:flex-initial"
                  style={{
                    borderColor: appConfig.primaryColor,
                    color: appConfig.primaryDarkColor,
                  }}
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                  Tableau de bord
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-slate-50 active:scale-[0.98] sm:flex-initial"
                  style={{
                    borderColor: appConfig.primaryColor,
                    color: appConfig.primaryDarkColor,
                  }}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs font-medium text-white/95 drop-shadow-sm">
          {appConfig.appName}
        </p>
      </motion.div>
    </div>
  );
}
