import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { isRailwayBackendConfigured } from "@/lib/railwayClient";
import { initLocalApi } from "./localApi";
import { initSupabaseApi } from "./supabaseApi";
import { initRailwayApi } from "./railwayApi";

export async function initApi() {
  if (isRailwayBackendConfigured()) {
    await initRailwayApi();
    return "railway";
  }
  if (isSupabaseConfigured()) {
    await initSupabaseApi();
    return "supabase";
  }
  initLocalApi();
  return "local";
}
