/** Copy único por barrio para SEO local (prerender + meta). */
export const ZONE_SEO_COPY = {
  Chapinero: {
    h1: "Arriendo en Chapinero, Bogotá",
    intro:
      "Apartamentos y estudios en arriendo en Chapinero, cerca de Zona G, Parque 93 y oficinas del norte. Filtra por canon, habitaciones y mascotas.",
  },
  Usaquén: {
    h1: "Arriendo en Usaquén, Bogotá",
    intro:
      "Casas y apartamentos en arriendo en Usaquén y el norte de Bogotá. Barrios residenciales, buen acceso y oferta familiar verificada.",
  },
  Teusaquillo: {
    h1: "Arriendo en Teusaquillo, Bogotá",
    intro:
      "Alquiler de apartamentos en Teusaquillo, entre parques y vías principales. Ideal si buscas centro urbano con buena conectividad.",
  },
  Suba: {
    h1: "Arriendo en Suba, Bogotá",
    intro:
      "Apartamentos en conjunto cerrado y casas en arriendo en Suba. Gran inventario, parqueadero y zonas comunes en muchos listados.",
  },
  Kennedy: {
    h1: "Arriendo en Kennedy, Bogotá",
    intro:
      "Arriendos en Kennedy con precios competitivos: apartamentos familiares, estudios y casas en el occidente de Bogotá.",
  },
  Engativá: {
    h1: "Arriendo en Engativá, Bogotá",
    intro:
      "Inmuebles en arriendo en Engativá con buen acceso al aeropuerto y al occidente. Apartamentos verificados listos para visitar.",
  },
  "La Candelaria": {
    h1: "Arriendo en La Candelaria, Bogotá",
    intro:
      "Estudios y apartamentos pequeños en arriendo en La Candelaria, cerca del centro histórico y universidades.",
  },
  "Santa Fe": {
    h1: "Arriendo en Santa Fe, Bogotá",
    intro:
      "Arriendo en Santa Fe y el centro de Bogotá: opciones cerca de oficinas, comercio y transporte público.",
  },
  Fontibón: {
    h1: "Arriendo en Fontibón, Bogotá",
    intro:
      "Apartamentos en arriendo en Fontibón con acceso rápido al aeropuerto El Dorado y al occidente de la ciudad.",
  },
};

export function getZoneSeoCopy(zoneName) {
  return ZONE_SEO_COPY[zoneName] || null;
}
