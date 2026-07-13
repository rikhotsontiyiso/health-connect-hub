import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, HeartHandshake, Award, ShieldCheck, Users, Stethoscope } from "lucide-react";
import { PageHero } from "@/components/site/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Ubuntu Family Healthcare Clinic" },
      { name: "description", content: "Our story, mission, and team. Learn how Ubuntu Family Healthcare Clinic serves Pretoria with compassionate, professional care." },
      { property: "og:title", content: "About Ubuntu Family Healthcare Clinic" },
      { property: "og:description", content: "Compassionate, professional healthcare rooted in the values of Ubuntu." },
    ],
  }),
  component: About,
});

const values = [
  { icon: ShieldCheck, title: "Integrity", desc: "Honest, transparent care in every consultation." },
  { icon: HeartHandshake, title: "Compassion", desc: "We treat each patient like family." },
  { icon: Award, title: "Professionalism", desc: "Evidence-based medicine delivered with skill." },
  { icon: Sparkles, title: "Innovation", desc: "Modern tools and continuous learning." },
  { icon: Users, title: "Respect", desc: "Dignity and privacy for every patient." },
  { icon: Stethoscope, title: "Excellence", desc: "High standards in everything we do." },
];

function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Rooted in Ubuntu, dedicated to your health" description="Ubuntu Family Healthcare Clinic has served the Arcadia community and surrounding Pretoria neighbourhoods for over a decade — combining modern medicine with the warmth of community care." />

      <section className="mx-auto max-w-7xl px-4 py-16 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold">Our Story</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Founded on the belief that quality healthcare should be accessible to every family, Ubuntu Family Healthcare Clinic opened its doors with a small team of dedicated doctors. Today we serve thousands of patients each year across all life stages — from newborn check-ups to chronic disease management for grandparents.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We're deeply involved in community wellness — running vaccination drives, HIV awareness campaigns, and free health screenings in partnership with local schools and churches.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-display text-xl font-bold text-primary">Our Mission</h3>
            <p className="mt-2 text-muted-foreground">To provide quality healthcare services to every patient — with compassion, respect and clinical excellence.</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-display text-xl font-bold text-accent">Our Vision</h3>
            <p className="mt-2 text-muted-foreground">To become one of the leading healthcare providers in South Africa through compassionate, affordable and innovative medical care.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Core values</p>
            <h2 className="mt-2 font-display text-3xl font-bold">What we stand for</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-background p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent"><v.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-display text-2xl font-bold">Our Team</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">Our multidisciplinary team works together to deliver seamless care from reception to consultation to follow-up.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Doctors", "3 practising physicians"],
            ["Nursing Staff", "Registered nurses on duty"],
            ["Reception", "Friendly front-of-house team"],
            ["Laboratory & Pharmacy", "On-site technicians"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-surface p-5">
              <h4 className="font-semibold">{t}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h3 className="font-display text-xl font-bold">Certifications &amp; Registrations</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Department of Health", "HPCSA Registered", "Quality Standards Compliant", "Healthcare Accreditations"].map((c) => (
              <div key={c} className="rounded-xl border border-border bg-background p-5 text-sm font-medium">✓ {c}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
