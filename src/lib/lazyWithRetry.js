import { lazy } from "react";
import { CHUNK_RELOAD_KEY, hardReloadForNewBuild, importWithRetry, isChunkLoadError } from "./chunkRetry";

export { clearChunkReloadFlag } from "./chunkRetry";

/**
 * React.lazy con reintento: si falla la carga del chunk (p. ej. tras un deploy),
 * recarga la página una vez para obtener el index.html y assets nuevos.
 */
export function lazyWithRetry(importFn) {
  return lazy(() => importWithRetry(importFn));
}

export { isChunkLoadError, CHUNK_RELOAD_KEY, hardReloadForNewBuild, importWithRetry };
