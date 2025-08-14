import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import LoginPanel from "../components/auth/LoginPanel";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    // 1) 起動直後のセッションを拾う
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
      setReady(true);
    });

    // 2) 以降の変化（初期ロード含む）を購読
    const { data: sub } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        // INITIAL_SESSION, SIGNED_IN, SIGNED_OUT など全てで走る
        setSignedIn(!!session);
        setReady(true);
      }
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    // ← ここが以前は null（真っ白）だった。ローディングを出す
    return <div style={{padding: 24, textAlign: "center"}}>Loading…</div>;
  }
  return signedIn ? <>{children}</> : <LoginPanel />;
}
