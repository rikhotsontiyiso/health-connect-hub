import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Pill, FlaskConical, Receipt, User } from "lucide-react";
import { listMyAppointments } from "@/lib/appointments.functions";
import { listMyPrescriptions } from "@/lib/clinical.functions";
import { listMyInvoices } from "@/lib/invoices.functions";
import { getMyProfile } from "@/lib/profiles.functions";

export const Route = createFileRoute("/_authenticated/portal/")({
  component: Dashboard,
});

function Dashboard() {
  const apptsFn = useServerFn(listMyAppointments);
  const rxFn = useServerFn(listMyPrescriptions);
  const invFn = useServerFn(listMyInvoices);
  const profFn = useServerFn(getMyProfile);

  const appts = useQuery({ queryKey: ["appts", "mine"], queryFn: apptsFn as never }) as { data?: Array<{ status: string; appointment_date: string; appointment_time: string; service: string; reference: string | null }> };
  const rx = useQuery({ queryKey: ["rx", "mine"], queryFn: rxFn as never }) as { data?: unknown[] };
  const inv = useQuery({ queryKey: ["inv", "mine"], queryFn: invFn as never }) as { data?: Array<{ payment_status: string }> };
  const profile = useQuery({ queryKey: ["profile", "mine"], queryFn: profFn as never }) as { data?: { full_name?: string | null } | null };

  const today = new Date().toISOString().split("T")[0];
  const upcoming = (appts.data ?? []).filter((a) => a.appointment_date >= today && a.status !== "cancelled");
  const nextAppt = upcoming[upcoming.length - 1];
  const unpaid = (inv.data ?? []).filter((i) => i.payment_status === "unpaid").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back{profile.data?.full_name ? `, ${profile.data.full_name}` : ""}</p>
        <h1 className="font-display text-3xl font-bold">Your health at a glance</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Upcoming" value={upcoming.length} to="/portal/appointments" />
        <StatCard icon={Pill} label="Prescriptions" value={(rx.data ?? []).length} to="/portal/prescriptions" />
        <StatCard icon={FlaskConical} label="Lab results" value={0} to="/portal/lab-results" />
        <StatCard icon={Receipt} label="Unpaid invoices" value={unpaid} to="/portal/invoices" />
      </div>

      {nextAppt && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <p className="text-xs uppercase tracking-wide text-primary">Next appointment</p>
          <p className="mt-1 font-display text-xl font-bold">{nextAppt.service}</p>
          <p className="text-sm text-muted-foreground">
            {nextAppt.appointment_date} at {nextAppt.appointment_time} · Ref {nextAppt.reference ?? "—"}
          </p>
          <Link to="/portal/appointments" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">View details</Link>
        </div>
      )}

      {(!profile.data?.full_name) && (
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50 p-6">
          <p className="flex items-center gap-2 font-semibold text-amber-900"><User className="h-4 w-4" /> Complete your profile</p>
          <p className="mt-1 text-sm text-amber-900/80">Add your medical aid, emergency contact and health details so your doctor has everything they need.</p>
          <Link to="/portal/profile" className="mt-4 inline-flex rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Update profile</Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, to }: { icon: typeof User; label: string; value: number; to: string }) {
  return (
    <Link to={to} className="rounded-2xl border border-border bg-surface p-5 hover:border-primary transition">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Link>
  );
}
