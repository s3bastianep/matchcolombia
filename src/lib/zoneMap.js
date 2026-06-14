/** Posiciones % en mapa estilizado por zona/barrio (fallback ilustrativo) */
export const ZONE_COORDS = {
  Bogotá: {
    Chapinero: { top: 42, left: 52 },
    Usaquén: { top: 18, left: 55 },
    Suba: { top: 12, left: 28 },
    Kennedy: { top: 62, left: 32 },
    "La Candelaria": { top: 52, left: 58 },
    Teusaquillo: { top: 48, left: 44 },
    "Santa Fe": { top: 38, left: 60 },
    Engativá: { top: 22, left: 18 },
    Fontibón: { top: 35, left: 12 },
    default: { top: 40, left: 45 },
  },
  Barranquilla: {
    "El Prado": { top: 35, left: 48 },
    Riomar: { top: 28, left: 62 },
    "Villa Country": { top: 55, left: 38 },
    "Alto Prado": { top: 22, left: 52 },
    Buenavista: { top: 48, left: 55 },
    Boston: { top: 42, left: 42 },
    default: { top: 40, left: 50 },
  },
};

/** Coordenadas reales (centro aproximado de cada zona) */
export const ZONE_LAT_LNG = {
  Bogotá: {
    Chapinero: { lat: 4.6533, lng: -74.0636 },
    Usaquén: { lat: 4.6954, lng: -74.0305 },
    Suba: { lat: 4.7434, lng: -74.0955 },
    Kennedy: { lat: 4.628, lng: -74.154 },
    "La Candelaria": { lat: 4.5981, lng: -74.0758 },
    Teusaquillo: { lat: 4.628, lng: -74.0849 },
    "Santa Fe": { lat: 4.6097, lng: -74.0817 },
    Engativá: { lat: 4.7031, lng: -74.1087 },
    Fontibón: { lat: 4.669, lng: -74.145 },
    default: { lat: 4.711, lng: -74.0721 },
  },
  Barranquilla: {
    "El Prado": { lat: 10.989, lng: -74.788 },
    Riomar: { lat: 11.018, lng: -74.85 },
    "Villa Country": { lat: 11.01, lng: -74.82 },
    "Alto Prado": { lat: 11.005, lng: -74.805 },
    Buenavista: { lat: 10.975, lng: -74.81 },
    Boston: { lat: 10.968, lng: -74.778 },
    default: { lat: 10.9639, lng: -74.7964 },
  },
};

export const CITY_CENTERS = {
  Bogotá: { lat: 4.711, lng: -74.0721, zoom: 11 },
  Barranquilla: { lat: 10.9639, lng: -74.7964, zoom: 12 },
  all: { lat: 5.5, lng: -74.45, zoom: 7 },
};

/** Límites aproximados para posicionar pins sobre el embed de Google */
export const CITY_BOUNDS = {
  Bogotá: { north: 4.84, south: 4.47, west: -74.24, east: -73.98 },
  Barranquilla: { north: 11.06, south: 10.87, west: -74.9, east: -74.7 },
};

export function getVisibleBounds(center, zoom = 11) {
  const scale = 360 / Math.pow(2, zoom + 1);
  const latSpan = scale * 1.1;
  const lngSpan = scale * 1.35;
  return {
    north: center.lat + latSpan / 2,
    south: center.lat - latSpan / 2,
    west: center.lng - lngSpan / 2,
    east: center.lng + lngSpan / 2,
  };
}

export function latLngToPercent(lat, lng, bounds) {
  const top = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
  const left = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
  return {
    top: Math.min(92, Math.max(8, top)),
    left: Math.min(92, Math.max(8, left)),
  };
}

export function getBoundsForMap(center, zoom, city) {
  if (city === "Bogotá") return CITY_BOUNDS.Bogotá;
  if (city === "Barranquilla") return CITY_BOUNDS.Barranquilla;
  return getVisibleBounds(center, zoom);
}

export const HOME_ZONE_MARKERS = [
  { id: "chapinero", label: "Chapinero", count: 320, color: "#e11d6f", city: "Bogotá", zone: "Chapinero" },
  { id: "usaquen", label: "Usaquén", count: 215, color: "#8b5cf6", city: "Bogotá", zone: "Usaquén" },
  { id: "teusaquillo", label: "Teusaquillo", count: 175, color: "#d946ef", city: "Bogotá", zone: "Teusaquillo" },
  { id: "kennedy", label: "Kennedy", count: 290, color: "#7c3aed", city: "Bogotá", zone: "Kennedy" },
  { id: "suba", label: "Suba", count: 410, color: "#db2777", city: "Bogotá", zone: "Suba" },
  { id: "candelaria", label: "La Candelaria", count: 98, color: "#e11d6f", city: "Bogotá", zone: "La Candelaria" },
];

const PIN_COLORS = [
  "bg-brand-magenta",
  "bg-brand-violet",
  "bg-brand-magenta",
  "bg-brand-violet",
  "bg-brand-magenta",
];

const PIN_HEX = ["#e11d6f", "#8b5cf6", "#d946ef", "#7c3aed", "#db2777"];

function resolveZone(city, ...names) {
  const cityMap = ZONE_LAT_LNG[city] || ZONE_LAT_LNG.Bogotá;
  for (const name of names) {
    if (name && cityMap[name]) return cityMap[name];
  }
  return cityMap.default;
}

function jitterCoords(coords, seed = 0) {
  const angle = ((seed % 8) / 8) * Math.PI * 2;
  const radius = 0.002 + (seed % 3) * 0.001;
  return {
    lat: coords.lat + Math.sin(angle) * radius,
    lng: coords.lng + Math.cos(angle) * radius,
  };
}

export function getZoneLatLng(zone, city = "Bogotá") {
  return resolveZone(city, zone);
}

export function getPropertyLatLng(property, index = 0) {
  const city = property.city || "Bogotá";
  const base = resolveZone(city, property.locality, property.neighborhood);
  return jitterCoords(base, index + (property.id?.length || 0));
}

export function getPropertyPin(property, index = 0) {
  const city = property.city || "Bogotá";
  const cityMap = ZONE_COORDS[city] || ZONE_COORDS.Bogotá;
  const zone = property.locality || property.neighborhood || "default";
  const base = cityMap[zone] || cityMap[property.neighborhood] || cityMap.default;
  const jitter = ((index % 5) - 2) * 2.5;
  return {
    top: `${Math.min(88, Math.max(8, base.top + jitter * 0.6))}%`,
    left: `${Math.min(88, Math.max(8, base.left + jitter))}%`,
    color: PIN_COLORS[index % PIN_COLORS.length],
    hex: PIN_HEX[index % PIN_HEX.length],
  };
}

export function getCityLabel(city) {
  return city === "Barranquilla" ? "Barranquilla" : "Bogotá";
}

export function getMapCenter(city) {
  if (city === "Barranquilla") return CITY_CENTERS.Barranquilla;
  if (city === "Bogotá") return CITY_CENTERS.Bogotá;
  return CITY_CENTERS.all;
}
