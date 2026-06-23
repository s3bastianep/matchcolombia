import { isSupabaseConfigured } from "./supabaseClient";
import { isRailwayBackendConfigured } from "./railwayClient";
import { getCurrentUserId as getLocalUserId } from "./localAuth";
import { getCurrentUserId as getRemoteUserId } from "./supabaseAuth";
import { getCurrentUserId as getRailwayUserId } from "./railwayAuth";

/** ID del usuario autenticado (Railway, Supabase o local) */
export function getCurrentUserId() {
  if (isRailwayBackendConfigured()) return getRailwayUserId();
  if (isSupabaseConfigured()) return getRemoteUserId();
  return getLocalUserId();
}
