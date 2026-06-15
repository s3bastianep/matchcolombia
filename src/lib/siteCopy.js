/** Copy unificado para todo el sitio */

export const HERO_SUBTITLE =
  "Inmuebles verificados y recomendaciones inteligentes para encontrar el lugar ideal.";

export const VERIFIED_LISTINGS =
  "Inmuebles revisados antes de publicar. Fotos y datos verificados por nuestro equipo.";

export const TRUST_TAGLINE =
  "Menos tiempo buscando. Más confianza al arrendar.";

export const FEATURED_SUBTITLE =
  "Filtra por tipo y descubre más opciones en Bogotá y Barranquilla.";

export const EXPLORE_TRUST_BANNER =
  "Listados revisados por nuestro equipo antes de publicar.";

export const FOOTER_BLURB =
  "Arriendos en Bogotá y Barranquilla con listados revisados y match inteligente.";

export const FAVORITES_EMPTY_HINT =
  "Usa el match inteligente para encontrar opciones que encajen, o guarda cualquier inmueble con el corazón.";

export const OWNER_PROMO_TAGLINE =
  "Publica gratis. Nos encargamos de interesados y visitas.";

export const QUIZ_FINISH_CTA = "Ver resultados";

export const QUIZ_STEPS = [
  { id: "city", title: "¿En qué ciudad?", subtitle: "Bogotá, Barranquilla o ambas" },
  { id: "zone", title: "¿En qué zona?", subtitle: "Opcional. Afina por barrio o zona" },
  { id: "type", title: "¿Qué tipo de inmueble?", subtitle: "Apartamento, casa, estudio o habitación" },
  { id: "beds", title: "¿Cuántas habitaciones?", subtitle: "Para afinar tu match inteligente" },
  { id: "baths", title: "¿Cuántos baños?", subtitle: "Elige el mínimo que necesitas" },
  { id: "budget", title: "¿Cuál es tu presupuesto?", subtitle: "Precio mensual, sin sorpresas" },
  { id: "elevator", title: "¿Necesitas ascensor?", subtitle: "Útil en pisos altos o si buscas comodidad" },
  { id: "pets", title: "¿Tienes mascotas?", subtitle: "Filtramos inmuebles que las acepten si las tienes" },
  { id: "extras", title: "¿Qué más necesitas?", subtitle: "Parqueadero, amoblado y otros extras" },
];

export function listingsCountLabel(count) {
  return count === 1 ? "inmueble disponible" : "inmuebles disponibles";
}

export function matchBannerTitle(cityLabel) {
  return `Opciones que encajan en ${cityLabel}`;
}

export function viewListingsLabel(count) {
  return `Ver ${count} inmueble${count !== 1 ? "s" : ""}`;
}
