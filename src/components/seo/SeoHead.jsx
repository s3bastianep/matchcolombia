import { useEffect, useMemo } from "react";
import { SEO_DEFAULTS } from "@/lib/seo";

function upsertMeta(attr, key, content) {
  if (!content) return null;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("data-seo-managed", "true");
  el.setAttribute("content", content);
  return el;
}

function upsertLink(rel, href) {
  if (!href) return null;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("data-seo-managed", "true");
  el.setAttribute("href", href);
  return el;
}

function upsertJsonLd(id, data) {
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }
  const el = existing || document.createElement("script");
  el.id = id;
  el.type = "application/ld+json";
  el.setAttribute("data-seo-managed", "true");
  el.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(el);
}

/**
 * Actualiza title, meta, canonical, Open Graph, Twitter y JSON-LD por ruta.
 */
export default function SeoHead({
  title = SEO_DEFAULTS.title,
  description = SEO_DEFAULTS.description,
  keywords = SEO_DEFAULTS.keywords,
  image = SEO_DEFAULTS.ogImage,
  url,
  noindex = false,
  jsonLd = [],
}) {
  const jsonLdKey = useMemo(() => JSON.stringify(jsonLd), [jsonLd]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keywords);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    upsertMeta("name", "author", SEO_DEFAULTS.siteName);
    upsertMeta("name", "geo.region", "CO");
    upsertMeta("name", "geo.placename", SEO_DEFAULTS.geoPlacename);

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SEO_DEFAULTS.siteName);
    upsertMeta("property", "og:locale", SEO_DEFAULTS.locale);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", image);
    if (url) upsertMeta("property", "og:url", url);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    if (url) upsertLink("canonical", url);

    jsonLd.forEach((block, index) => {
      upsertJsonLd(`seo-jsonld-${index}`, block);
    });

    const maxLd = Math.max(jsonLd.length, 8);
    for (let i = jsonLd.length; i < maxLd; i += 1) {
      document.getElementById(`seo-jsonld-${i}`)?.remove();
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, keywords, image, url, noindex, jsonLdKey]);

  return null;
}
