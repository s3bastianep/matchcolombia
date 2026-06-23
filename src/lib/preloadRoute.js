/** Precarga el chunk de la ruta actual en paralelo al boot de la app. */
export function preloadCurrentRouteChunk() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  if (path === "/") return import("@/pages/Home.jsx");
  if (path === "/explorar" || path.startsWith("/explorar/")) return import("@/pages/Explore.jsx");
  if (path === "/arriendos-bogota") return import("@/pages/ArriendosBogota.jsx");
  if (path === "/preguntas-frecuentes") return import("@/pages/Faq.jsx");
  if (path === "/anunciar") return import("@/pages/Advertise.jsx");
  if (path === "/publicar") return import("@/pages/Sell.jsx");
  if (path === "/privacidad") return import("@/pages/Privacy.jsx");
  if (path.startsWith("/propiedad/")) return import("@/pages/PropertyLanding.jsx");

  return null;
}
