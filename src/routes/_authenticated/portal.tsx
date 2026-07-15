import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { CalendarDays, User, HeartPulse, Pill, FlaskConical, Receipt, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [{ title: "Patient Portal — Ubuntu Family Healthcare Clinic" }],
  }),
  component: PortalLayout,
});

const nav = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/portal/appointments", label: "My Appointments", icon: CalendarDays },
  { to: "/portal/profile", label: "My Profile", icon: User },
  { to: "/portal/history", label: "Medical History", icon: HeartPulse },
  { to: "/portal/prescriptions", label: "Prescriptions", icon: Pill },
  { to: "/portal/lab-results", label: "Lab Results", icon: FlaskConical },
  { to: "/portal/invoices", label: "Invoices", icon: Receipt },
] as const;

function PortalLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start rounded-2xl border border-border bg-surface p-3">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: "exact" in n ? n.exact : false }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 data-[status=active]:bg-primary/10 data-[status=active]:text-primary whitespace-nowrap"
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
