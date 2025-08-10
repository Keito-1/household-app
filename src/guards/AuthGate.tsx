import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import LoginPanel from "../components/auth/LoginPanel";
import type { Session } from "@supabase/supabase-js";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        setSignedIn(!!session);
      }
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return null;
  return signedIn ? <>{children}</> : <LoginPanel />;
}
