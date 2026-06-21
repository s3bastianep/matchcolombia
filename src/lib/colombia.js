/** Ciudades activas en el lanzamiento */
export const CITIES = [
  { id: "bogota", name: "Bogotá", region: "Cundinamarca", count: "320+" },
];

export const ZONES_BY_CITY = {
  Bogotá: ["Chapinero", "Usaquén", "Teusaquillo", "Suba", "Kennedy", "Engativá", "La Candelaria", "Santa Fe", "Fontibón"],
};

export function getCityImage(cityId) {
  return cityId === "bogota" ? "bogota" : "skyline";
}

export function getZonesForCity(cityName) {
  return ZONES_BY_CITY[cityName] || ZONES_BY_CITY.Bogotá;
}

export const CITY_NAMES = CITIES.map((c) => c.name);
