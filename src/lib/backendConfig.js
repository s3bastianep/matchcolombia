/** Flags de backend sin importar @supabase/supabase-js (evita peso en el bundle inicial). */
export function isSupabaseConfigured() {
  const url = import.meta.env.VITE_SUPABASE_URL || "";
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
  return Boolean(url && key);
}
