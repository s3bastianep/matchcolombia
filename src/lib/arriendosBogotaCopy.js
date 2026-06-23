import { BRAND } from "./brand.js";
import { EXPLORE_COMPRA_PATH, exploreTypePath, exploreZonePath, listExploreTypePaths } from "./explorePaths.js";

export const RENTER_FAQ = [
  {
    q: "¿Dónde buscar arriendos en Bogotá?",
    a: `En ${BRAND.name} encuentras apartamentos, casas y estudios verificados en Chapinero, Usaquén, Suba, Kennedy y más barrios. Filtra por presupuesto y agenda visitas en línea.`,
  },
  {
    q: "¿Cuánto cuesta alquilar un apartamento en Bogotá?",
    a: "El canon depende del barrio, tamaño y amenities. En el explorador puedes filtrar por rango de precio y ver solo inmuebles dentro de tu presupuesto antes de agendar visita.",
  },
  {
    q: "¿HABIBAR es una inmobiliaria en Bogotá?",
    a: `${BRAND.name} es una plataforma de arriendos verificados en Bogotá: revisamos cada anuncio, coordinamos visitas y acompañamos el proceso con atención humana, sin la burocracia típica de algunas inmobiliarias.`,
  },
  {
    q: "¿Puedo arrendar apartamento en Bogotá con mascotas?",
    a: "Sí, cuando el propietario lo permite. Activa el filtro de mascotas y revisa las reglas en cada ficha antes de visitar.",
  },
  {
    q: "¿Qué diferencia hay entre arriendo y alquiler en Bogotá?",
    a: "En Colombia se usa arriendo y alquiler para el mismo concepto: pagar un canon mensual por vivir en un inmueble. En Habibar encontrarás ambos términos en las búsquedas de apartamentos y casas.",
  },
];

const POPULAR_ZONES = [
  "Chapinero",
  "Usaquén",
  "Teusaquillo",
  "Suba",
  "Kennedy",
  "Engativá",
  "La Candelaria",
  "Fontibón",
];

export const ARRIENDOS_BOGOTA_SECTIONS = [
  {
    id: "arriendos-bogota",
    title: "Arriendos en Bogotá: apartamentos, casas y estudios",
    paragraphs: [
      `Buscar arriendos en Bogotá puede ser agotador cuando los anuncios no coinciden con la realidad. ${BRAND.name} publica inmuebles verificados: revisamos fotos, precios y disponibilidad antes de mostrarlos.`,
      `Si buscas apartamento en Bogotá, casa en conjunto cerrado o estudio cerca del trabajo, puedes filtrar por barrio, habitaciones, mascotas y presupuesto. El Match inteligente ordena opciones según lo que marcaste como importante.`,
      `Agenda visitas presenciales o virtuales y habla con personas del equipo por WhatsApp o correo. Sin perseguir dueños ni perder horas en portales sin filtro.`,
    ],
  },
  {
    id: "alquiler-apartamentos",
    title: "Alquiler de apartamento en Bogotá",
    paragraphs: [
      `El alquiler de apartamento en Bogotá varía por zona: Chapinero y Usaquén suelen tener mayor demanda; Kennedy, Suba y Engativá ofrecen más metros y parqueadero por el mismo canon en muchos casos.`,
      `En ${BRAND.name} encuentras apartamentos en arriendo verificados con datos claros de administración, estrato y fecha de entrega. Comparas opciones y agendas visita desde la misma ficha.`,
      `Explora el catálogo de apartamentos en arriendo en Bogotá y guarda favoritos para decidir con calma.`,
    ],
    cta: { label: "Ver apartamentos en arriendo", to: exploreTypePath("apartamento") },
  },
  {
    id: "inmobiliarias-bogota",
    title: "Inmobiliarias en Bogotá: una alternativa más clara",
    paragraphs: [
      `Muchas inmobiliarias en Bogotá cobran comisiones y exponen tu teléfono a decenas de curiosos. ${BRAND.name} concentra listados verificados, filtra interesados y coordina visitas sin que repitas la misma información en cada llamada.`,
      `No somos una inmobiliaria tradicional: somos una plataforma enfocada en arriendos y ventas verificadas en Bogotá, con equipo humano que responde dudas y acompaña hasta firmar contrato.`,
      `Si vienes de portales genéricos o de una inmobiliaria que no te convenció, prueba el explorador con mapa y filtros avanzados.`,
    ],
  },
];

export function arriendosBogotaLinkGrid() {
  const types = listExploreTypePaths().map((path) => ({
    label: path.includes("apartamentos")
      ? "Apartamentos en Bogotá"
      : path.includes("casas")
        ? "Casas en arriendo"
        : "Estudios en Bogotá",
    to: path,
  }));

  const zones = POPULAR_ZONES.map((zone) => ({
    label: `Arriendo en ${zone}`,
    to: exploreZonePath(zone),
  }));

  return { types, zones, compra: { label: "Comprar inmueble", to: EXPLORE_COMPRA_PATH } };
}
