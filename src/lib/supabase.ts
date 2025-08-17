import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string,
  {
    auth: {
      persistSession: true,          // ローカルに保持
      autoRefreshToken: true,        // 有効期限前に自動更新
      detectSessionInUrl: true,      // リダイレクトURLのトークンを拾って保存
      storage: localStorage,         // 明示しておく（デフォルトだけど安全）
    },
  });
  
// ★ デバッグ用：ブラウザのコンソールから使えるように公開（後で削除OK）
;(globalThis as any).supabase = supabase;