import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { api as localApi } from "./localApi";
import { api as remoteApi } from "./supabaseApi";

export const api = isSupabaseConfigured() ? remoteApi : localApi;
export { isSupabaseConfigured };
