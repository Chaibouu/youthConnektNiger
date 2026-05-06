"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PostPreview {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  publishedAt: Date | null;
  blog: { id: string; title: string; slug: string };
}

interface NewsSectionProps {
  posts: PostPreview[];
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Génère une couleur de bande en fonction du slug de la catégorie */
function categoryGradient(slug: string) {
  const map: Record<string, string> = {
    actualites: "from-primary/80 to-primary/50",
    emploi:     "from-[#024a36] to-[#035740]",
    startup:    "from-secondary/80 to-secondary/50",
    education:  "from-[#046a50] to-[#035740]",
    evenement:  "from-secondary to-[#c45e0a]",
  };
  const key = Object.keys(map).find((k) => slug.toLowerCase().includes(k));
  return key ? map[key] : "from-primary/70 to-[#046a50]";
}

/* ─── Carte principale (featured) ─── */
function FeaturedCard({ post }: { post: PostPreview }) {
  const grad = categoryGradient(post.blog.slug);
  return (
    <Link
      href={`/news/${post.blog.slug}/${post.slug}`}
      className="group block h-full cursor-pointer"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-white shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl flex flex-col">
        {/* Bande image / gradient */}
        <div className={`relative h-52 w-full overflow-hidden bg-gradient-to-br ${grad} lg:h-64`}>
          {/* Motif */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* Orbe */}
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          {/* Badge catégorie */}
          <div className="absolute left-4 top-4">
            <Badge className="bg-white text-primary font-semibold shadow-sm">
              {post.blog.title}
            </Badge>
          </div>
          {/* Icône centrée */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Newspaper className="h-16 w-16 text-white/15" />
          </div>
          {/* Gradient bas → vers le contenu */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Contenu */}
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt)}
          </div>
          <h3 className="text-lg font-bold leading-snug text-primary line-clamp-2 transition-colors group-hover:text-secondary">
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 flex-1">
            {post.excerpt ?? "Découvrir l'article complet..."}
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary transition-all duration-200 group-hover:gap-2.5">
            Lire la suite
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Carte secondaire (compacte) ─── */
function CompactCard({ post }: { post: PostPreview }) {
  const grad = categoryGradient(post.blog.slug);
  return (
    <Link
      href={`/news/${post.blog.slug}/${post.slug}`}
      className="group flex h-full cursor-pointer gap-4 overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Miniature colorée */}
      <div className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${grad}`}>
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
        <Newspaper className="absolute inset-0 m-auto h-7 w-7 text-white/30" />
      </div>

      {/* Texte */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-secondary/30 text-secondary text-[10px] px-2 py-0.5">
              {post.blog.title}
            </Badge>
          </div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-primary transition-colors group-hover:text-secondary">
            {post.title}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-secondary transition-all group-hover:gap-1.5">
            Lire
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── État vide ─── */
function EmptyState() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Newspaper className="h-10 w-10 text-primary/40" />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">
            Actualités
          </p>
          <h2 className="text-2xl font-bold text-primary">Bientôt en ligne</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Aucun article pour le moment. Revenez bientôt pour suivre nos
            actualités et opportunités !
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Composant principal ─── */
export function NewsSection({ posts }: NewsSectionProps) {
  if (posts.length === 0) return <EmptyState />;

  const [featured, ...rest] = posts;

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">

        {/* ── En-tête ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Actualités
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
              Dernières nouvelles
            </h2>
            <p className="mt-2 text-muted-foreground">
              Suivez nos actualités, événements et opportunités.
            </p>
          </div>
          <Link
            href="/news"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-secondary transition-all hover:gap-2.5"
          >
            Voir toutes les actualités
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* ── Layout éditorial ── */}
        {posts.length === 1 ? (
          /* Un seul article : pleine largeur */
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto"
          >
            <FeaturedCard post={featured} />
          </motion.div>
        ) : (
          /* 2+ articles : featured + grille compacte */
          <div className="grid gap-5 lg:grid-cols-5">
            {/* Carte principale : 2/5 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-2"
            >
              <FeaturedCard post={featured} />
            </motion.div>

            {/* Cartes secondaires : 3/5 */}
            <div className="flex flex-col gap-4 lg:col-span-3">
              {rest.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ x: 16, opacity: 0 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: (i + 1) * 0.08 }}
                >
                  <CompactCard post={post} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
