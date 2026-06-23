import { BRAND } from "./brand.js";
import { CITIES, ZONES_BY_CITY } from "./colombia.js";
import { RENTER_FAQ } from "./arriendosBogotaCopy.js";
import { FAQ_PATH, homeFaqSchemaItems } from "./homeSeoCopy.js";
import {
  ARRIENDOS_BOGOTA_PATH,
  EXPLORE_COMPRA_PATH,
  listExploreZonePaths,
  listExploreTypePaths,
  exploreZonePath,
  exploreTypePath,
  parseExplorePath,
  isExplorePath,
} from "./explorePaths.js";
import { getZoneSeoCopy } from "./zoneSeoCopy.js";

/** URL canónica del sitio — configurar VITE_SITE_URL en producción */
export const SITE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_SITE_URL) ||
  "https://habibar.com"
).replace(/\/$/, "");

/** Imagen OG propia — 1200×630 en dominio habibar.com */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-habibar.jpg`;

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Coordenadas para SEO local / GEO */
export const CITY_GEO = {
  Bogotá: { position: "4.7110;-74.0721", placename: "Bogotá, Colombia", latitude: 4.711, longitude: -74.0721 },
};

export const SEO_DEFAULTS = {
  siteName: BRAND.name,
  locale: "es_CO",
  language: "es",
  region: "CO",
  regionDetail: "CO-DC",
  geoPlacename: "Bogotá, Distrito Capital, Colombia",
  geoPosition: "4.7110;-74.0721",
  title: `${BRAND.name} | Arriendos en Bogotá · Apartamentos en alquiler`,
  description:
    "Arriendos en Bogotá: apartamentos, casas y estudios verificados. Alquiler con visitas coordinadas, Match inteligente y atención humana. Alternativa confiable a inmobiliarias en Bogotá.",
  keywords:
    "arriendos en bogotá, apartamento en bogotá, alquiler apartamento bogotá, arriendo apartamentos bogotá, casas en arriendo bogotá, inmobiliarias bogotá, inmuebles bogotá, arriendo bogotá, HABIBAR, inmuebles verificados bogotá",
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: `${BRAND.name} · inmuebles verificados en Bogotá, Colombia`,
  twitterHandle: "@habibar",
};

const NOINDEX_PREFIXES = [
  "/admin",
  "/portal",
  "/inquilino",
  "/propietario",
  "/login",
  "/register",
  "/olvide-contrasena",
  "/forgot-password",
  "/favoritos",
  "/publicar/nuevo",
  "/mi-cuenta",
];

const TYPE_LABELS = {
  apartamento: "Apartamento",
  casa: "Casa",
  estudio: "Estudio",
  habitacion: "Habitación",
  penthouse: "Penthouse",
  duplex: "Dúplex",
  comercial: "Comercial",
};

export const OWNER_FAQ_SCHEMA = [
  {
    q: `¿Por qué arrendar con ${BRAND.name} y no por mi cuenta?`,
    a: `${BRAND.name} administra el proceso completo: filtra interesados, coordina visitas, evalúa candidatos y da seguimiento digital sin exponer tu teléfono.`,
  },
  {
    q: "¿Tengo que hablar con los interesados?",
    a: "No. Respondemos consultas, agendamos visitas y te enviamos resúmenes. Solo te contactamos cuando hay un candidato serio.",
  },
  {
    q: "¿Cuánto cuesta publicar y qué incluye?",
    a: "Publicar es gratis en Bogotá. La administración incluye publicación premium, visitas, estudio de arrendatarios, contratos digitales y cobro de cánones.",
  },
  {
    q: "¿En qué ciudades operan?",
    a: "Operamos en Bogotá, con cobertura en las principales zonas de arriendo.",
  },
];

export const SELL_FAQ_SCHEMA = [
  {
    q: `¿Por qué vender con ${BRAND.name} y no por mi cuenta?`,
    a: "Verificamos tu inmueble, lo exponemos a compradores reales y gestionamos todo el contacto sin exponer tu teléfono.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Publicar es gratis. Los honorarios se explican con transparencia al registrar tu propiedad.",
  },
  {
    q: "¿En qué ciudades operan?",
    a: "Bogotá.",
  },
];

export function absoluteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function buildTitle(pageTitle) {
  if (!pageTitle) return SEO_DEFAULTS.title;
  if (pageTitle.includes(BRAND.name)) return pageTitle;
  return `${pageTitle} | ${BRAND.name}`;
}

export function isNoIndexPath(pathname) {
  return NOINDEX_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function cityGeoMeta(cityName) {
  return CITY_GEO[cityName] || null;
}

function isKnownRoute(pathname) {
  if (isExplorePath(pathname) || pathname === ARRIENDOS_BOGOTA_PATH) return true;
  if (ROUTE_SEO[pathname]) return true;
  if (isNoIndexPath(pathname)) return true;
  if (/^\/propiedad\/[^/]+$/.test(pathname)) return true;
  return false;
}

function formatRent(property) {
  const amount = property.monthly_rent || property.sale_price || 0;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function propertyImage(property) {
  const img = property?.images?.[0];
  if (!img) return SEO_DEFAULTS.ogImage;
  if (/^https?:\/\//i.test(img)) return img;
  return absoluteUrl(img);
}

function exploreCanonical(pathname, searchParams) {
  const path = pathname.replace(/\/$/, "") || "/explorar";
  if (
    path === EXPLORE_COMPRA_PATH ||
    path.startsWith("/explorar/zona/") ||
    listExploreTypePaths().includes(path)
  ) {
    return absoluteUrl(path);
  }
  const allowed = ["city", "intent", "type", "q", "inmueble"];
  const next = new URLSearchParams();
  allowed.forEach((key) => {
    const value = searchParams.get(key);
    if (value) next.set(key, value);
  });
  const qs = next.toString();
  return absoluteUrl(qs ? `/explorar?${qs}` : "/explorar");
}

export function getExploreSeo(searchParams, pathname = "/explorar") {
  const fromPath = parseExplorePath(pathname);
  const city = searchParams.get("city") || fromPath.city || "Bogotá";
  const zoneQuery = searchParams.get("q") || fromPath.q || null;
  const intent = fromPath.intent || searchParams.get("intent");
  const type = searchParams.get("type") || fromPath.type || null;
  const typeLabel = TYPE_LABELS[type] || null;
  const zoneCopy = zoneQuery ? getZoneSeoCopy(zoneQuery) : null;

  const isSale = intent === "compra";

  let title;
  let description;

  if (isSale) {
    title = `Inmuebles en venta en ${city}`;
    description = `Encuentra inmuebles en venta en ${city} con ${BRAND.name}. Listados verificados, fotos reales y acompañamiento humano en todo el proceso de compra.`;
  } else if (zoneCopy) {
    title = zoneCopy.h1;
    description = `${zoneCopy.intro} Listados verificados y visitas coordinadas con ${BRAND.name}.`;
  } else if (type === "apartamento") {
    title = "Alquiler de apartamentos en Bogotá";
    description = `Apartamentos en arriendo y alquiler de apartamento en Bogotá verificados. Filtra por barrio, precio y habitaciones. Visitas coordinadas con ${BRAND.name}.`;
  } else if (type === "casa") {
    title = "Casas en arriendo en Bogotá";
    description = `Casas en arriendo en Bogotá: conjuntos cerrados y vivienda familiar verificada. Agenda visitas y compara zonas con ${BRAND.name}.`;
  } else if (type === "estudio") {
    title = "Estudios en arriendo en Bogotá";
    description = `Estudios y apartamentos pequeños en arriendo en Bogotá. Opciones cerca del trabajo o la universidad, revisadas por ${BRAND.name}.`;
  } else if (typeLabel) {
    title = `${typeLabel}s en arriendo en ${city}`;
    description = `Arrienda ${typeLabel.toLowerCase()}s en ${city} con ${BRAND.name}. Match inteligente, listados verificados y visitas presenciales o virtuales.`;
  } else {
    title = "Arriendos en Bogotá · Apartamentos y casas";
    description = `Arriendos en Bogotá: apartamentos, casas y estudios verificados. Alquiler con Match inteligente, filtros por barrio y visitas coordinadas con ${BRAND.name}.`;
  }

  const geo = cityGeoMeta(city);
  const exploreListUrl = isSale ? EXPLORE_COMPRA_PATH : "/explorar";
  const zoneUrl = zoneQuery ? exploreZonePath(zoneQuery) : exploreListUrl;
  const typeUrl = type ? exploreTypePath(type) : exploreListUrl;

  const keywordParts = [
    isSale ? "venta inmuebles" : "arriendos en bogotá",
    type === "apartamento" ? "alquiler apartamento bogotá, apartamento en bogotá" : null,
    type === "casa" ? "casas en arriendo bogotá" : null,
    zoneQuery ? `arriendo ${zoneQuery}` : null,
    BRAND.name,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title: buildTitle(title),
    description,
    url: exploreCanonical(pathname, searchParams),
    keywords: keywordParts,
    geoPlacename: geo?.placename || SEO_DEFAULTS.geoPlacename,
    geoPosition: geo?.position || SEO_DEFAULTS.geoPosition,
    jsonLd: [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: isSale ? "Compra" : "Arriendos en Bogotá", url: ARRIENDOS_BOGOTA_PATH },
        { name: isSale ? "Compra" : "Explorar", url: exploreListUrl },
        ...(zoneQuery
          ? [{ name: zoneQuery, url: zoneUrl }]
          : type
            ? [{ name: typeLabel || type, url: typeUrl }]
            : []),
      ]),
    ],
  };
}

export function getPropertySeo(property) {
  if (!property) return null;

  const city = property.city || "Colombia";
  const locality = property.locality ? `, ${property.locality}` : "";
  const typeLabel = TYPE_LABELS[property.property_type] || "Inmueble";
  const rent = formatRent(property);
  const geo = cityGeoMeta(property.city);

  const title = `${property.title} · Arriendo ${typeLabel} en ${city}`;
  const description =
    property.description?.slice(0, 155) ||
    `${typeLabel} en arriendo en ${city}${locality}. ${property.bedrooms || 0} hab., ${property.bathrooms || 0} baños${property.area_sqm ? `, ${property.area_sqm} m²` : ""}. Canon ${rent}. Verificado por ${BRAND.name}.`;

  return {
    title: buildTitle(title),
    description,
    image: propertyImage(property),
    imageAlt: `${property.title} · ${typeLabel} en ${city}`,
    url: absoluteUrl(`/propiedad/${property.id}`),
    keywords: `${typeLabel} arriendo ${city}, inmueble ${property.locality || city}, ${BRAND.name}`,
    geoPlacename: geo?.placename || SEO_DEFAULTS.geoPlacename,
    geoPosition: geo?.position || SEO_DEFAULTS.geoPosition,
    ogType: "article",
    jsonLd: [
      organizationSchema(),
      realEstateListingSchema(property),
      breadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Arriendos", url: "/explorar" },
        { name: city, url: property.neighborhood ? exploreZonePath(property.neighborhood) : "/explorar" },
        { name: property.title, url: `/propiedad/${property.id}` },
      ]),
    ],
  };
}

const ROUTE_SEO = {
  "/": {
    title: buildTitle("Arriendos en Bogotá · Apartamentos en alquiler"),
    description: SEO_DEFAULTS.description,
    url: "/",
    keywords: SEO_DEFAULTS.keywords,
    jsonLd: () => [organizationSchema(), websiteSchema(), homeWebPageSchema(), faqSchema(RENTER_FAQ)],
  },
  "/explorar": (searchParams) => getExploreSeo(searchParams),
  [ARRIENDOS_BOGOTA_PATH]: {
    title: buildTitle("Arriendos en Bogotá · Alquiler de apartamentos y casas"),
    description: `Guía de arriendos en Bogotá: apartamentos en alquiler, casas en arriendo e inmuebles verificados. ${BRAND.name} coordina visitas y filtra opciones reales.`,
    url: ARRIENDOS_BOGOTA_PATH,
    keywords:
      "arriendos en bogotá, alquiler apartamento bogotá, apartamento en bogotá, casas en arriendo bogotá, inmobiliarias bogotá",
    jsonLd: () => [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Arriendos en Bogotá", url: ARRIENDOS_BOGOTA_PATH },
      ]),
      faqSchema(RENTER_FAQ),
    ],
  },
  "/anunciar": {
    title: buildTitle("Anuncia tu inmueble · Administración completa de arriendos"),
    description: `Publica gratis tu apartamento o casa en Bogotá. ${BRAND.name} gestiona visitas, candidatos, contratos, cobros y mantenimiento sin exponer tu teléfono.`,
    url: "/anunciar",
    keywords: "administración de arriendos, publicar apartamento, arrendar propiedad Bogotá, propietarios Habibar",
    jsonLd: () => [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Anunciar inmueble", url: "/anunciar" },
      ]),
      faqSchema(OWNER_FAQ_SCHEMA),
    ],
  },
  "/publicar": {
    title: buildTitle("Vende tu inmueble sin perseguir compradores"),
    description: `Vende tu apartamento o casa en Bogotá con ${BRAND.name}. Publicación gratis, compradores verificados, visitas coordinadas y seguimiento hasta cerrar la venta.`,
    url: "/publicar",
    keywords: "venta inmuebles Bogotá, vender apartamento Bogotá, venta casas Bogotá, Habibar",
    jsonLd: () => [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Vender inmueble", url: "/publicar" },
      ]),
      faqSchema(SELL_FAQ_SCHEMA),
    ],
  },
  "/privacidad": {
    title: buildTitle("Política de privacidad"),
    description: `Conoce cómo ${BRAND.name} trata tus datos personales al usar la plataforma de arriendos verificados en Bogotá.`,
    url: "/privacidad",
    keywords: `política de privacidad ${BRAND.name}, protección de datos, RGPD, arriendos Bogotá`,
    jsonLd: () => [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Política de privacidad", url: "/privacidad" },
      ]),
    ],
  },
  [FAQ_PATH]: {
    title: buildTitle("Preguntas frecuentes · Arriendos en Bogotá"),
    description: `Respuestas sobre arriendos verificados, alquiler de apartamentos en Bogotá, Match inteligente, visitas y publicación de inmuebles con ${BRAND.name}.`,
    url: FAQ_PATH,
    keywords:
      "preguntas frecuentes arriendo bogotá, cómo arrendar apartamento bogotá, arriendos verificados, HABIBAR FAQ",
    jsonLd: () => [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Preguntas frecuentes", url: FAQ_PATH },
      ]),
      faqSchema(homeFaqSchemaItems()),
    ],
  },
  "/favoritos": {
    title: buildTitle("Mis inmuebles guardados"),
    description: `Tu lista personal de inmuebles guardados en ${BRAND.name}.`,
    url: "/favoritos",
    noindex: true,
  },
  "/publicar/nuevo": {
    title: buildTitle("Publicar inmueble"),
    description: `Registra tu inmueble en ${BRAND.name} en minutos.`,
    url: "/publicar/nuevo",
    noindex: true,
  },
};

export function resolveRouteSeo(pathname, searchParams = new URLSearchParams()) {
  if (isNoIndexPath(pathname)) {
    return {
      title: buildTitle("Área privada"),
      description: SEO_DEFAULTS.description,
      url: pathname,
      noindex: true,
    };
  }

  if (isExplorePath(pathname)) {
    return getExploreSeo(searchParams, pathname);
  }

  if (/^\/propiedad\/[^/]+$/.test(pathname)) {
    return {
      title: buildTitle("Inmueble"),
      description: SEO_DEFAULTS.description,
      url: pathname,
    };
  }

  const config = ROUTE_SEO[pathname];
  if (!config) {
    if (!isKnownRoute(pathname)) {
      return {
        title: buildTitle("Página no encontrada"),
        description: `La página que buscas no existe en ${BRAND.name}. Explora inmuebles verificados en Bogotá.`,
        url: pathname,
        noindex: true,
      };
    }
    return {
      title: SEO_DEFAULTS.title,
      description: SEO_DEFAULTS.description,
      url: pathname,
      jsonLd: [organizationSchema(), websiteSchema()],
    };
  }

  if (typeof config === "function") {
    return config(searchParams);
  }

  const jsonLd = typeof config.jsonLd === "function" ? config.jsonLd() : config.jsonLd;
  return { ...config, jsonLd };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND.name,
    alternateName: BRAND.short,
    url: SITE_URL,
    logo: absoluteUrl("/habibar-wordmark.png?v=9"),
    description: SEO_DEFAULTS.description,
    email: BRAND.email,
    telephone: BRAND.phone,
    areaServed: CITIES.map((city) => ({
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "Country", name: "Colombia" },
    })),
    knowsAbout: [
      "Arriendos en Bogotá",
      "Alquiler de apartamentos en Bogotá",
      "Casas en arriendo en Bogotá",
      "Inmobiliarias en Bogotá",
      "Arriendo de apartamentos en Bogotá",
      "Venta de inmuebles en Bogotá",
      "Administración de propiedades en Bogotá",
      "Match inteligente de inmuebles",
      "Visitas presenciales y virtuales",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "CO",
      addressLocality: "Bogotá",
      addressRegion: "Cundinamarca",
    },
    serviceArea: {
      "@type": "City",
      name: "Bogotá",
      containedInPlace: { "@type": "AdministrativeArea", name: "Cundinamarca" },
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CITY_GEO.Bogotá.latitude,
      longitude: CITY_GEO.Bogotá.longitude,
    },
    sameAs: [
      `https://wa.me/${BRAND.whatsapp}`,
      BRAND.social?.instagram,
      BRAND.social?.tiktok,
      BRAND.social?.x,
    ].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND.name,
    url: SITE_URL,
    description: SEO_DEFAULTS.description,
    inLanguage: "es-CO",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/explorar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function homeWebPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#homepage`,
    url: SITE_URL,
    name: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "es-CO",
    primaryImageOfPage: SEO_DEFAULTS.ogImage,
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function realEstateListingSchema(property) {
  const isSale = property.listing_intent === "venta" || property.intent === "compra";
  const price = isSale ? property.sale_price : property.monthly_rent;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description || `${property.title} en ${property.city}`,
    url: absoluteUrl(`/propiedad/${property.id}`),
    image: property.images?.length ? property.images : [SEO_DEFAULTS.ogImage],
    datePosted: property.created_date || property.updated_date,
    offers: price
      ? {
          "@type": "Offer",
          price,
          priceCurrency: "COP",
          availability: "https://schema.org/InStock",
          businessFunction: isSale ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut",
        }
      : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.locality || property.city,
      addressRegion: property.city,
      addressCountry: "CO",
    },
    geo: CITY_GEO[property.city]
      ? {
          "@type": "GeoCoordinates",
          latitude: CITY_GEO[property.city].latitude,
          longitude: CITY_GEO[property.city].longitude,
        }
      : undefined,
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: property.area_sqm
      ? { "@type": "QuantitativeValue", value: property.area_sqm, unitCode: "MTK" }
      : undefined,
  };
}

/** URLs estáticas para sitemap.xml */
export function getSitemapUrls() {
  const now = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: ARRIENDOS_BOGOTA_PATH, priority: "0.95", changefreq: "weekly" },
    { loc: "/explorar", priority: "0.9", changefreq: "daily" },
    { loc: EXPLORE_COMPRA_PATH, priority: "0.85", changefreq: "weekly" },
    { loc: "/anunciar", priority: "0.8", changefreq: "weekly" },
    { loc: "/publicar", priority: "0.8", changefreq: "weekly" },
    { loc: "/privacidad", priority: "0.4", changefreq: "yearly" },
    { loc: FAQ_PATH, priority: "0.55", changefreq: "monthly" },
  ];

  listExploreTypePaths().forEach((loc) => {
    urls.push({ loc, priority: "0.88", changefreq: "daily" });
  });

  listExploreZonePaths().forEach((loc) => {
    urls.push({ loc, priority: "0.8", changefreq: "weekly" });
  });

  return urls.map((entry) => ({ ...entry, lastmod: now }));
}
