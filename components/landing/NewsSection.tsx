"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

export function NewsSection({ posts }: NewsSectionProps) {
  if (posts.length === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ y: 24, opacity: 0.9 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight text-primary lg:text-4xl text-center mb-8"
          >
            Actualités
          </motion.h2>
          <p className="text-center text-muted-foreground">
            Aucun article pour le moment. Revenez bientôt !
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ y: 24, opacity: 0.9 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
              Actualités
            </h2>
            <p className="mt-2 text-muted-foreground">
              Les derniers articles et actualités de Youth Connekt Niger.
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Voir toutes les actualités
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ y: 20, opacity: 0.9, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
            >
              <Link href={`/news/${post.blog.slug}/${post.slug}`}>
                <Card className="h-full transition hover:shadow-lg">
                  <CardHeader className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.blog.title}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-primary line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt || "Lire l'article..."}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
