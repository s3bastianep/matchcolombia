import { ZONES_BY_CITY } from "./colombia.js";

export const EXPLORE_COMPRA_PATH = "/explorar/compra";
export const ARRIENDOS_BOGOTA_PATH = "/arriendos-bogota";

/** slug URL → property_type interno */
export const EXPLORE_TYPE_SLUGS = {
  apartamentos: "apartamento",
  casas: "casa",
  estudios: "estudio",
};

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
  return `/explorar/zona/${slug}`;
}

export function exploreTypePath(propertyType) {
  const slug = Object.entries(EXPLORE_TYPE_SLUGS).find(([, type]) => type === propertyType)?.[0];
  if (!slug) return "/explorar";
  return `/explorar/${slug}`;
}

export function parseExplorePath(pathname = "") {
  if (pathname === EXPLORE_COMPRA_PATH || pathname === `${EXPLORE_COMPRA_PATH}/`) {
    return { intent: "compra" };
  }

  const typeMatch = pathname.match(/^\/explorar\/(apartamentos|casas|estudios)\/?$/);
  if (typeMatch) {
    const type = EXPLORE_TYPE_SLUGS[typeMatch[1]];
    return { city: "Bogotá", type };
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

export function listExploreTypePaths() {
  return Object.keys(EXPLORE_TYPE_SLUGS).map((slug) => `/explorar/${slug}`);
}

export function allZoneNames() {
  return ZONES_BY_CITY.Bogotá || Object.values(ZONE_SLUGS);
}

export function isExplorePath(pathname = "") {
  return (
    pathname === "/explorar" ||
    pathname === EXPLORE_COMPRA_PATH ||
    pathname.startsWith("/explorar/zona/") ||
    listExploreTypePaths().includes(pathname.replace(/\/$/, ""))
  );
}
