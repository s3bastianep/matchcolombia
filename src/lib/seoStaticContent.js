import { BRAND } from "./brand.js";
import { ZONES_BY_CITY } from "./colombia.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function seoNavBlock() {
  const zones = (ZONES_BY_CITY.Bogotá || []).slice(0, 6);
  const zoneLinks = zones
    .map(
      (zone) =>
        `<li><a href="/explorar?city=Bogot%C3%A1&amp;q=${encodeURIComponent(zone)}">Arriendo en ${escapeHtml(zone)}</a></li>`
    )
    .join("\n          ");

  return `
      <nav aria-label="Navegación principal">
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/explorar">Explorar inmuebles en arriendo</a></li>
          <li><a href="/explorar?intent=compra">Comprar inmueble en Bogotá</a></li>
          <li><a href="/anunciar">Publicar inmueble en arriendo</a></li>
          <li><a href="/publicar">Vender apartamento o casa</a></li>
          <li><a href="/login">Iniciar sesión</a></li>
        </ul>
      </nav>
      <nav aria-label="Zonas de arriendo en Bogotá">
        <h2>Zonas de arriendo en Bogotá</h2>
        <ul>
          ${zoneLinks}
        </ul>
      </nav>`;
}

export function seoFooterBlock() {
  const instagram = BRAND.social?.instagram;
  const external = instagram
    ? `<p>Síguenos en <a href="${escapeHtml(instagram)}" rel="noopener noreferrer" target="_blank">Instagram de ${escapeHtml(BRAND.name)}</a> y conoce más sobre el mercado inmobiliario en <a href="https://es.wikipedia.org/wiki/Bogot%C3%A1" rel="noopener noreferrer" target="_blank">Bogotá</a>.</p>`
    : `<p>Conoce más sobre la ciudad en <a href="https://es.wikipedia.org/wiki/Bogot%C3%A1" rel="noopener noreferrer" target="_blank">Bogotá</a>.</p>`;

  return `
      <footer>
        ${external}
        <p>Contacto: <a href="mailto:${escapeHtml(BRAND.email)}">${escapeHtml(BRAND.email)}</a></p>
      </footer>`;
}

/**
 * HTML estático para crawlers y SEO (home). Objetivo: 250+ palabras, varios párrafos y enlaces internos.
 */
export function buildHomeStaticHtml(properties = []) {
  const propertyLinks = properties
    .filter((p) => p.status === "disponible")
    .slice(0, 8)
    .map((p) => `<li><a href="/propiedad/${escapeHtml(p.id)}">${escapeHtml(p.title)}</a></li>`)
    .join("\n          ");

  const listingsBlock = propertyLinks
    ? `
        <section aria-labelledby="static-listings">
          <h2 id="static-listings">Inmuebles verificados disponibles</h2>
          <p>Explora apartamentos y casas en arriendo en Bogotá con fotos reales y datos revisados por nuestro equipo.</p>
          <ul>
          ${propertyLinks}
          </ul>
          <p><a href="/explorar">Ver todos los inmuebles en arriendo</a></p>
        </section>`
    : "";

  return `
      <main id="static-site-fallback" lang="es-CO">
        <header>
          <h1>Arriendos verificados en Bogotá</h1>
          <p>
            <strong>${escapeHtml(BRAND.name)}</strong> es la plataforma para encontrar apartamentos y casas verificados en Bogotá, Colombia.
            Conectamos arrendatarios y propietarios con listados revisados, Match inteligente según tu presupuesto y zona, y visitas coordinadas por nuestro equipo humano.
          </p>
        </header>
        ${seoNavBlock()}
        <section aria-labelledby="static-renters">
          <h2 id="static-renters">Arrienda con confianza en Bogotá</h2>
          <p>
            Buscar arriendo en Bogotá puede ser agotador cuando los anuncios no coinciden con la realidad o nadie responde a tiempo.
            En ${escapeHtml(BRAND.name)} publicamos inmuebles verificados: revisamos fotos, datos y disponibilidad antes de mostrarlos en el catálogo.
          </p>
          <p>
            Usa el <a href="/explorar">explorador de inmuebles</a> con mapa y filtros por barrio, tipo de inmueble, habitaciones y presupuesto.
            El Match inteligente te sugiere opciones según lo que buscas, sin perder horas revisando listados que no encajan contigo.
          </p>
          <p>
            Cuando encuentres un apartamento o casa que te guste, agenda una visita presencial o virtual.
            Coordinamos horarios, confirmamos asistencia y te acompañamos hasta que firmes contrato con tranquilidad.
          </p>
        </section>
        <section aria-labelledby="static-owners">
          <h2 id="static-owners">Publica y administra tu inmueble</h2>
          <p>
            Si eres propietario, puedes <a href="/anunciar">publicar tu inmueble en arriendo</a> sin costo inicial en Bogotá.
            Nos encargamos de responder consultas, filtrar candidatos, gestionar visitas y el seguimiento del contrato sin exponer tu teléfono personal.
          </p>
          <p>
            También ayudamos a <a href="/publicar">vender apartamentos y casas</a> con compradores verificados, visitas organizadas y acompañamiento hasta cerrar la negociación.
          </p>
        </section>
        <section aria-labelledby="static-zones">
          <h2 id="static-zones">Zonas de arriendo en Bogotá</h2>
          <p>
            Tenemos cobertura en barrios como Chapinero, Usaquén, Teusaquillo, Suba, Kennedy, Engativá, La Candelaria y Santa Fe.
            Cada zona tiene apartamentos, estudios y casas en arriendo y, en algunos casos, opciones en venta para quien busca invertir o mudarse definitivamente.
          </p>
        </section>
        ${listingsBlock}
        ${seoFooterBlock()}
      </main>`;
}
