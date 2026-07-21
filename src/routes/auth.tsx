import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/SiteShell";

const searchSchema = z.object({
  redirect: z.string().optional(),
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — Ubuntu Family Healthcare Clinic" },
      { name: "description", content: "Sign in or create an account to book and manage appointments." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: (search.redirect as string) || "/portal/appointments", replace: true });
      }
    });
  }, [navigate, search.redirect]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal/appointments`,
            data: { first_name: firstName, last_name: lastName },
          },
        });
        if (error) throw error;
        
        if (data.user && data.session === null) {
          setError("Please check your email to confirm your account before signing in.");
          setBusy(false);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: (search.redirect as string) || "/portal/appointments", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero eyebrow="Patient portal" title={mode === "signup" ? "Create your account" : "Sign in"} description="Access your appointments, view your history and manage your bookings." />
      <section className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="mb-6 flex rounded-lg border border-border p-1 text-sm font-medium">
            <button type="button" onClick={() => setMode("signin")} className={`flex-1 rounded-md py-2 ${mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Sign in</button>
            <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-md py-2 ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Sign up</button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <Input label="First name" value={firstName} onChange={setFirstName} required />
                <Input label="Surname" value={lastName} onChange={setLastName} required />
              </div>
            )}
            <Input label="Email" type="email" value={email} onChange={setEmail} required />
            <Input label="Password" type="password" value={password} onChange={setPassword} required minLength={6} />
            {error && (
              <div className={`rounded-lg p-3 text-sm ${error.includes("check your email") ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                {error}
              </div>
            )}
            <button type="submit" disabled={busy} className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50">
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function Input({ label, value, onChange, type = "text", required, minLength }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; minLength?: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}{required && <span className="text-destructive"> *</span>}</span>
      <input
        type={type}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
