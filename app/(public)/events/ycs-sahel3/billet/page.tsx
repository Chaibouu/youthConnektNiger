import type { Metadata } from "next";
import { Suspense } from "react";
import { YcsSahel3BilletContent } from "./YcsSahel3BilletContent";

export const metadata: Metadata = {
  title: "Mon billet | YouthConnekt Sahel — 3e édition",
  robots: { index: false, follow: false },
};

export default function BilletYcsSahel3Page() {
  return (
    <div className="border-b bg-muted/30 py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <Suspense
          fallback={
            <div className="py-20 text-center text-muted-foreground">
              Chargement…
            </div>
          }
        >
          <YcsSahel3BilletContent />
        </Suspense>
      </div>
    </div>
  );
}
