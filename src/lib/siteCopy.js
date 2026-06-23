/** Copy unificado para todo el sitio */

export const HERO_SUBTITLE =
  "Inmuebles verificados para habitar Bogotá. Encuentra el lugar ideal con el Match inteligente de HABIBAR.";

export const HERO_QUIZ_TITLE = "Match inteligente";
export const HERO_QUIZ_DESC = "2 minutos · opciones a tu medida";

export const VERIFIED_LISTINGS =
  "Inmuebles revisados antes de publicar. Fotos y datos verificados por nuestro equipo.";

export const HABIBAR_STEPS_VERIFIED =
  "Todos los anuncios son verificados por nuestro equipo antes de publicarse.";

/** @deprecated use HABIBAR_STEPS_VERIFIED */
export const MATCH_STEPS_VERIFIED = HABIBAR_STEPS_VERIFIED;

export const TRUST_TAGLINE =
  "Menos tiempo buscando. Más confianza al arrendar.";

export const HUMAN_SUPPORT_TITLE = "Cuando nos escribes, te responde una persona";
export const HUMAN_SUPPORT_BADGE = "Atención humana";
export const HUMAN_SUPPORT_BODY =
  "En Habibar la atención la da el equipo, no un proceso automático. Alguien real te escucha, te entiende y te acompaña por WhatsApp cuando lo necesites.";
export const HUMAN_SUPPORT_SHORT =
  "Cuando nos escribes, responde alguien del equipo · WhatsApp directo";

export const FEATURED_SUBTITLE =
  "Filtra por tipo y descubre más opciones en Bogotá.";

export const EXPLORE_TRUST_BANNER =
  "Cuando nos escribes, responde una persona";

export const EXPLORE_MORE_FILTERS = "Más filtros";

export const EXPLORE_DEFAULT_CITY = "Bogotá";

export const EXPLORE_TYPE_LABELS = {
  apartamento: "Apartamento",
  casa: "Casa",
  estudio: "Estudio",
  habitacion: "Habitación",
};

export const EXPLORE_SORT_LABELS = {
  match: "Recomendados",
  newest: "Más recientes",
  price_asc: "Menor precio",
  price_desc: "Mayor precio",
  area: "Mayor área",
};

export const NAV_LABEL_RENT = "Arrendar";

export const FAVORITES_BADGE = "Guardados";

export const FAVORITES_EMPTY_TITLE = "Aún no tienes inmuebles guardados";

export const FAVORITES_EMPTY_HINT =
  "Usa el Match inteligente de HABIBAR para encontrar opciones que encajen, o guarda cualquier inmueble con el corazón.";

export const OWNER_PROMO_TAGLINE =
  "Publica gratis. Nos encargamos de interesados y visitas.";

export const ADVERTISE_HERO_TITLE =
  "Arrienda con tranquilidad. Nosotros administramos tu inmueble de punta a punta.";

export const ADVERTISE_HERO_SUBTITLE =
  "Publica gratis y delega visitas, candidatos, contratos y cobros en un equipo verificado. Recibe tu dinero con tranquilidad y haz seguimiento desde cualquier dispositivo.";

export const QUIZ_FINISH_CTA = "Ver resultados";

export const QUIZ_STEPS = [
  { id: "city", title: "¿En qué zona de Bogotá?", subtitle: "Elige toda la ciudad o un barrio" },
  { id: "zone", title: "¿Qué barrio prefieres?", subtitle: "Opcional. Puedes elegir varios barrios" },
  { id: "type", title: "¿Qué tipo de inmueble?", subtitle: "Puedes seleccionar uno o varios" },
  { id: "beds", title: "¿Cuántas habitaciones?", subtitle: "Elige una o varias. Ej: 1 y 2 habitaciones" },
  { id: "baths", title: "¿Cuántos baños?", subtitle: "Elige uno o varios mínimos, o cualquiera" },
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

export function habibarBannerTitle(cityLabel) {
  return `Opciones que encajan en ${cityLabel}`;
}

/** @deprecated use habibarBannerTitle */
export function matchBannerTitle(cityLabel) {
  return habibarBannerTitle(cityLabel);
}

export function viewListingsLabel(count) {
  return `Ver ${count} inmueble${count !== 1 ? "s" : ""}`;
}

export const EXPLORE_EMPTY_NO_LISTINGS_TITLE = "No hay inmuebles en este momento";
export const EXPLORE_EMPTY_NO_LISTINGS_DESC =
  "Estamos incorporando nuevos inmuebles verificados. Prueba el Match inteligente de HABIBAR y vuelve a buscar pronto: publicamos opciones nuevas con frecuencia.";
export const EXPLORE_EMPTY_FILTERED_TITLE = "Sin resultados por ahora";
export const EXPLORE_EMPTY_FILTERED_DESC =
  "Prueba ampliando ciudad, zona o ajustando habitaciones, baños, parqueaderos o estrato.";

export function exploreResultsQuerySuffix(query) {
  return query ? ` para «${query}»` : "";
}

export function bathroomFilterChipLabel(count) {
  if (count.includes(",")) {
    return `${count.split(",").join(" y ")} baños`;
  }
  if (count === "5") return "5+ baños";
  return `${count} baño${count !== "1" ? "s" : ""}`;
}
