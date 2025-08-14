import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function WhoAmI() {
  const [email, setEmail] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setId(data.user?.id ?? null);
      console.log("logged in as:", data.user?.email, data.user?.id);
    });
  }, []);

  return (
    <div style={{ fontSize: 12, opacity: 0.7 }}>
      {email ? (
        <>Signed in as <b>{email}</b> ({id?.slice(0,8)}…)</>
      ) : (
        <>Not signed in</>
      )}
    </div>
  );
}
