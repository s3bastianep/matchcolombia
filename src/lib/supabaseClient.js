import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/backendConfig";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export { isSupabaseConfigured };

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/** Email interno para login por nombre de usuario con Supabase Auth */
export function authEmailForUsername(username) {
  const normalized = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  return `${normalized}@auth.habibar.app`;
}
