import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { PageHero } from "@/components/site/SiteShell";
import { StatusBadge } from "@/components/site/StatusBadge";
import { cancelMyAppointment, listMyAppointments } from "@/lib/appointments.functions";
import { doctors } from "@/lib/clinic";

export const Route = createFileRoute("/_authenticated/portal/appointments")({
  head: () => ({
    meta: [
      { title: "My Appointments — Ubuntu Family Healthcare Clinic" },
      { name: "description", content: "View, manage and cancel your appointments." },
    ],
  }),
  component: MyAppointments,
});

const myAppointmentsQueryOptions = (fetcher: () => Promise<unknown>) =>
  queryOptions({
    queryKey: ["appointments", "mine"],
    queryFn: fetcher as never,
  });

type Tab = "upcoming" | "history";

function MyAppointments() {
  const fetcher = useServerFn(listMyAppointments);
  const cancelFn = useServerFn(cancelMyAppointment);
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("upcoming");

  const { data: appts = [], isLoading } = useQuery(myAppointmentsQueryOptions(fetcher as never)) as {
    data: Array<{ id: string; appointment_date: string; appointment_time: string; service: string; doctor_id: string; status: "pending" | "confirmed" | "completed" | "cancelled" }>;
    isLoading: boolean;
  };

  const cancel = useMutation({
    mutationFn: (id: string) => cancelFn({ data: { id } }) as Promise<unknown>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments", "mine"] }),
  });

  const today = new Date().toISOString().split("T")[0];
  const filtered = appts.filter((a) => {
    const isPast = a.appointment_date < today || a.status === "completed" || a.status === "cancelled";
    return tab === "history" ? isPast : !isPast;
  });

  return (
    <>
      <PageHero eyebrow="Patient portal" title="My appointments" description="View your upcoming visits or browse past appointments." />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex rounded-lg border border-border p-1 text-sm font-medium">
            <button onClick={() => setTab("upcoming")} className={`rounded-md px-4 py-2 ${tab === "upcoming" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Upcoming</button>
            <button onClick={() => setTab("history")} className={`rounded-md px-4 py-2 ${tab === "history" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>History</button>
          </div>
          <Link to="/appointments" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
            <Plus className="h-4 w-4" /> Book new
          </Link>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            <CalendarDays className="mx-auto h-8 w-8 opacity-50" />
            <p className="mt-2">No {tab} appointments.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((a) => {
              const doctor = doctors.find((d) => d.id === a.doctor_id);
              const canCancel = tab === "upcoming" && (a.status === "pending" || a.status === "confirmed");
              return (
                <li key={a.id} className="rounded-xl border border-border bg-surface p-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-display font-bold">{a.service}</p>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {a.appointment_date} at {a.appointment_time} · {doctor?.name ?? a.doctor_id}
                    </p>
                  </div>
                  {canCancel && (
                    <button
                      onClick={() => cancel.mutate(a.id)}
                      disabled={cancel.isPending}
                      className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-destructive hover:text-destructive disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
