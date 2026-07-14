import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PageHero } from "@/components/site/SiteShell";
import { StatusBadge } from "@/components/site/StatusBadge";
import {
  listAllAppointments,
  updateAppointmentStatus,
  type AppointmentStatus,
} from "@/lib/appointments.functions";
import { doctors } from "@/lib/clinic";

export const Route = createFileRoute("/_authenticated/staff/appointments")({
  head: () => ({
    meta: [{ title: "Staff — Appointments — Ubuntu Family Healthcare Clinic" }],
  }),
  component: StaffAppointments,
});

const STATUSES: (AppointmentStatus | "all")[] = ["all", "pending", "confirmed", "completed", "cancelled"];

function StaffAppointments() {
  const listFn = useServerFn(listAllAppointments);
  const updateFn = useServerFn(updateAppointmentStatus);
  const qc = useQueryClient();
  const [filter, setFilter] = useState<AppointmentStatus | "all">("pending");

  const { data, isLoading, error } = useQuery({
    queryKey: ["appointments", "all"],
    queryFn: listFn as never,
  }) as {
    data?: Array<{
      id: string;
      patient_first_name: string;
      patient_last_name: string;
      patient_phone: string;
      patient_email: string;
      appointment_date: string;
      appointment_time: string;
      service: string;
      doctor_id: string;
      status: AppointmentStatus;
      reason: string | null;
    }>;
    isLoading: boolean;
    error: unknown;
  };

  const update = useMutation({
    mutationFn: (v: { id: string; status: AppointmentStatus }) =>
      updateFn({ data: v }) as Promise<unknown>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments", "all"] }),
  });

  if (error) {
    return (
      <>
        <PageHero eyebrow="Staff" title="Access denied" description="Your account does not have staff permissions." />
        <section className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">
          Ask an administrator to grant you the receptionist or doctor role.
        </section>
      </>
    );
  }

  const appts = (data ?? []).filter((a) => filter === "all" || a.status === filter);
  const counts = (data ?? []).reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    acc.all = (acc.all ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHero eyebrow="Staff dashboard" title="Manage appointments" description="Confirm, complete or cancel bookings. Filter by status." />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition ${filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:border-primary"}`}
            >
              {s} {counts[s] ? `(${counts[s]})` : ""}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : appts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No appointments in this view.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Patient</th>
                  <th className="p-3">When</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Change status</th>
                </tr>
              </thead>
              <tbody>
                {appts.map((a) => {
                  const doctor = doctors.find((d) => d.id === a.doctor_id);
                  return (
                    <tr key={a.id} className="border-t border-border align-top">
                      <td className="p-3">
                        <div className="font-medium">{a.patient_first_name} {a.patient_last_name}</div>
                        <div className="text-xs text-muted-foreground">{a.patient_email}</div>
                        <div className="text-xs text-muted-foreground">{a.patient_phone}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {a.appointment_date}<br />
                        <span className="text-muted-foreground">{a.appointment_time}</span>
                      </td>
                      <td className="p-3">{doctor?.name ?? a.doctor_id}</td>
                      <td className="p-3">
                        {a.service}
                        {a.reason && <div className="text-xs text-muted-foreground max-w-xs">{a.reason}</div>}
                      </td>
                      <td className="p-3"><StatusBadge status={a.status} /></td>
                      <td className="p-3">
                        <select
                          value={a.status}
                          disabled={update.isPending}
                          onChange={(e) => update.mutate({ id: a.id, status: e.target.value as AppointmentStatus })}
                          className="rounded-lg border border-input bg-surface px-2.5 py-1.5 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
