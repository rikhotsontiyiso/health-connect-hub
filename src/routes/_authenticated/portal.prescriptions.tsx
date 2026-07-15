import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Pill } from "lucide-react";
import { listMyPrescriptions } from "@/lib/clinical.functions";
import { doctors } from "@/lib/clinic";

export const Route = createFileRoute("/_authenticated/portal/prescriptions")({
  component: Prescriptions,
});

type Rx = {
  id: string;
  medication: string;
  dosage: string | null;
  instructions: string | null;
  issued_at: string;
  appointments: { reference: string | null; appointment_date: string; doctor_id: string } | null;
};

function Prescriptions() {
  const fn = useServerFn(listMyPrescriptions);
  const { data = [] } = useQuery({ queryKey: ["rx", "mine"], queryFn: fn as never }) as { data?: Rx[] };
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">My prescriptions</h1>
      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          <Pill className="mx-auto h-8 w-8 opacity-50" />
          <p className="mt-2">No prescriptions yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.map((r) => {
            const doc = doctors.find((d) => d.id === r.appointments?.doctor_id);
            return (
              <li key={r.id} className="rounded-xl border border-border bg-surface p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-display font-bold">{r.medication}</p>
                  <p className="text-xs text-muted-foreground">Issued {new Date(r.issued_at).toLocaleDateString()}{doc ? ` · ${doc.name}` : ""}</p>
                </div>
                {r.dosage && <p className="mt-1 text-sm"><strong>Dosage:</strong> {r.dosage}</p>}
                {r.instructions && <p className="mt-1 text-sm text-muted-foreground">{r.instructions}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
