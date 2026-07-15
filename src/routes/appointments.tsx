import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, CalendarDays, CreditCard, ShieldCheck, ArrowRight, LogIn, Landmark, AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/site/SiteShell";
import { StatusBadge } from "@/components/site/StatusBadge";
import { services, doctors, clinic } from "@/lib/clinic";
import { useAuth } from "@/hooks/use-auth";
import { createAppointment } from "@/lib/appointments.functions";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — Ubuntu Family Healthcare Clinic" },
      { name: "description", content: "Book your appointment online in minutes. Choose your doctor, date, time and pay securely." },
      { property: "og:title", content: "Book an Appointment Online" },
      { property: "og:description", content: "Choose your doctor, date and time — get instant email confirmation." },
    ],
  }),
  component: Appointments,
});

const TIMES = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

type Form = {
  firstName: string; lastName: string; email: string; phone: string;
  dob: string; gender: string; service: string; doctor: string;
  date: string; time: string; reason: string; medicalAid: string;
  payment: string; notes: string; agree: boolean;
};

const empty: Form = {
  firstName: "", lastName: "", email: "", phone: "", dob: "", gender: "",
  service: "", doctor: "", date: "", time: "", reason: "", medicalAid: "",
  payment: "card", notes: "", agree: false,
};

function Appointments() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const createFn = useServerFn(createAppointment);
  const [form, setForm] = useState<Form>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agree) return;
    setBusy(true);
    setError(null);
    try {
      const row = (await createFn({
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          dob: form.dob || undefined,
          gender: form.gender || undefined,
          service: form.service,
          doctor: form.doctor,
          date: form.date,
          time: form.time,
          reason: form.reason || undefined,
          medicalAid: form.medicalAid || undefined,
          notes: form.notes || undefined,
        },
      })) as { id: string };
      setRef(row.id.slice(0, 8).toUpperCase());
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book appointment");
    } finally {
      setBusy(false);
    }
  }

  if (!loading && !user) {
    return (
      <>
        <PageHero eyebrow="Appointments" title="Sign in to book" description="Create a free account or sign in to book and manage your appointments." />
        <section className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <LogIn className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">You need an account to book online so you can view your upcoming and past appointments.</p>
            <button
              onClick={() => navigate({ to: "/auth", search: { redirect: "/appointments" } })}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Sign in or create account <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <PageHero eyebrow="Booking confirmed" title="Thank you — your appointment is booked" description="A confirmation email is on its way with your booking reference and clinic details." />
        <section className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Booking reference</p>
                <p className="font-display text-2xl font-bold">{ref}</p>
              </div>
              <div className="ml-auto"><StatusBadge status="pending" /></div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Your appointment is <strong>Pending</strong>. A receptionist will confirm shortly. You'll be notified by email.</p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2 text-sm">
              <Row label="Patient" value={`${form.firstName} ${form.lastName}`} />
              <Row label="Doctor" value={doctors.find(d => d.id === form.doctor)?.name ?? form.doctor} />
              <Row label="Service" value={form.service} />
              <Row label="Date" value={form.date} />
              <Row label="Time" value={form.time} />
              <Row label="Payment" value={form.payment === "clinic" ? "Pay at clinic" : "Card / Online"} />
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/portal/appointments" className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
                View my appointments
              </Link>
              <button onClick={() => { setSubmitted(false); setForm(empty); }} className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold hover:border-primary">
                Book another
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Appointments" title="Book your visit online" description="Choose your doctor, date and time. You'll receive an email confirmation immediately." />

      <section className="mx-auto max-w-7xl px-4 py-16 grid gap-10 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className="rounded-2xl border border-border bg-surface p-6 md:p-8 space-y-8">
          <Fieldset title="Patient details" icon={<CalendarDays className="h-5 w-5" />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required><input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputCls} /></Field>
              <Field label="Surname" required><input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputCls} /></Field>
              <Field label="Email address" required><input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} /></Field>
              <Field label="Phone number" required><input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} /></Field>
              <Field label="Date of birth"><input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} className={inputCls} /></Field>
              <Field label="Gender">
                <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className={inputCls}>
                  <option value="">Prefer not to say</option>
                  <option>Female</option><option>Male</option><option>Other</option>
                </select>
              </Field>
            </div>
          </Fieldset>

          <Fieldset title="Appointment details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Service required" required>
                <select required value={form.service} onChange={(e) => update("service", e.target.value)} className={inputCls}>
                  <option value="">Select a service</option>
                  {services.map((s) => <option key={s.title}>{s.title}</option>)}
                </select>
              </Field>
              <Field label="Doctor" required>
                <select required value={form.doctor} onChange={(e) => update("doctor", e.target.value)} className={inputCls}>
                  <option value="">Select a doctor</option>
                  {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
                </select>
              </Field>
              <Field label="Preferred date" required>
                <input required type="date" min={today} value={form.date} onChange={(e) => update("date", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Preferred time" required>
                <select required value={form.time} onChange={(e) => update("time", e.target.value)} className={inputCls}>
                  <option value="">Select a time slot</option>
                  {TIMES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Reason for visit" className="sm:col-span-2">
                <textarea rows={3} value={form.reason} onChange={(e) => update("reason", e.target.value)} className={inputCls} placeholder="Briefly describe your symptoms or reason for the visit" />
              </Field>
              <Field label="Medical aid (optional)"><input value={form.medicalAid} onChange={(e) => update("medicalAid", e.target.value)} className={inputCls} placeholder="e.g. Discovery Health — 1234567890" /></Field>
              <Field label="Special notes (optional)"><input value={form.notes} onChange={(e) => update("notes", e.target.value)} className={inputCls} /></Field>
            </div>
          </Fieldset>

          <Fieldset title="Payment method" icon={<CreditCard className="h-5 w-5" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["card", "Credit / Debit Card"],
                ["eft", "Instant EFT"],
                ["wallet", "Mobile Wallet"],
                ["clinic", "Pay at Clinic"],
              ].map(([v, l]) => (
                <label key={v} className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition ${form.payment === v ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"}`}>
                  <input type="radio" name="payment" value={v} checked={form.payment === v} onChange={(e) => update("payment", e.target.value)} className="accent-[oklch(0.56_0.16_253)]" />
                  <span className="text-sm font-medium">{l}</span>
                </label>
              ))}
            </div>
          </Fieldset>

          <div className="rounded-xl border border-border bg-background p-5">
            <h3 className="font-display font-semibold">Terms &amp; Conditions</h3>
            <ul className="mt-3 text-xs text-muted-foreground list-disc pl-4 space-y-1">
              <li>Please arrive on time. Late arrivals over 15 minutes may require rescheduling.</li>
              <li>Cancel or reschedule at least 24 hours before your appointment.</li>
              <li>Missed appointments may be rebooked once at no extra booking fee.</li>
              <li>Repeated no-shows may require a new booking fee before confirmation.</li>
              <li>Online payments are subject to our refund policy.</li>
            </ul>
            <label className="mt-4 flex items-start gap-3">
              <input type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} className="mt-1 h-4 w-4 accent-[oklch(0.56_0.16_253)]" required />
              <span className="text-sm">I have read and agree to the <a href="#" className="text-primary underline">Terms and Conditions</a>.</span>
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={!form.agree || busy} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-md hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {busy ? "Booking…" : <>Confirm booking <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-display font-bold">What to expect</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                "Instant email confirmation with reference number",
                "Reminder SMS 24 hours before your visit",
                "Secure online payment (or pay at the clinic)",
                "Easy reschedule up to 24 hours before",
              ].map((t) => (
                <li key={t} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span>{t}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display font-bold">Your information is safe</h3>
            <p className="mt-2 text-sm text-muted-foreground">All patient data is stored securely and never shared with third parties without your consent.</p>
          </div>
        </aside>
      </section>
    </>
  );
}

const inputCls = "w-full rounded-lg border border-input bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

function Field({ label, required, children, className = "" }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium">{label}{required && <span className="text-destructive"> *</span>}</span>
      {children}
    </label>
  );
}

function Fieldset({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
        {icon && <span className="text-primary">{icon}</span>} {title}
      </h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface p-3 border border-border">
      <dt className="text-xs uppercase text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value || "—"}</dd>
    </div>
  );
}
