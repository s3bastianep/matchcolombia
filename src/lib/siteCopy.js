/** Copy unificado para todo el sitio */

export const HERO_SUBTITLE =
  "Inmuebles verificados y recomendaciones inteligentes para encontrar el lugar ideal.";

export const VERIFIED_LISTINGS =
  "Inmuebles revisados antes de publicar. Fotos y datos verificados por nuestro equipo.";

export const MATCH_STEPS_VERIFIED =
  "Todos los anuncios son verificados por nuestro equipo antes de publicarse.";

export const TRUST_TAGLINE =
  "Menos tiempo buscando. Más confianza al arrendar.";

export const FEATURED_SUBTITLE =
  "Filtra por tipo y descubre más opciones en Bogotá.";

export const EXPLORE_TRUST_BANNER =
  "Listados revisados por nuestro equipo antes de publicar.";

export const EXPLORE_MORE_FILTERS = "Más filtros";

export const EXPLORE_DEFAULT_CITY = "Bogotá";

export const EXPLORE_TYPE_LABELS = {
  apartamento: "Apartamento",
  casa: "Casa",
  estudio: "Estudio",
  habitacion: "Habitación",
};

export const EXPLORE_SORT_LABELS = {
  match: "Mejor match",
  newest: "Más recientes",
  price_asc: "Menor precio",
  price_desc: "Mayor precio",
  area: "Mayor área",
};

export const NAV_LABEL_RENT = "Arrendar";

export const FAVORITES_BADGE = "Guardados";

export const FAVORITES_EMPTY_TITLE = "Aún no tienes inmuebles guardados";

export const FAVORITES_EMPTY_HINT =
  "Usa el match inteligente para encontrar opciones que encajen, o guarda cualquier inmueble con el corazón.";

export const OWNER_PROMO_TAGLINE =
  "Publica gratis. Nos encargamos de interesados y visitas.";

export const ADVERTISE_HERO_TITLE =
  "Arrienda con tranquilidad. Nosotros administramos tu inmueble de punta a punta.";

export const ADVERTISE_HERO_SUBTITLE =
  "Publica gratis y delega visitas, candidatos, contratos y cobros en un equipo verificado. Recibe tu dinero con tranquilidad y haz seguimiento desde cualquier dispositivo.";

export const QUIZ_FINISH_CTA = "Ver resultados";

export const QUIZ_STEPS = [
  { id: "city", title: "¿En qué zona de Bogotá?", subtitle: "Elige toda la ciudad o un barrio" },
  { id: "zone", title: "¿En qué zona?", subtitle: "Opcional. Afina por barrio o zona" },
  { id: "type", title: "¿Qué tipo de inmueble?", subtitle: "Apartamento, casa o estudio" },
  { id: "beds", title: "¿Cuántas habitaciones?", subtitle: "Para afinar tu match inteligente" },
  { id: "baths", title: "¿Cuántos baños?", subtitle: "Elige el mínimo que necesitas" },
  { id: "budget", title: "¿Cuál es tu presupuesto?", subtitle: "Precio mensual, sin sorpresas" },
  { id: "elevator", title: "¿Necesitas ascensor?", subtitle: "Útil en pisos altos o si buscas comodidad" },
  { id: "pets", title: "¿Tienes mascotas?", subtitle: "Filtramos inmuebles que las acepten si las tienes" },
  { id: "kitchen", title: "¿Qué tipo de cocina prefieres?", subtitle: "Eléctrica, a gas o sin preferencia" },
  { id: "shower", title: "¿Qué tipo de ducha prefieres?", subtitle: "Eléctrica, a gas o sin preferencia" },
  { id: "flooring", title: "¿Qué tipo de piso prefieres?", subtitle: "Madera, porcelanato o sin preferencia" },
  { id: "balcony", title: "¿Prefieres balcón?", subtitle: "Con balcón, sin balcón o sin preferencia" },
  { id: "extras", title: "¿Qué más necesitas?", subtitle: "Parqueadero, piscina, gimnasio y más" },
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

export const EXPLORE_EMPTY_NO_LISTINGS_TITLE = "No hay inmuebles en este momento";
export const EXPLORE_EMPTY_NO_LISTINGS_DESC =
  "Estamos incorporando nuevos inmuebles verificados. Configura tu match inteligente y vuelve a buscar pronto: publicamos opciones nuevas con frecuencia.";
export const EXPLORE_EMPTY_FILTERED_TITLE = "Sin resultados por ahora";
export const EXPLORE_EMPTY_FILTERED_DESC =
  "Prueba ampliando ciudad, zona o ajustando habitaciones, baños, parqueaderos o estrato.";

export function exploreResultsQuerySuffix(query) {
  return query ? ` para «${query}»` : "";
}

export function bathroomFilterChipLabel(count) {
  if (count === "5") return "5+ baños";
  return `${count} baño${count !== "1" ? "s" : ""}`;
}
