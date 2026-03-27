import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { hasSupabaseEnv, supabase } from "../lib/supabase";

export type UserRole = "admin" | "doctor";

interface AuthContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  userRole: UserRole;
  doctorId: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: hasSupabaseEnv ? Boolean(session) : true,
      loading,
      // Without Supabase (mock mode): default to admin so /admin still works.
      // With Supabase: read role from user_metadata set at doctor creation.
      userRole: session?.user?.user_metadata?.role === "doctor" ? "doctor" : "admin",
      doctorId: (session?.user?.user_metadata?.doctor_id as string | undefined) ?? null,
      async signIn(email, password) {
        if (!supabase) return {};
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { error: error.message } : {};
      },
      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
