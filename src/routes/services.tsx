import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { PageHero } from "@/components/site/SiteShell";
import { services } from "@/lib/clinic";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Ubuntu Family Healthcare Clinic" },
      { name: "description", content: "General consultations, family medicine, women's & children's health, chronic care, vaccinations, laboratory, pharmacy and more." },
      { property: "og:title", content: "Healthcare Services in Pretoria" },
      { property: "og:description", content: "Comprehensive primary healthcare under one roof at Ubuntu Family Healthcare Clinic." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHero eyebrow="Our services" title="Comprehensive care for every stage of life" description="From newborn immunisations to lifelong chronic care, our services cover the health needs of your whole family." />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon] ?? Icons.Stethoscope;
            return (
              <article key={s.title} className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-primary hover:shadow-md">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold">{s.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-12 rounded-2xl bg-primary text-primary-foreground p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold">Not sure which service you need?</h3>
            <p className="mt-2 text-primary-foreground/80">Speak to our reception — they'll match you with the right doctor.</p>
          </div>
          <Link to="/appointments" className="inline-flex items-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow">
            Book a consultation
          </Link>
        </div>
      </section>
    </>
  );
}
