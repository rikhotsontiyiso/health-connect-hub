import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/SiteShell";
import { clinic } from "@/lib/clinic";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Ubuntu Family Healthcare Clinic" },
      { name: "description", content: "Get in touch with Ubuntu Family Healthcare Clinic in Arcadia, Pretoria. Phone, WhatsApp, email or visit us in person." },
      { property: "og:title", content: "Contact Ubuntu Family Healthcare Clinic" },
      { property: "og:description", content: "Reach out by phone, WhatsApp, email — or use our contact form." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero eyebrow="Contact us" title="We'd love to hear from you" description="Questions, feedback, or need help booking? Our team is standing by." />

      <section className="mx-auto max-w-7xl px-4 py-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard icon={<Phone className="h-5 w-5" />} title="Phone">
              <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="hover:text-primary">{clinic.phone}</a>
            </InfoCard>
            <InfoCard icon={<MessageCircle className="h-5 w-5" />} title="WhatsApp">
              <a href={`https://wa.me/${clinic.whatsapp.replace(/\D/g, "")}`} className="hover:text-primary">{clinic.whatsapp}</a>
            </InfoCard>
            <InfoCard icon={<Mail className="h-5 w-5" />} title="Email">
              <a href={`mailto:${clinic.email}`} className="hover:text-primary">{clinic.email}</a>
            </InfoCard>
            <InfoCard icon={<MapPin className="h-5 w-5" />} title="Address">
              {clinic.address}
            </InfoCard>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
            <h3 className="flex items-center gap-2 font-display font-bold"><Clock className="h-4 w-4 text-primary" /> Opening Hours</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {clinic.hours.map((h) => (
                <li key={h.day} className="flex justify-between border-b border-border/60 pb-2 last:border-0">
                  <span className="text-muted-foreground">{h.day}</span>
                  <span className="font-medium">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Clinic location"
              src="https://www.google.com/maps?q=Nelson+Mandela+Drive,+Arcadia,+Pretoria&output=embed"
              className="h-72 w-full"
              loading="lazy"
            />
          </div>

          <a
            href={`https://wa.me/${clinic.whatsapp.replace(/\D/g, "")}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow hover:brightness-105"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="h-fit rounded-2xl border border-border bg-surface p-6 md:p-8 space-y-4"
        >
          <h2 className="font-display text-xl font-bold">Send us a message</h2>
          {sent ? (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
              <p className="mt-3 font-semibold">Message sent</p>
              <p className="text-sm text-muted-foreground">We'll get back to you within one working day.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder="Full name" className={inputCls} />
                <input required type="email" placeholder="Email" className={inputCls} />
              </div>
              <input placeholder="Phone (optional)" className={inputCls} />
              <input required placeholder="Subject" className={inputCls} />
              <textarea required rows={5} placeholder="How can we help?" className={inputCls} />
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-dark transition">
                Send message <Send className="h-4 w-4" />
              </button>
            </>
          )}
        </form>
      </section>
    </>
  );
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
