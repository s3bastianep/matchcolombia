import { isSupabaseConfigured } from "@/lib/backendConfig";
import { isRailwayBackendConfigured } from "@/lib/railwayClient";

let apiPromise = null;

async function resolveApi() {
  const { initApi } = await import("./initApi");
  await initApi();
  if (isRailwayBackendConfigured()) {
    return (await import("./railwayApi")).api;
  }
  if (isSupabaseConfigured()) {
    return (await import("./supabaseApi")).api;
  }
  return (await import("./localApi")).api;
}

export function ensureApiReady() {
  if (!apiPromise) {
    apiPromise = resolveApi();
  }
  return apiPromise;
}

function createApiProxy(path = []) {
  const invoke = (...args) =>
    ensureApiReady().then((api) => {
      let target = api;
      for (const key of path) {
        target = target[key];
      }
      return typeof target === "function" ? target(...args) : target;
    });

  return new Proxy(invoke, {
    get(_, prop) {
      if (prop === "then" || prop === "catch" || prop === "finally") return undefined;
      return createApiProxy([...path, prop]);
    },
  });
}

/** Proxy que carga solo el backend activo (Railway, Supabase o local). */
export const api = createApiProxy();

export { isSupabaseConfigured, isRailwayBackendConfigured };
