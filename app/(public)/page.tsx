import { getBlogPostsAction } from "@/actions/blog-actions";
import { HeroSection } from "@/components/landing/HeroSection";
import { HighlightsSection } from "@/components/landing/HighlightsSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ProgrammesSection } from "@/components/landing/ProgrammesSection";
import { ParcoursSection } from "@/components/landing/ParcoursSection";
import { FeaturedEventSection } from "@/components/landing/FeaturedEventSection";
import { NewsSection } from "@/components/landing/NewsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { ContactSection } from "@/components/landing/ContactSection";
import type { PostPreview } from "@/components/landing/NewsSection";

async function getLatestPosts(): Promise<PostPreview[]> {
  const result = await getBlogPostsAction(
    new URLSearchParams({
      limit: "3",
      isPublished: "true",
      sortBy: "publishedAt",
      sortOrder: "desc",
    })
  );
  const paginated = result?.data as { data?: PostPreview[] } | undefined;
  const list = paginated?.data;
  if (!list || !Array.isArray(list)) return [];
  return list.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    slug: p.slug,
    publishedAt: p.publishedAt,
    blog: p.blog,
  }));
}

export default async function HomePage() {
  const posts = await getLatestPosts();

  return (
    <>
      <HeroSection />
      <HighlightsSection />
      <StatsSection />
      <AboutSection />
      <ProgrammesSection />
      <ParcoursSection />
      <FeaturedEventSection />
      <NewsSection posts={posts} />
      <TestimonialsSection />
      <PartnersSection />
      <ContactSection />
    </>
  );
}
