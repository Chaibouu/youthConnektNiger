"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
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
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & description */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="relative flex h-10 w-10 overflow-hidden rounded-full bg-white ring-2 ring-white">
                <Image
                  src={appConfig.logoUrl}
                  alt={appConfig.appName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </span>
              <span className="font-semibold">{appConfig.appName}</span>
            </Link>
            <p className="text-sm opacity-90">
              Connecter la jeunesse nigérienne aux opportunités d&apos;emploi,
              d&apos;entrepreneuriat et d&apos;engagement citoyen.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full p-2 transition hover:bg-white/20"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="mb-4 font-semibold">Liens rapides</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm opacity-90 transition hover:opacity-100 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">Contact</h3>
            <address className="not-italic text-sm opacity-90">
              <p>Niamey, Niger</p>
              <a
                href="mailto:contact@youthconnektniger.org"
                className="block mt-1 hover:underline"
              >
                contact@youthconnektniger.org
              </a>
              <a href="tel:+22712345678" className="block mt-1 hover:underline">
                +227 12 34 56 78
              </a>
            </address>
          </div>

          {/* Newsletter placeholder */}
          <div>
            <h3 className="mb-4 font-semibold">Restez informé</h3>
            <p className="text-sm opacity-90">
              Inscrivez-vous pour recevoir nos actualités et opportunités.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm opacity-80">
          <p>
            © {new Date().getFullYear()} {appConfig.appName}. Tous droits
            réservés.
          </p>
          <p className="mt-1">
            <Link href="/mentions-legales" className="hover:underline">
              Mentions légales
            </Link>
            {" · "}
            <Link href="/confidentialite" className="hover:underline">
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
