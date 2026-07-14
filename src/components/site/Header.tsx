import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, HeartPulse, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { clinic } from "@/lib/clinic";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/doctors", label: "Doctors" },
  { to: "/appointments", label: "Appointments" },
  { to: "/patient-info", label: "Patient Info" },
  { to: "/blog", label: "Health Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5">
          <span className="hidden sm:inline">Mon–Fri 08:00–18:00 · Sat 08:00–13:00</span>
          <a href={`tel:${clinic.emergency.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 font-medium hover:underline">
            <Phone className="h-3.5 w-3.5" /> Emergency: {clinic.emergency}
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-bold leading-tight">Ubuntu Family</span>
            <span className="block truncate text-xs text-muted-foreground">Healthcare Clinic</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md data-[status=active]:text-primary data-[status=active]:bg-primary/5"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/portal/appointments"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary"
              >
                <UserIcon className="h-4 w-4" /> My appointments
              </Link>
              {isStaff && (
                <Link
                  to="/staff/appointments"
                  className="hidden md:inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Staff
                </Link>
              )}
              <button
                onClick={signOut}
                title="Sign out"
                className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:border-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary"
            >
              <LogIn className="h-4 w-4" /> Sign in
            </Link>
          )}
          <Link
            to="/appointments"
            className="hidden sm:inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm hover:brightness-105 transition"
          >
            Book
          </Link>
          <button
            aria-label="Toggle menu"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-surface">
          <nav className="mx-auto flex max-w-7xl flex-col p-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-sm font-medium border-b border-border/60 data-[status=active]:text-primary"
              >
                {n.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/portal/appointments" onClick={() => setOpen(false)} className="px-2 py-3 text-sm font-medium border-b border-border/60">My appointments</Link>
                {isStaff && <Link to="/staff/appointments" onClick={() => setOpen(false)} className="px-2 py-3 text-sm font-medium border-b border-border/60">Staff dashboard</Link>}
                <button onClick={() => { setOpen(false); signOut(); }} className="px-2 py-3 text-left text-sm font-medium text-destructive">Sign out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="px-2 py-3 text-sm font-medium border-b border-border/60">Sign in</Link>
            )}
            <Link
              to="/appointments"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Book Appointment
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
