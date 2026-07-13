import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, GraduationCap, Clock } from "lucide-react";
import { PageHero } from "@/components/site/SiteShell";
import { doctors } from "@/lib/clinic";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Our Doctors — Ubuntu Family Healthcare Clinic" },
      { name: "description", content: "Meet our team of experienced doctors serving Pretoria families with dedication and expertise." },
      { property: "og:title", content: "Meet Our Doctors" },
      { property: "og:description", content: "Family medicine, general practice, and women's health specialists in Arcadia, Pretoria." },
    ],
  }),
  component: Doctors,
});

function Doctors() {
  return (
    <>
      <PageHero eyebrow="Our doctors" title="Experienced clinicians who care" description="Our doctors bring decades of combined experience across family medicine, general practice and women's health." />
      <section className="mx-auto max-w-7xl px-4 py-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d) => (
          <article key={d.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img src={d.image} alt={d.name} width={800} height={900} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h2 className="font-display text-xl font-bold">{d.name}</h2>
              <p className="text-sm font-semibold text-primary">{d.specialty}</p>
              <p className="mt-3 text-sm text-muted-foreground">{d.bio}</p>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="h-4 w-4 text-primary" /> {d.qualifications}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-primary" /> {d.experience}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 text-primary" /> {d.days}</div>
              </dl>
              <Link to="/appointments" className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:brightness-105 transition">
                Book with {d.name.split(" ")[1]}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
