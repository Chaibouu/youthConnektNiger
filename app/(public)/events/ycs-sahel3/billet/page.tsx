import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { YcsSahel3BilletContent } from "./YcsSahel3BilletContent";

export const metadata: Metadata = {
  title: "Mon billet | YouthConnekt Sahel 3 — 2026",
  robots: { index: false, follow: false },
};

export default function BilletYcsSahel3Page() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Chargement de votre billet…
              </p>
            </div>
          }
        >
          <YcsSahel3BilletContent />
        </Suspense>
      </div>
    </div>
  );
}
