import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { initLocalApi } from "./localApi";
import { initSupabaseApi } from "./supabaseApi";

export async function initApi() {
  if (isSupabaseConfigured()) {
    await initSupabaseApi();
    return "supabase";
  }
  initLocalApi();
  return "local";
}
