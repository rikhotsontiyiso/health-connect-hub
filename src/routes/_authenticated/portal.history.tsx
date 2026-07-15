import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { HeartPulse } from "lucide-react";
import { getMyProfile } from "@/lib/profiles.functions";
import { listMyVisitNotes, listMyPrescriptions } from "@/lib/clinical.functions";
import { doctors } from "@/lib/clinic";

export const Route = createFileRoute("/_authenticated/portal/history")({
  component: History,
});

type Visit = {
  id: string;
  symptoms: string | null;
  diagnosis: string | null;
  treatment: string | null;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  appointments: { reference: string | null; appointment_date: string; service: string; doctor_id: string } | null;
};

function History() {
  const profFn = useServerFn(getMyProfile);
  const visitsFn = useServerFn(listMyVisitNotes);
  const rxFn = useServerFn(listMyPrescriptions);

  const profile = useQuery({ queryKey: ["profile", "mine"], queryFn: profFn as never }) as {
    data?: { allergies: string | null; chronic_conditions: string | null; blood_group: string | null } | null;
  };
  const visits = useQuery({ queryKey: ["visits", "mine"], queryFn: visitsFn as never }) as { data?: Visit[] };
  const rx = useQuery({ queryKey: ["rx", "mine"], queryFn: rxFn as never }) as {
    data?: Array<{ id: string; medication: string; dosage: string | null; issued_at: string }>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Medical history</h1>
        <p className="text-sm text-muted-foreground">Everything your care team has recorded for you.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Info label="Blood group" value={profile.data?.blood_group || "—"} />
        <Info label="Allergies" value={profile.data?.allergies || "None recorded"} />
        <Info label="Chronic conditions" value={profile.data?.chronic_conditions || "None recorded"} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 font-display font-bold"><HeartPulse className="h-4 w-4 text-primary" /> Past visits</h2>
        {(visits.data ?? []).length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No visit records yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {(visits.data ?? []).map((v) => {
              const doc = doctors.find((d) => d.id === v.appointments?.doctor_id);
              return (
                <li key={v.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">{v.appointments?.service ?? "Visit"}</p>
                    <p className="text-xs text-muted-foreground">{v.appointments?.appointment_date} · {doc?.name ?? ""}{v.appointments?.reference ? ` · ${v.appointments.reference}` : ""}</p>
                  </div>
                  <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
                    {v.symptoms && <div><dt className="text-xs uppercase text-muted-foreground">Symptoms</dt><dd>{v.symptoms}</dd></div>}
                    {v.diagnosis && <div><dt className="text-xs uppercase text-muted-foreground">Diagnosis</dt><dd>{v.diagnosis}</dd></div>}
                    {v.treatment && <div><dt className="text-xs uppercase text-muted-foreground">Treatment</dt><dd>{v.treatment}</dd></div>}
                    {v.follow_up_date && <div><dt className="text-xs uppercase text-muted-foreground">Follow-up</dt><dd>{v.follow_up_date}</dd></div>}
                    {v.notes && <div className="sm:col-span-2"><dt className="text-xs uppercase text-muted-foreground">Notes</dt><dd>{v.notes}</dd></div>}
                  </dl>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display font-bold">Current & past prescriptions</h2>
        {(rx.data ?? []).length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No prescriptions yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border text-sm">
            {(rx.data ?? []).map((r) => (
              <li key={r.id} className="py-3 flex justify-between gap-4">
                <div>
                  <p className="font-medium">{r.medication}</p>
                  <p className="text-xs text-muted-foreground">{r.dosage ?? "—"}</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(r.issued_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
