export const CHUNK_RELOAD_KEY = "habibar-chunk-reload";

export function isChunkLoadError(error) {
  const message = error?.message || String(error || "");
  return (
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("error loading dynamically imported module")
  );
}

/** Recarga forzando HTML nuevo (p. ej. tras un deploy con hashes distintos). */
export function hardReloadForNewBuild() {
  sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
  const url = new URL(window.location.href);
  url.searchParams.set("_cb", String(Date.now()));
  window.location.replace(url.toString());
}

export function importWithRetry(importFn) {
  return importFn().catch((error) => {
    if (isChunkLoadError(error) && !sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
      hardReloadForNewBuild();
      return new Promise(() => {});
    }
    throw error;
  });
}

export function clearChunkReloadFlag() {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY);
}
