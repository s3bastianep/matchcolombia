import { BRAND } from "./brand.js";
import { EXPLORE_COMPRA_PATH } from "./explorePaths.js";

/** Ruta pública de preguntas frecuentes / contenido informativo SEO. */
export const FAQ_PATH = "/preguntas-frecuentes";
export const HOME_SEO_SECTIONS = [
  {
    id: "que-es-habibar",
    title: `Qué es ${BRAND.name} y cómo ayuda a arrendar en Bogotá`,
    paragraphs: [
      `${BRAND.name} es una plataforma de arriendos verificados en Bogotá enfocada en apartamentos, casas y estudios listos para visitar. Cada publicación pasa por una revisión humana de fotos, precios y disponibilidad antes de aparecer en el catálogo.`,
      `Si buscas el lugar que existe y está aquí, puedes filtrar por barrio, presupuesto, habitaciones y mascotas. El Match inteligente ordena opciones según lo que marcaste como importante, para que no pierdas tiempo con anuncios que no encajan.`,
      `Nuestro equipo coordina visitas presenciales o virtuales, confirma horarios y da seguimiento hasta que firmes contrato. La atención es humana: respondemos por chat, correo y WhatsApp sin bots ni respuestas automáticas.`,
    ],
  },
  {
    id: "arriendos-verificados",
    title: "Arriendos verificados en Bogotá: qué revisamos",
    paragraphs: [
      `Un arriendo verificado en ${BRAND.name} significa que validamos identidad del anunciante, coherencia entre fotos y descripción, y que el inmueble sigue disponible. Evitamos portales llenos de avisos fantasma o precios que cambian al llegar a la visita.`,
      `Puedes explorar inmuebles en Chapinero, Usaquén, Teusaquillo, Suba, Kennedy, Engativá, La Candelaria, Santa Fe y Fontibón. Publicamos estudios, apartamentos familiares y casas en conjunto cerrado, con datos de administración y parqueadero cuando aplica.`,
      `Para comprar en lugar de arrendar, visita nuestra sección de compra de inmuebles. Allí encontrarás opciones en venta con el mismo estándar de revisión y acompañamiento en visitas.`,
    ],
  },
  {
    id: "propietarios",
    title: "Publicar inmueble en arriendo o venta sin perseguir interesados",
    paragraphs: [
      `Los propietarios usan ${BRAND.name} para publicar gratis en Bogotá y delegar el contacto inicial. Filtramos curiosos, respondemos preguntas frecuentes y agendamos visitas con candidatos que cumplen requisitos básicos de ingresos y tiempo de arriendo.`,
      `La administración incluye seguimiento de contratos, recordatorios de pago y canal de soporte para inquilinos y propietarios. Si vendes, preparamos la ficha, coordinamos visitas y te resumimos el interés real sin exponer tu teléfono en portales abiertos.`,
      `Registrar un inmueble toma pocos minutos: subes fotos, defines canon o precio de venta, indicas reglas sobre mascotas y fecha de entrega. El equipo revisa y publica en menos de un día hábil cuando la información está completa.`,
    ],
  },
  {
    id: "match-inteligente",
    title: "Match inteligente y visitas coordinadas",
    paragraphs: [
      `El Match inteligente de ${BRAND.name} guarda tus preferencias de zona, presupuesto, tipo de inmueble y mascotas. Cada vez que entras al explorador, priorizamos listados que cumplen esos criterios y te mostramos un porcentaje de encaje en la ficha.`,
      `Las visitas se agendan en línea con horarios reales del equipo. Confirmamos contigo antes de ir al inmueble y, si necesitas reprogramar, lo haces desde el mismo enlace sin llamadas eternas.`,
      `Tanto arrendatarios como propietarios reciben recordatorios y resumen por correo. Así reduces ausencias y aceleras la decisión cuando el apartamento o la casa sí cumple lo que buscas en Bogotá.`,
    ],
  },
  {
    id: "preguntas-frecuentes",
    title: "Preguntas frecuentes sobre arriendo en Bogotá",
    paragraphs: [
      `¿Cuánto cuesta usar ${BRAND.name}? Explorar y guardar favoritos es gratuito. Publicar un inmueble en arriendo no tiene costo de entrada en Bogotá; los honorarios de administración se explican con transparencia al registrar la propiedad.`,
      `¿Puedo arrendar con mascotas? Sí, cuando el propietario lo permite. Usa el filtro de mascotas en el explorador y revisa las reglas en cada ficha antes de agendar visita.`,
      `¿Cómo sé que un anuncio es real? Los listados verificados muestran sello de revisión ${BRAND.name}. Si un dato no cuadra en la visita, repórtalo al equipo y retiramos o corregimos la publicación.`,
      `¿Atienden solo Bogotá? Sí, el lanzamiento cubre Bogotá y principales localidades del norte, centro y occidente. Ampliamos barrios según demanda de propietarios e inquilinos verificados.`,
    ],
  },
  {
    id: "alquiler-apartamentos",
    title: "Alquiler de apartamento en Bogotá",
    paragraphs: [
      `El alquiler de apartamento en Bogotá es una de las búsquedas más frecuentes en la ciudad. Los precios varían según barrio, estrato, parqueadero y antigüedad del edificio.`,
      `En ${BRAND.name} puedes comparar apartamentos en arriendo en Chapinero, Usaquén, Suba, Kennedy y más zonas sin perder tiempo en anuncios duplicados o precios que cambian al llegar a la visita.`,
      `Usa filtros de habitaciones, mascotas y presupuesto para ver solo apartamentos en Bogotá que encajan contigo. El equipo coordina la visita y te acompaña si tienes dudas.`,
    ],
  },
  {
    id: "inmobiliarias-bogota",
    title: "Inmobiliarias en Bogotá y arriendos verificados",
    paragraphs: [
      `Si buscas inmobiliarias en Bogotá, también puedes usar ${BRAND.name}: una plataforma enfocada en arriendos y ventas con listados revisados antes de publicarse.`,
      `A diferencia de muchas inmobiliarias tradicionales, filtramos interesados, respondemos consultas frecuentes y agendamos visitas sin exponer tu teléfono en portales abiertos.`,
      `Tanto si arriendas como si publicas, el proceso es digital y con acompañamiento humano en Bogotá. Explora el catálogo o registra tu inmueble gratis.`,
    ],
  },
  {
    id: "barrios-bogota",
    title: "Barrios donde más buscan arriendo en Bogotá",
    paragraphs: [
      `Chapinero concentra apartamentos modernos cerca de zonas gastronómicas y oficinas; es ideal si priorizas movilidad y vida urbana. Usaquén ofrece calles residenciales, casas amplias y buena oferta familiar en el norte de la ciudad.`,
      `Teusaquillo combina arquitectura clásica con parques y vías principales; Suba y Kennedy tienen gran inventario de conjuntos cerrados con parqueadero y zonas comunes. Engativá y Fontibón son opciones con buen acceso al aeropuerto y precios competitivos.`,
      `En el centro, La Candelaria y Santa Fe atraen a quienes buscan estudios o apartamentos pequeños cerca de universidades y oficinas del centro histórico. En cada barrio puedes filtrar por canon, habitaciones, mascotas y fecha de entrega desde el explorador de ${BRAND.name}.`,
      `Si aún no defines barrio, prueba el Match inteligente: en pocos minutos indicas presupuesto, tipo de inmueble y prioridades, y te mostramos opciones ordenadas por compatibilidad. Así comparas Chapinero, Usaquén u otras zonas sin abrir decenas de pestañas en portales genéricos.`,
    ],
  },
];

export function homeFaqSchemaItems() {
  const section = HOME_SEO_SECTIONS.find((s) => s.id === "preguntas-frecuentes");
  if (!section) return [];
  return section.paragraphs
    .filter((p) => p.startsWith("¿"))
    .map((p) => {
      const split = p.indexOf("? ");
      return split === -1
        ? { q: p, a: "" }
        : { q: p.slice(0, split + 1), a: p.slice(split + 2) };
    });
}

export function countHomeSeoWords() {
  const text = HOME_SEO_SECTIONS.flatMap((s) => [s.title, ...s.paragraphs]).join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
