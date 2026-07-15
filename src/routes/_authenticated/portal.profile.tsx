import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { getMyProfile, updateMyProfile } from "@/lib/profiles.functions";

export const Route = createFileRoute("/_authenticated/portal/profile")({
  component: ProfilePage,
});

type Form = {
  full_name: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  medical_aid_name: string;
  medical_aid_number: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  allergies: string;
  chronic_conditions: string;
  phone: string;
};

const empty: Form = {
  full_name: "", date_of_birth: "", gender: "", blood_group: "",
  medical_aid_name: "", medical_aid_number: "",
  emergency_contact_name: "", emergency_contact_phone: "",
  allergies: "", chronic_conditions: "", phone: "",
};

function ProfilePage() {
  const getFn = useServerFn(getMyProfile);
  const updateFn = useServerFn(updateMyProfile);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["profile", "mine"], queryFn: getFn as never }) as {
    data?: Partial<Form> | null;
  };
  const [form, setForm] = useState<Form>(empty);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      const next = { ...empty };
      (Object.keys(empty) as (keyof Form)[]).forEach((k) => {
        const v = (data as Record<string, unknown>)[k];
        next[k] = typeof v === "string" ? v : "";
      });
      setForm(next);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: (v: Form) => updateFn({ data: v }) as Promise<unknown>,
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["profile", "mine"] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  function upd<K extends keyof Form>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); save.mutate(form); }}
      className="space-y-6 rounded-2xl border border-border bg-surface p-6 md:p-8"
    >
      <div>
        <h1 className="font-display text-2xl font-bold">My profile</h1>
        <p className="text-sm text-muted-foreground">Personal, medical aid and emergency contact information.</p>
      </div>

      <Section title="Personal">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><input value={form.full_name} onChange={(e) => upd("full_name", e.target.value)} className={cls} /></Field>
          <Field label="Phone"><input value={form.phone} onChange={(e) => upd("phone", e.target.value)} className={cls} /></Field>
          <Field label="Date of birth"><input type="date" value={form.date_of_birth} onChange={(e) => upd("date_of_birth", e.target.value)} className={cls} /></Field>
          <Field label="Gender">
            <select value={form.gender} onChange={(e) => upd("gender", e.target.value)} className={cls}>
              <option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Other</option>
            </select>
          </Field>
          <Field label="Blood group">
            <select value={form.blood_group} onChange={(e) => upd("blood_group", e.target.value)} className={cls}>
              <option value="">Unknown</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Medical aid">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Scheme name"><input value={form.medical_aid_name} onChange={(e) => upd("medical_aid_name", e.target.value)} className={cls} /></Field>
          <Field label="Member number"><input value={form.medical_aid_number} onChange={(e) => upd("medical_aid_number", e.target.value)} className={cls} /></Field>
        </div>
      </Section>

      <Section title="Emergency contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contact name"><input value={form.emergency_contact_name} onChange={(e) => upd("emergency_contact_name", e.target.value)} className={cls} /></Field>
          <Field label="Contact phone"><input value={form.emergency_contact_phone} onChange={(e) => upd("emergency_contact_phone", e.target.value)} className={cls} /></Field>
        </div>
      </Section>

      <Section title="Health notes">
        <div className="grid gap-4">
          <Field label="Allergies"><textarea rows={3} value={form.allergies} onChange={(e) => upd("allergies", e.target.value)} className={cls} placeholder="e.g. Penicillin, peanuts" /></Field>
          <Field label="Chronic conditions"><textarea rows={3} value={form.chronic_conditions} onChange={(e) => upd("chronic_conditions", e.target.value)} className={cls} placeholder="e.g. Hypertension, type 2 diabetes" /></Field>
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={save.isPending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          <Save className="h-4 w-4" /> {save.isPending ? "Saving…" : "Save profile"}
        </button>
        {saved && <span className="inline-flex items-center gap-1 text-sm text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Saved</span>}
      </div>
    </form>
  );
}

const cls = "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <h2 className="font-display font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
