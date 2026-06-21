import { lazy } from "react";

const CHUNK_RELOAD_KEY = "habibar-chunk-reload";

function isChunkLoadError(error) {
  const message = error?.message || String(error || "");
  return (
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("error loading dynamically imported module")
  );
}

/**
 * React.lazy con reintento: si falla la carga del chunk (p. ej. tras un deploy),
 * recarga la página una vez para obtener el index.html y assets nuevos.
 */
export function lazyWithRetry(importFn) {
  return lazy(() =>
    importFn().catch((error) => {
      if (isChunkLoadError(error) && !sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
        window.location.reload();
        return new Promise(() => {});
      }
      throw error;
    })
  );
}

export function clearChunkReloadFlag() {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY);
}
