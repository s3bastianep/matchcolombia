/** Ciudades activas en el lanzamiento */
export const CITIES = [
  { id: "bogota", name: "Bogotá", region: "Cundinamarca", count: "320+" },
  { id: "barranquilla", name: "Barranquilla", region: "Atlántico", count: "140+" },
];

export const ZONES_BY_CITY = {
  Bogotá: ["Chapinero", "Usaquén", "Teusaquillo", "Suba", "Kennedy", "Engativá", "La Candelaria", "Santa Fe", "Fontibón"],
  Barranquilla: ["El Prado", "Riomar", "Alto Prado", "Villa Country", "Buenavista", "Boston"],
};

export function getCityImage(cityId) {
  const map = { bogota: "bogota", barranquilla: "barranquilla" };
  return map[cityId] || "skyline";
}

export function getZonesForCity(cityName) {
  return ZONES_BY_CITY[cityName] || [];
}

export const CITY_NAMES = CITIES.map((c) => c.name);
