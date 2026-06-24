/**
 * Genera HTML estático (SSG) tras `vite build` para crawlers, IAs y SEO.
 * Cada ruta pública recibe su propio index.html con meta tags y contenido legible.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_PROPERTIES } from "../src/api/mockData.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(root, "..", "dist");

function loadEnvFile() {
  for (const name of [".env.local", ".env"]) {
    const envPath = path.join(root, "..", name);
    if (!existsSync(envPath)) continue;
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnvFile();

const SITE = (process.env.VITE_SITE_URL || "https://habibar.com").replace(/\/$/, "");

const {
  resolveRouteSeo,
  getPropertySeo,
  getSitemapUrls,
  SEO_DEFAULTS,
} = await import("../src/lib/seo.js");

const { buildHomeStaticHtml, buildFaqStaticHtml, seoNavBlock, seoFooterBlock } = await import("../src/lib/seoStaticContent.js");
const { FAQ_PATH } = await import("../src/lib/homeSeoCopy.js");
const { EXPLORE_COMPRA_PATH, ARRIENDOS_BOGOTA_PATH, listExploreZonePaths, listExploreTypePaths } = await import("../src/lib/explorePaths.js");
const { ARRIENDOS_BOGOTA_SECTIONS } = await import("../src/lib/arriendosBogotaCopy.js");

const TYPE_LABELS = {
  apartamento: "Apartamento",
  casa: "Casa",
  estudio: "Estudio",
  habitacion: "Habitación",
  penthouse: "Penthouse",
  duplex: "Dúplex",
  comercial: "Comercial",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatCop(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

async function loadBuildProperties() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(url, key, { auth: { persistSession: false } });
      const { data, error } = await sb
        .from("property")
        .select("*")
        .eq("status", "disponible")
        .order("created_date", { ascending: false })
        .limit(200);
      if (!error && Array.isArray(data) && data.length > 0) {
        console.log(`Prerender: ${data.length} inmuebles desde Supabase`);
        return data;
      }
      if (error) console.warn("Prerender Supabase:", error.message);
    } catch (err) {
      console.warn("Prerender Supabase falló, usando datos demo:", err.message);
    }
  }

  const demo = SEED_PROPERTIES.filter((p) => p.status === "disponible");
  console.log(`Prerender: ${demo.length} inmuebles demo`);
  return demo;
}

function replaceMeta(html, attr, key, content) {
  if (!content) return html;
  const escaped = escapeHtml(content);
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/>`, "i");
  if (re.test(html)) return html.replace(re, `<meta ${attr}="${key}" content="${escaped}" />`);
  return html.replace("</head>", `    <meta ${attr}="${key}" content="${escaped}" />\n  </head>`);
}

function replaceTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function replaceCanonical(html, href) {
  const escaped = escapeHtml(href);
  if (/<link rel="canonical"/i.test(html)) {
    return html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${escaped}" />`);
  }
  return html.replace("</head>", `    <link rel="canonical" href="${escaped}" />\n  </head>`);
}

function injectJsonLd(html, jsonLd) {
  const blocks = (jsonLd || []).filter(Boolean);
  const scripts =
    blocks.length > 0
      ? blocks
          .map(
            (block, index) =>
              `\n    <script type="application/ld+json" id="prerender-json-ld-${index}">\n${JSON.stringify(block, null, 2)}\n    </script>`
          )
          .join("")
      : "";

  let next = html.replace(/\s*<script type="application\/ld\+json"[\s\S]*?<\/script>/gi, "");
  if (scripts) next = next.replace("</head>", `${scripts}\n  </head>`);
  return next;
}

function replaceRoot(html, body) {
  return html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">\n${body}\n    </div>`
  );
}

function toAbsolute(url) {
  if (!url) return SITE;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE}${url.startsWith("/") ? url : `/${url}`}`;
}

function applySeo(html, seo) {
  const absoluteUrl = toAbsolute(seo.url);
  const image = seo.image || SEO_DEFAULTS.ogImage;
  const robots = seo.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large";

  let next = replaceTitle(html, seo.title);
  next = replaceMeta(next, "name", "description", seo.description);
  next = replaceMeta(next, "name", "keywords", seo.keywords || SEO_DEFAULTS.keywords);
  next = replaceMeta(next, "name", "robots", robots);
  next = replaceMeta(next, "name", "geo.placename", seo.geoPlacename || SEO_DEFAULTS.geoPlacename);
  next = replaceMeta(next, "name", "geo.position", seo.geoPosition || SEO_DEFAULTS.geoPosition);
  next = replaceMeta(next, "property", "og:type", seo.ogType || "website");
  next = replaceMeta(next, "property", "og:title", seo.title);
  next = replaceMeta(next, "property", "og:description", seo.description);
  next = replaceMeta(next, "property", "og:image", image);
  next = replaceMeta(next, "property", "og:image:alt", seo.imageAlt || SEO_DEFAULTS.ogImageAlt);
  next = replaceMeta(next, "property", "og:url", absoluteUrl);
  next = replaceMeta(next, "name", "twitter:title", seo.title);
  next = replaceMeta(next, "name", "twitter:description", seo.description);
  next = replaceMeta(next, "name", "twitter:image", image);
  next = replaceCanonical(next, absoluteUrl);
  next = injectJsonLd(next, seo.jsonLd);
  return next;
}

function navBlock() {
  return seoNavBlock();
}

function homeBody(properties) {
  return buildHomeStaticHtml(properties);
}

function exploreBody(properties, pathname = "/explorar") {
  const seo = resolveRouteSeo(pathname);
  const h1 = seo.title.includes("|") ? seo.title.split("|")[0].trim() : seo.title;
  const intro = seo.description;
  const items = properties
    .slice(0, 12)
    .map((p) => {
      const price = formatCop(p.monthly_rent || p.sale_price);
      return `<li><a href="/propiedad/${escapeHtml(p.id)}">${escapeHtml(p.title)}</a> — ${escapeHtml(p.city)} · ${price}</li>`;
    })
    .join("\n          ");

  return `
      <main id="static-site-fallback" lang="es-CO">
        <header>
          <h1>${escapeHtml(h1)}</h1>
          <p>${escapeHtml(intro)}</p>
        </header>
        ${navBlock()}
        <section>
          <h2>Inmuebles destacados en arriendo</h2>
          <p>
            Cada listado incluye fotos revisadas, datos del inmueble y opción de visita presencial o virtual.
            Si buscas comprar, visita la sección de <a href="${EXPLORE_COMPRA_PATH}">inmuebles en venta</a>.
          </p>
          <ul>
          ${items}
          </ul>
          <p><a href="/explorar">Ver catálogo completo de arriendos verificados</a></p>
        </section>
        ${seoFooterBlock()}
      </main>`;
}

function marketingBody({ h1, intro, ctaHref, ctaLabel }) {
  return `
      <main id="static-site-fallback" lang="es-CO">
        <header>
          <h1>${escapeHtml(h1)}</h1>
          <p>${escapeHtml(intro)}</p>
        </header>
        ${navBlock()}
        <p><a href="${escapeHtml(ctaHref)}">${escapeHtml(ctaLabel)}</a></p>
        ${seoFooterBlock()}
      </main>`;
}

function propertyBody(property) {
  const typeLabel = TYPE_LABELS[property.property_type] || "Inmueble";
  const price = formatCop(property.monthly_rent || property.sale_price);
  const locality = property.locality ? `, ${property.locality}` : "";
  const specs = [
    property.bedrooms != null ? `${property.bedrooms} habitaciones` : null,
    property.bathrooms != null ? `${property.bathrooms} baños` : null,
    property.area_sqm ? `${property.area_sqm} m²` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return `
      <main id="static-site-fallback" lang="es-CO" itemscope itemtype="https://schema.org/RealEstateListing">
        <header>
          <h1 itemprop="name">${escapeHtml(property.title)}</h1>
          <p><strong>${escapeHtml(typeLabel)}</strong> en ${escapeHtml(property.city)}${escapeHtml(locality)}</p>
          <p itemprop="price">${price}${property.monthly_rent ? " / mes" : ""}</p>
          ${specs ? `<p>${escapeHtml(specs)}</p>` : ""}
        </header>
        ${navBlock()}
        <section>
          <h2>Descripción</h2>
          <p itemprop="description">${escapeHtml(property.description || `${property.title} en ${property.city}.`)}</p>
        </section>
        <p><a href="/explorar?inmueble=${escapeHtml(property.id)}">Ver ficha interactiva y agendar visita</a></p>
        ${seoFooterBlock()}
      </main>`;
}

function writePage(relativeDir, html) {
  const dir = path.join(distDir, relativeDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html, "utf8");
}

function writeSitemap(properties) {
  const baseUrls = getSitemapUrls();
  const propertyUrls = properties
    .filter((p) => p.status === "disponible")
    .map((p) => ({
      loc: `/propiedad/${p.id}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: (p.updated_date || p.created_date || new Date().toISOString()).slice(0, 10),
    }));

  const urls = [...baseUrls, ...propertyUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((entry) => {
    const href = `${SITE}${entry.loc.startsWith("/") ? entry.loc : `/${entry.loc}`}`.replace(/&/g, "&amp;");
    return `  <url><loc>${href}</loc><lastmod>${entry.lastmod}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`;
  })
  .join("\n")}
</urlset>
`;
  writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf8");
  console.log(`Sitemap: ${urls.length} URLs (incl. ${propertyUrls.length} inmuebles)`);
}

function arriendosBogotaBody() {
  const sections = ARRIENDOS_BOGOTA_SECTIONS.map(
    (section) => `
        <section aria-labelledby="${section.id}">
          <h2 id="${section.id}">${escapeHtml(section.title)}</h2>
          ${section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n          ")}
        </section>`
  ).join("");

  return `
      <main id="static-site-fallback" lang="es-CO">
        <header>
          <h1>Arriendos en Bogotá: apartamentos, casas y alquiler verificado</h1>
          <p>Encuentra apartamento en Bogotá, alquiler de apartamento verificado y casas en arriendo con ${escapeHtml(SEO_DEFAULTS.siteName)}.</p>
        </header>
        ${seoNavBlock()}
        ${sections}
        <p><a href="/explorar">Explorar arriendos en Bogotá</a></p>
        ${seoFooterBlock()}
      </main>`;
}

async function main() {
  if (!existsSync(path.join(distDir, "index.html"))) {
    console.error("Prerender: ejecuta vite build antes (falta dist/index.html)");
    process.exit(1);
  }

  const template = readFileSync(path.join(distDir, "index.html"), "utf8");
  const properties = await loadBuildProperties();
  let count = 0;

  const routes = [
    { dir: "", pathname: "/", body: homeBody(properties) },
    { dir: "explorar", pathname: "/explorar", body: exploreBody(properties, "/explorar") },
    {
      dir: path.join("explorar", "compra"),
      pathname: EXPLORE_COMPRA_PATH,
      body: exploreBody(properties, EXPLORE_COMPRA_PATH),
    },
    {
      dir: "arriendos-bogota",
      pathname: ARRIENDOS_BOGOTA_PATH,
      body: arriendosBogotaBody(),
    },
    {
      dir: "anunciar",
      pathname: "/anunciar",
      body: marketingBody({
        h1: "Anuncia tu inmueble — Administración completa",
        intro: "Publica gratis en Bogotá. HABIBAR gestiona visitas, candidatos, contratos y cobros.",
        ctaHref: "/publicar/nuevo",
        ctaLabel: "Registrar inmueble",
      }),
    },
    {
      dir: "publicar",
      pathname: "/publicar",
      body: marketingBody({
        h1: "Vende tu inmueble sin perseguir compradores",
        intro: "Publicación gratis, compradores verificados y visitas coordinadas en Bogotá.",
        ctaHref: "/publicar/nuevo",
        ctaLabel: "Vender mi inmueble",
      }),
    },
    {
      dir: "privacidad",
      pathname: "/privacidad",
      body: marketingBody({
        h1: "Política de privacidad",
        intro: `${escapeHtml(SEO_DEFAULTS.siteName)} trata tus datos para prestarte el servicio de arriendos verificados, coordinar visitas y gestionar publicaciones. Consulta el documento completo en la aplicación.`,
        ctaHref: "/",
        ctaLabel: "Volver al inicio",
      }),
    },
    {
      dir: "preguntas-frecuentes",
      pathname: FAQ_PATH,
      body: buildFaqStaticHtml(),
    },
  ];

  listExploreZonePaths().forEach((zonePath) => {
    const slug = zonePath.replace("/explorar/zona/", "");
    routes.push({
      dir: path.join("explorar", "zona", slug),
      pathname: zonePath,
      body: exploreBody(properties, zonePath),
    });
  });

  listExploreTypePaths().forEach((typePath) => {
    const slug = typePath.replace("/explorar/", "");
    routes.push({
      dir: path.join("explorar", slug),
      pathname: typePath,
      body: exploreBody(properties, typePath),
    });
  });

  for (const route of routes) {
    const seo = resolveRouteSeo(route.pathname);
    let html = applySeo(template, seo);
    html = replaceRoot(html, route.body);
    if (route.dir) writePage(route.dir, html);
    else writeFileSync(path.join(distDir, "index.html"), html, "utf8");
    count += 1;
  }

  for (const property of properties) {
    if (property.status !== "disponible") continue;
    const seo = getPropertySeo(property);
    if (!seo) continue;
    let html = applySeo(template, seo);
    html = replaceRoot(html, propertyBody(property));
    writePage(`propiedad/${property.id}`, html);
    count += 1;
  }

  writeSitemap(properties);
  console.log(`Prerender SSG: ${count} páginas HTML generadas en dist/`);
}

main().catch((err) => {
  console.error("Prerender falló:", err);
  process.exit(1);
});
