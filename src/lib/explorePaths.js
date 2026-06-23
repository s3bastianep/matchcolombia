import { ZONES_BY_CITY } from "./colombia.js";

export const EXPLORE_COMPRA_PATH = "/explorar/compra";

const ZONE_SLUGS = {
  chapinero: "Chapinero",
  usaquen: "Usaquén",
  teusaquillo: "Teusaquillo",
  suba: "Suba",
  kennedy: "Kennedy",
  engativa: "Engativá",
  "la-candelaria": "La Candelaria",
  "santa-fe": "Santa Fe",
  fontibon: "Fontibón",
};

export function zoneToSlug(zoneName) {
  return zoneName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function exploreZonePath(zoneName) {
  const slug = zoneToSlug(zoneName);
  if (ZONE_SLUGS[slug]) return `/explorar/zona/${slug}`;
  return `/explorar/zona/${slug}`;
}

export function parseExplorePath(pathname = "") {
  if (pathname === EXPLORE_COMPRA_PATH || pathname === `${EXPLORE_COMPRA_PATH}/`) {
    return { intent: "compra" };
  }
  const match = pathname.match(/^\/explorar\/zona\/([^/]+)\/?$/);
  if (!match) return {};
  const zone = ZONE_SLUGS[match[1]];
  if (!zone) return {};
  return { city: "Bogotá", q: zone };
}

export function listExploreZonePaths() {
  return Object.keys(ZONE_SLUGS).map((slug) => `/explorar/zona/${slug}`);
}

export function allZoneNames() {
  return ZONES_BY_CITY.Bogotá || Object.values(ZONE_SLUGS);
}
