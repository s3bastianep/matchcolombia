import { isSupabaseConfigured } from "@/lib/backendConfig";
import { isRailwayBackendConfigured } from "@/lib/railwayClient";

export async function initApi() {
  if (isRailwayBackendConfigured()) {
    const { initRailwayApi } = await import("./railwayApi");
    await initRailwayApi();
    return "railway";
  }
  if (isSupabaseConfigured()) {
    const { initSupabaseApi } = await import("./supabaseApi");
    await initSupabaseApi();
    return "supabase";
  }
  const { initLocalApi } = await import("./localApi");
  initLocalApi();
  return "local";
}
