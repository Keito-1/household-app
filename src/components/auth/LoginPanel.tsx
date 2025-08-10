import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

export default function LoginPanel() {
  const [email, setEmail] = useState("");

  const withEmail = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("ログイン用メールを送りました。メールのリンクを開いてください。");
  };

  const withGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
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
