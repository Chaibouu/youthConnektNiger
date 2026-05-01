"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const temoignages = [
  {
    quote:
      "Youth Connekt Niger m'a permis de suivre une formation en entrepreneuriat et d'obtenir un premier financement pour mon projet. Aujourd'hui mon entreprise emploie 5 personnes.",
    author: "Amina M.",
    role: "Entrepreneure, Niamey",
  },
  {
    quote:
      "Grâce au programme d'emploi, j'ai trouvé un stage puis un CDI dans le secteur du numérique. Une vraie opportunité pour ma carrière.",
    author: "Ibrahim S.",
    role: "Développeur, Zinder",
  },
  {
    quote:
      "L'accompagnement en citoyenneté m'a donné les outils pour monter des actions dans ma commune. Je suis fier de contribuer au développement de ma région.",
    author: "Fatouma H.",
    role: "Volontaire, Maradi",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 1 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            Ce que disent nos jeunes et partenaires
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Témoignages de bénéficiaires et partenaires de Youth Connekt Niger.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {temoignages.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ y: 20, opacity: 1 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <Quote className="h-10 w-10 text-primary/30" />
                  <p className="mt-4 text-muted-foreground italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-4 font-semibold text-primary">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
