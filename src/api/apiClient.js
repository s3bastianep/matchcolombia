import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { isRailwayBackendConfigured } from "@/lib/railwayClient";
import { api as localApi } from "./localApi";
import { api as remoteApi } from "./supabaseApi";
import { api as railwayApi } from "./railwayApi";

export const api = isRailwayBackendConfigured()
  ? railwayApi
  : isSupabaseConfigured()
    ? remoteApi
    : localApi;

export { isSupabaseConfigured, isRailwayBackendConfigured };
