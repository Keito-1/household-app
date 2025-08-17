import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

// 本番ドメインに固定（プレビューに行かせない）
const APP_ORIGIN = process.env.REACT_APP_APP_ORIGIN ?? "https://household-app.pages.dev";

export default function LoginPanel() {
  const [email, setEmail] = useState("");

  const withEmail = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // ← ここを固定。メールのマジックリンクを開くと必ず本番へ戻る
        emailRedirectTo: APP_ORIGIN,
      },
    });
    if (error) alert(error.message);
    else alert("ログイン用メールを送りました。メールのリンクを開いてください。");
  };

  const withGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // ← OAuth も本番へ戻す
        redirectTo: APP_ORIGIN,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <Box sx={{ p: 4, display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <Stack spacing={2} sx={{ width: 360 }}>
        <Typography variant="h5">ログイン</Typography>
        <TextField label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Button variant="contained" onClick={withEmail}>メールでログイン</Button>
        <Button variant="outlined" onClick={withGoogle}>Googleでログイン</Button>
      </Stack>
    </Box>
  );
}
