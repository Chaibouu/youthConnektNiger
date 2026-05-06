"use client";

import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   Partners data — two rows for the double marquee
   ───────────────────────────────────────────────────────── */
const row1 = [
  { name: "PNUD Niger",             abbr: "PNUD",    grad: "from-[#006bb6] to-[#004e8c]" },
  { name: "République du Niger",    abbr: "NIG",     grad: "from-[#024a36] to-[#046a50]" },
  { name: "Ministère de la Jeunesse", abbr: "MJ",   grad: "from-[#035740] to-[#024a36]" },
  { name: "Union Africaine",        abbr: "UA",      grad: "from-[#006bb6] to-[#0050a0]" },
  { name: "CEDEAO",                 abbr: "CED",     grad: "from-[#E26E12] to-[#c45e0a]" },
  { name: "Banque Mondiale",        abbr: "BM",      grad: "from-[#003087] to-[#0050a0]" },
  { name: "ONU Femmes",             abbr: "ONU",     grad: "from-[#6b21a8] to-[#4c1d95]" },
];

const row2 = [
  { name: "Secteur Privé Niger",    abbr: "SPN",     grad: "from-[#c45e0a] to-[#E26E12]" },
  { name: "Organisation Intern. de la Francophonie", abbr: "OIF", grad: "from-[#00669b] to-[#004e8c]" },
  { name: "UNICEF Niger",           abbr: "UNI",     grad: "from-[#006bb6] to-[#1cabe2]" },
  { name: "Agence Française de Développement", abbr: "AFD", grad: "from-[#e30614] to-[#a8000e]" },
  { name: "GIZ Niger",              abbr: "GIZ",     grad: "from-[#007a3d] to-[#005a2e]" },
  { name: "USAID Niger",            abbr: "USA",     grad: "from-[#003087] to-[#bf0a30]" },
  { name: "Maisons des Jeunes",     abbr: "MDJ",     grad: "from-[#035740] to-[#046a50]" },
];

/* ─── Single partner card ─── */
function PartnerCard({ name, abbr, grad }: { name: string; abbr: string; grad: string }) {
  return (
    <div className="group flex shrink-0 items-center gap-3 rounded-2xl border border-border/70 bg-white px-5 py-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
      {/* Avatar */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-xs font-black text-white shadow-sm transition-transform duration-300 group-hover:scale-105`}
      >
        {abbr}
      </div>
      {/* Name */}
      <span className="whitespace-nowrap text-sm font-semibold text-muted-foreground transition-colors duration-200 group-hover:text-primary">
        {name}
      </span>
    </div>
  );
}

/* ─── Marquee row wrapper ─── */
function MarqueeRow({
  items,
  direction = "left",
  speed = 40,
}: {
  items: typeof row1;
  direction?: "left" | "right";
  speed?: number;
}) {
  const loop = [...items, ...items];
  const animClass =
    direction === "left"
      ? "animate-[marquee-left_var(--speed)_linear_infinite]"
      : "animate-[marquee-right_var(--speed)_linear_infinite]";

  return (
    <div
      className="group relative overflow-hidden"
      style={{ "--speed": `${speed}s` } as React.CSSProperties}
    >
      {/* Side fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-muted/50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-muted/50 to-transparent" />

      <div
        className={`flex gap-4 ${animClass} group-hover:[animation-play-state:paused]`}
      >
        {loop.map((p, i) => (
          <PartnerCard key={`${p.abbr}-${i}`} {...p} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main section ─── */
export function PartnersSection() {
  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-muted/30 py-14 lg:py-20">
      {/* Soft glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Partenaires
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            Ils nous font confiance
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Youth Connekt Niger est soutenu par des acteurs nationaux et
            internationaux engagés pour la jeunesse.
          </p>
        </motion.div>

        {/* Double marquee */}
        <div className="space-y-4">
          <MarqueeRow items={row1} direction="left"  speed={45} />
          <MarqueeRow items={row2} direction="right" speed={38} />
        </div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-center"
        >
          {[
            { value: "14+", label: "Partenaires actifs" },
            { value: "5",   label: "Organisations internationales" },
            { value: "3",   label: "Ministères impliqués" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2.5">
              <span className="text-lg font-black text-primary">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <span className="h-4 w-px bg-border last:hidden" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Keyframes injected globally */}
      <style jsx global>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
