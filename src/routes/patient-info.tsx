import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, FileDown, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/SiteShell";
import { clinic } from "@/lib/clinic";

export const Route = createFileRoute("/patient-info")({
  head: () => ({
    meta: [
      { title: "Patient Information — Ubuntu Family Healthcare Clinic" },
      { name: "description", content: "FAQs, payment options, medical aids, downloadable forms and our privacy policy." },
      { property: "og:title", content: "Patient Information" },
      { property: "og:description", content: "Everything you need before your visit — FAQs, forms, and payment options." },
    ],
  }),
  component: PatientInfo,
});

const faqs = [
  { q: "Do I need an appointment?", a: "Walk-ins are welcome, but booking online guarantees your slot and reduces waiting time." },
  { q: "What should I bring to my first visit?", a: "Bring your ID, medical aid card (if applicable), and any relevant prior medical records or medication lists." },
  { q: "Do you accept medical aid?", a: `Yes — we accept ${clinic.medicalAids.join(", ")}. Self-pay patients are welcome too.` },
  { q: "How do I cancel or reschedule?", a: "You can call, WhatsApp, or email us up to 24 hours before your appointment at no charge." },
  { q: "Is my information kept private?", a: "Absolutely. We follow strict POPIA-compliant data handling and never share your data without consent." },
];

function PatientInfo() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <PageHero eyebrow="Patient information" title="Everything you need before your visit" description="Answers to the most common questions, plus forms and policies for new and returning patients." />

      <section className="mx-auto max-w-7xl px-4 py-16 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="rounded-2xl border border-border bg-surface divide-y divide-border">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                  <span className="font-medium">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition ${open === i ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                </button>
                {open === i && <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-display font-bold">Payment Options</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Credit / Debit Card</li>
              <li>• Instant EFT</li>
              <li>• Mobile Wallet</li>
              <li>• Cash at Clinic</li>
              <li>• Medical Aid Direct-Billing</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-display font-bold">Medical Aids Accepted</h3>
            <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
              {clinic.medicalAids.map((m) => <li key={m}>• {m}</li>)}
            </ul>
          </div>
        </aside>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="font-display text-2xl font-bold">Downloadable Forms</h2>
          <p className="mt-2 text-muted-foreground">Save time by completing these before your visit.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["New Patient Registration Form", "Consent Form", "Medical History Form"].map((n) => (
              <a key={n} href="#" className="flex items-center justify-between rounded-xl border border-border bg-background p-5 hover:border-primary transition">
                <span className="font-medium text-sm">{n}</span>
                <FileDown className="h-5 w-5 text-primary" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h2 className="mt-3 font-display text-2xl font-bold">Privacy Policy</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Ubuntu Family Healthcare Clinic complies with the Protection of Personal Information Act (POPIA). We collect only the information necessary to provide you with quality care. Your data is stored securely, accessed only by authorised medical staff, and never shared with third parties without your explicit consent — except where required by law.
          </p>
        </div>
      </section>
    </>
  );
}
