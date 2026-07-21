import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo } from "react";
import { PageHero } from "@/components/site/SiteShell";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Users, Calendar, History, Search } from "lucide-react";
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
      patient_id: string | null;
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

  const [searchQuery, setSearchQuery] = useState("");

  const update = useMutation({
    mutationFn: (v: { id: string; status: AppointmentStatus }) =>
      updateFn({ data: v }) as Promise<unknown>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments", "all"] }),
  });

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const stats = useMemo(() => {
    if (!data) return { todayCount: 0, totalPatients: 0 };
    const todayAppts = data.filter(a => a.appointment_date === today && a.status !== 'cancelled');
    const uniquePatients = new Set(data.map(a => a.patient_email)).size;
    return {
      todayCount: todayAppts.length,
      totalPatients: uniquePatients
    };
  }, [data, today]);

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

  const filteredData = (data ?? []).filter((a) => {
    const matchesFilter = filter === "all" || a.status === filter;
    const matchesSearch = 
      a.patient_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patient_last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patient_phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const counts = (data ?? []).reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    acc.all = (acc.all ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHero eyebrow="Staff dashboard" title="Manage clinic operations" description="Track daily patient load and manage appointment history." />
      
      <section className="mx-auto max-w-7xl px-4 -mt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            icon={<Calendar className="h-5 w-5 text-primary" />} 
            label="Daily Load" 
            value={stats.todayCount} 
            description="Appointments for today"
          />
          <StatCard 
            icon={<Users className="h-5 w-5 text-accent" />} 
            label="Total Reach" 
            value={stats.totalPatients} 
            description="Unique patient records"
          />
          <StatCard 
            icon={<History className="h-5 w-5 text-emerald-600" />} 
            label="Patient History" 
            value={counts.completed ?? 0} 
            description="Total visits completed"
          />
          <StatCard 
            icon={<StatusBadge status="pending" />} 
            label="Awaiting Action" 
            value={counts.pending ?? 0} 
            description="New bookings to confirm"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
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
          
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-input bg-surface pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : filteredData.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No appointments found matching your criteria.</div>
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
                {filteredData.map((a) => {
                  const doctor = doctors.find((d) => d.id === a.doctor_id);
                  return (
                    <tr key={a.id} className="border-t border-border align-top">
                      <td className="p-3">
                        <div className="font-medium">{a.patient_first_name} {a.patient_last_name}</div>
                        <div className="text-xs text-muted-foreground">{a.patient_email}</div>
                        <div className="text-xs text-muted-foreground">{a.patient_phone}</div>
                        {a.patient_id && (
                           <div className="mt-1">
                             <span className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                               Registered
                             </span>
                           </div>
                        )}
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

function StatCard({ icon, label, value, description }: { icon: React.ReactNode; label: string; value: string | number; description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-muted p-2">{icon}</div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
}
