"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Instagram, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/settings/navigation";
import appConfig from "@/settings";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* ── Logo & description ── */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative flex h-10 w-10 overflow-hidden rounded-full bg-white ring-2 ring-white shadow-md">
                <Image
                  src={appConfig.logoUrl}
                  alt={appConfig.appName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </span>
              <span className="font-semibold text-base">{appConfig.appName}</span>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              Connecter la jeunesse nigérienne aux opportunités d&apos;emploi,
              d&apos;entrepreneuriat et d&apos;engagement citoyen.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-colors duration-200 hover:bg-white/25 cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Liens rapides ── */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest opacity-50">
              Liens rapides
            </h3>
            <ul className="space-y-2.5">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm opacity-80 transition-all duration-150 hover:opacity-100 hover:underline underline-offset-4 cursor-pointer"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest opacity-50">
              Contact
            </h3>
            <address className="not-italic space-y-2.5 text-sm opacity-80">
              <p>Niamey, Niger</p>
              <a
                href="mailto:contact@youthconnektniger.org"
                className="block transition-opacity duration-150 hover:opacity-100 hover:underline underline-offset-4 cursor-pointer"
              >
                contact@youthconnektniger.org
              </a>
              <a
                href="tel:+22712345678"
                className="block transition-opacity duration-150 hover:opacity-100 hover:underline underline-offset-4 cursor-pointer"
              >
                +227 12 34 56 78
              </a>
            </address>
          </div>

          {/* ── Newsletter ── */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest opacity-50">
              Restez informé
            </h3>
            <p className="text-sm opacity-80 mb-4 leading-relaxed">
              Recevez nos actualités, événements et opportunités directement
              dans votre boîte mail.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="votre@email.org"
                className="h-10 flex-1 min-w-0 bg-white/15 border-white/20 text-white placeholder:text-white/45 focus-visible:ring-white/40 text-sm"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="S'abonner"
                className="h-10 w-10 flex-shrink-0 bg-secondary hover:bg-secondary/90 cursor-pointer transition-colors duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 border-t border-white/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm opacity-65">
          <p>
            © {new Date().getFullYear()} {appConfig.appName}. Tous droits réservés.
          </p>
          <div className="flex gap-5">
            <Link
              href="/mentions-legales"
              className="hover:underline underline-offset-4 hover:opacity-100 transition-opacity cursor-pointer"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="hover:underline underline-offset-4 hover:opacity-100 transition-opacity cursor-pointer"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
