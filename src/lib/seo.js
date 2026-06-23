import { BRAND } from "./brand.js";
import { CITIES, ZONES_BY_CITY } from "./colombia.js";

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
  title: `${BRAND.name} | Arriendos verificados en Bogotá`,
  description:
    `${BRAND.name} conecta arrendatarios y propietarios en Bogotá, Colombia. Apartamentos y casas verificados, Match inteligente, visitas coordinadas y gestión completa del arriendo.`,
  keywords:
    "HABIBAR, arriendo apartamentos Bogotá, inmuebles verificados Bogotá, arriendo casas Bogotá, venta inmuebles Bogotá, match inteligente arriendo, administración de arriendos Bogotá",
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
  if (pathname === "/explorar" || ROUTE_SEO[pathname]) return true;
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

function exploreCanonical(searchParams) {
  const allowed = ["city", "intent", "type", "q", "inmueble"];
  const next = new URLSearchParams();
  allowed.forEach((key) => {
    const value = searchParams.get(key);
    if (value) next.set(key, value);
  });
  const qs = next.toString();
  return absoluteUrl(qs ? `/explorar?${qs}` : "/explorar");
}

export function getExploreSeo(searchParams) {
  const city = searchParams.get("city") || "Bogotá";
  const intent = searchParams.get("intent");
  const type = searchParams.get("type");
  const typeLabel = TYPE_LABELS[type] || null;

  const isSale = intent === "compra";
  const title = isSale
    ? `Inmuebles en venta en ${city}`
    : typeLabel
      ? `${typeLabel}s en arriendo en ${city}`
      : `Apartamentos en arriendo en ${city}`;

  const description = isSale
    ? `Encuentra inmuebles en venta en ${city} con ${BRAND.name}. Listados verificados, fotos reales y acompañamiento humano en todo el proceso de compra.`
    : `Arrienda ${typeLabel ? `${typeLabel.toLowerCase()}s` : "apartamentos y casas"} en ${city} con ${BRAND.name}. Match inteligente, listados verificados y visitas presenciales o virtuales.`;

  const geo = cityGeoMeta(city);

  return {
    title: buildTitle(title),
    description,
    url: exploreCanonical(searchParams),
    keywords: `${isSale ? "venta" : "arriendo"} inmuebles ${city}, apartamentos ${city}, casas ${city}, ${BRAND.name}`,
    geoPlacename: geo?.placename || SEO_DEFAULTS.geoPlacename,
    geoPosition: geo?.position || SEO_DEFAULTS.geoPosition,
    jsonLd: [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: isSale ? "Compra" : "Arriendos", url: "/explorar" },
        { name: city, url: `/explorar?city=${encodeURIComponent(city)}` },
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

  const title = `${property.title} · ${typeLabel} en ${city}`;
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
        { name: city, url: `/explorar?city=${encodeURIComponent(city)}` },
        { name: property.title, url: `/propiedad/${property.id}` },
      ]),
    ],
  };
}

const ROUTE_SEO = {
  "/": {
    title: buildTitle("Arriendos verificados en Bogotá"),
    description: SEO_DEFAULTS.description,
    url: "/",
    keywords: SEO_DEFAULTS.keywords,
    jsonLd: () => [organizationSchema(), websiteSchema(), homeWebPageSchema()],
  },
  "/explorar": (searchParams) => getExploreSeo(searchParams),
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

  if (pathname === "/explorar") {
    return getExploreSeo(searchParams);
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
        urlTemplate: `${SITE_URL}/explorar?city={city}&q={search_term_string}`,
      },
      "query-input": ["required name=city", "required name=search_term_string"],
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
    { loc: "/explorar", priority: "0.9", changefreq: "daily" },
    { loc: "/anunciar", priority: "0.8", changefreq: "weekly" },
    { loc: "/publicar", priority: "0.8", changefreq: "weekly" },
  ];

  CITIES.forEach((city) => {
    urls.push({
      loc: `/explorar?city=${encodeURIComponent(city.name)}`,
      priority: "0.85",
      changefreq: "daily",
    });
    urls.push({
      loc: `/explorar?city=${encodeURIComponent(city.name)}&intent=compra`,
      priority: "0.75",
      changefreq: "weekly",
    });
    (ZONES_BY_CITY[city.name] || []).forEach((zone) => {
      urls.push({
        loc: `/explorar?city=${encodeURIComponent(city.name)}&q=${encodeURIComponent(zone)}`,
        priority: "0.7",
        changefreq: "weekly",
      });
    });
  });

  return urls.map((entry) => ({ ...entry, lastmod: now }));
}
