import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { CheckCircle2, Phone, Ambulance, Clock, MapPin, Star, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-clinic.jpg";
import { clinic, services, doctors, testimonials, blogPosts } from "@/lib/clinic";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ubuntu Family Healthcare Clinic — Quality Care in Pretoria" },
      { name: "description", content: "Book appointments online with trusted doctors in Arcadia, Pretoria. Family medicine, women's & children's health, vaccinations and chronic care." },
    ],
  }),
  component: Home,
});

const whyUs = [
  "Experienced Healthcare Professionals",
  "Same-Day Appointments",
  "Modern Medical Facilities",
  "Comprehensive Primary Healthcare",
  "Friendly Medical Staff",
  "Affordable Healthcare",
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Now accepting new patients
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Quality Healthcare <span className="text-primary">You Can Trust</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Providing compassionate, affordable, and professional healthcare services for individuals and families in Pretoria and the surrounding communities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/appointments" className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-md hover:brightness-105 transition">
                Book an Appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition">
                Our Services
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[["10+", "Years serving Pretoria"], ["3", "Trusted doctors"], ["12+", "Services offered"]].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl font-bold text-primary">{n}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl" aria-hidden />
            <img
              src={heroImg}
              alt="Friendly doctor consulting with a patient at Ubuntu Family Healthcare Clinic"
              width={1600}
              height={1100}
              className="relative rounded-3xl object-cover shadow-2xl aspect-[4/3] w-full"
            />
            <div className="absolute -bottom-6 left-6 rounded-2xl bg-surface p-4 shadow-lg border border-border max-w-[240px]">
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-accent">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Same-day visits</p>
                  <p className="text-xs text-muted-foreground">Mon–Sat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency strip */}
      <section className="border-b border-border bg-[oklch(0.97_0.03_25)]/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emergency/10 text-emergency"><Phone className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-semibold uppercase text-emergency">Emergency Contact</p>
              <a href={`tel:${clinic.emergency.replace(/\s/g, "")}`} className="text-lg font-bold text-foreground hover:underline">{clinic.emergency}</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Clock className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Emergency Hours</p>
              <p className="text-lg font-bold">24/7 Emergency Line</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 text-accent"><Ambulance className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-semibold uppercase text-accent">Ambulance</p>
              <p className="text-lg font-bold">Netcare 911 · ER24</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Why choose us</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Care that puts your family first</h2>
            <p className="mt-4 text-muted-foreground">
              From your first visit to lifelong wellness, our team blends clinical excellence with the warmth of an Ubuntu community — because every patient deserves to be seen, heard, and understood.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {whyUs.map((w) => (
              <li key={w} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm font-medium">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Our services</p>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Comprehensive primary care</h2>
            </div>
            <Link to="/services" className="text-sm font-semibold text-primary hover:underline">View all services →</Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 8).map((s) => {
              const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon] ?? Icons.Stethoscope;
              return (
                <div key={s.title} className="group rounded-2xl border border-border bg-background p-6 transition hover:border-primary hover:shadow-md">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Meet our doctors</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Trusted, experienced clinicians</h2>
          </div>
          <Link to="/doctors" className="text-sm font-semibold text-primary hover:underline">See all doctors →</Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <div key={d.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img src={d.image} alt={d.name} width={800} height={900} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold">{d.name}</h3>
                <p className="text-sm text-primary font-medium">{d.specialty}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d.qualifications} · {d.experience}</p>
                <Link to="/appointments" className="mt-4 inline-flex text-sm font-semibold text-accent hover:underline">
                  Book with {d.name.split(" ")[1]} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">Patient testimonials</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Loved by families across Pretoria</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed">"{t.text}"</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">— {t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Latest health news</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Advice from our doctors</h2>
          </div>
          <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">Visit the blog →</Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((p) => (
            <article key={p.slug} className="rounded-2xl border border-border bg-surface p-6 hover:shadow-md transition">
              <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">{p.category}</span>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">{p.date} · {p.author}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Contact strip */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold">Visit our clinic</h2>
            <p className="mt-2 text-muted-foreground max-w-lg">
              We're centrally located in Arcadia, Pretoria. Walk-ins welcome — but booking online means less time in the waiting room.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3"><MapPin className="h-5 w-5 text-primary shrink-0" /><span>{clinic.address}</span></li>
              <li className="flex gap-3"><Phone className="h-5 w-5 text-primary shrink-0" /><span>{clinic.phone}</span></li>
              <li className="flex gap-3"><Clock className="h-5 w-5 text-primary shrink-0" /><span>Mon–Fri 08:00–18:00 · Sat 08:00–13:00</span></li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 text-center">
            <h3 className="font-display text-xl font-bold">Ready to book?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Choose your doctor, date and time in under 2 minutes.</p>
            <Link to="/appointments" className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-md hover:brightness-105 transition">
              Book Appointment <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
