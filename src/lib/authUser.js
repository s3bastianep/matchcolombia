import { isSupabaseConfigured } from "./supabaseClient";
import { getCurrentUserId as getLocalUserId } from "./localAuth";
import { getCurrentUserId as getRemoteUserId } from "./supabaseAuth";

/** ID del usuario autenticado (local o Supabase) */
export function getCurrentUserId() {
  return isSupabaseConfigured() ? getRemoteUserId() : getLocalUserId();
}
