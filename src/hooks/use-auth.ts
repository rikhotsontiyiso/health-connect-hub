import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type Auth = {
  user: User | null;
  loading: boolean;
  isStaff: boolean;
};

export function useAuth(): Auth {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadRoles(userId: string) {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      if (!mounted) return;
      const roles = (data ?? []).map((r) => r.role);
      setIsStaff(roles.includes("receptionist") || roles.includes("doctor"));
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) loadRoles(data.session.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setUser(session?.user ?? null);
        if (session?.user) loadRoles(session.user.id);
        else setIsStaff(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, isStaff };
}
