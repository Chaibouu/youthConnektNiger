"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactSection() {
  return (
    <section className="py-16 lg:py-24" id="contact">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 1 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            Contact
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Une question ou un projet ? Écrivez-nous ou rendez-nous visite.
          </p>
        </motion.div>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.form
            initial={{ x: -20, opacity: 1 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
            action="/api/contact"
            method="post"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" name="name" placeholder="Votre nom" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.org"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Objet de votre message"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Votre message..."
                required
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Envoyer le message
            </Button>
          </motion.form>
          <motion.div
            initial={{ x: 20, opacity: 1 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="font-semibold text-primary">Bureau Youth Connekt Niger</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-muted-foreground">Niamey, Niger</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:contact@youthconnektniger.org"
                    className="text-muted-foreground hover:underline"
                  >
                    contact@youthconnektniger.org
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <a
                    href="tel:+22712345678"
                    className="text-muted-foreground hover:underline"
                  >
                    +227 12 34 56 78
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
