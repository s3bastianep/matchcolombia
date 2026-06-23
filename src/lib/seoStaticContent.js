import { BRAND } from "./brand.js";
import {
  ARRIENDOS_BOGOTA_PATH,
  EXPLORE_COMPRA_PATH,
  exploreZonePath,
  exploreTypePath,
  listExploreTypePaths,
} from "./explorePaths.js";
import { HOME_SEO_SECTIONS } from "./homeSeoCopy.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function seoNavBlock() {
  const zones = ["Chapinero", "Usaquén", "Teusaquillo", "Suba", "Kennedy", "Engativá"];
  const zoneLinks = zones
    .map(
      (zone) =>
        `<li><a href="${exploreZonePath(zone)}">Arriendo en ${escapeHtml(zone)}</a></li>`
    )
    .join("\n          ");

  const typeLinks = listExploreTypePaths()
    .map((path) => {
      const label = path.includes("apartamentos")
        ? "Apartamentos en Bogotá"
        : path.includes("casas")
          ? "Casas en arriendo"
          : "Estudios en Bogotá";
      return `<li><a href="${path}">${escapeHtml(label)}</a></li>`;
    })
    .join("\n          ");

  return `
      <nav aria-label="Navegación principal">
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="${ARRIENDOS_BOGOTA_PATH}">Arriendos en Bogotá</a></li>
          <li><a href="/explorar">Explorar inmuebles en arriendo</a></li>
          <li><a href="${exploreTypePath("apartamento")}">Alquiler de apartamentos</a></li>
          <li><a href="${EXPLORE_COMPRA_PATH}">Comprar inmueble en Bogotá</a></li>
          <li><a href="/anunciar">Publicar inmueble en arriendo</a></li>
          <li><a href="/publicar">Vender apartamento o casa</a></li>
          <li><a href="/privacidad">Política de privacidad</a></li>
        </ul>
      </nav>
      <nav aria-label="Tipos de inmueble">
        <p class="seo-nav-label">Arriendos por tipo en Bogotá</p>
        <ul>
          ${typeLinks}
        </ul>
      </nav>
      <nav aria-label="Barrios populares">
        <p class="seo-nav-label">Barrios populares en Bogotá</p>
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
        <p>Contacto: <a href="mailto:${escapeHtml(BRAND.email)}">${escapeHtml(BRAND.email)}</a> · <a href="/privacidad">Política de privacidad</a></p>
      </footer>`;
}

function seoSectionsHtml() {
  return HOME_SEO_SECTIONS.map(
    (section) => `
        <section aria-labelledby="${section.id}">
          <h2 id="${section.id}">${escapeHtml(section.title)}</h2>
          ${section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n          ")}
        </section>`
  ).join("");
}

/**
 * HTML estático para crawlers y SEO (home).
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
          <h2 id="static-listings">Inmuebles verificados disponibles hoy</h2>
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
          <h1>Arriendos en Bogotá · Apartamentos y casas verificados</h1>
          <p>
            <strong>${escapeHtml(BRAND.name)}</strong> conecta arrendatarios y propietarios con apartamentos, casas y estudios en arriendo en Bogotá, Colombia.
            Alquiler de apartamento verificado, Match inteligente según tu presupuesto y zona, y visitas coordinadas por nuestro equipo humano.
          </p>
        </header>
        ${seoNavBlock()}
        ${seoSectionsHtml()}
        ${listingsBlock}
        ${seoFooterBlock()}
      </main>`;
}
