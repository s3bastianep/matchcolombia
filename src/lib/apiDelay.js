/** Sin latencia artificial — datos en localStorage, no hay red real. */
export function apiDelay() {
  return Promise.resolve();
}
