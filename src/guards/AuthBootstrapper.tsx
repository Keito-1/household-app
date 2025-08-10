import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function AuthBootstrapper() {
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_IN" && session?.user) {
          const uid = session.user.id;
          const { data } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", uid)
            .maybeSingle();
          if (!data) {
            await supabase.from("profiles").insert({
              id: uid,
              display_name: session.user.email ?? "user",
            });
          }
        }
      }
    );
    return () => sub.subscription.unsubscribe();
  }, []);
  return null;
}
