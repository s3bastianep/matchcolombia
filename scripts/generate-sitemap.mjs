import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CITIES, ZONES_BY_CITY } from "../src/lib/colombia.js";

const SITE_URL = (process.env.VITE_SITE_URL || "https://habibar.com").replace(/\/$/, "");
const now = new Date().toISOString().slice(0, 10);

function getUrls() {
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

  return urls;
}

function xmlLoc(loc) {
  const href = `${SITE_URL}${loc.startsWith("/") ? loc : `/${loc}`}`;
  return href.replace(/&/g, "&amp;");
}

const urls = getUrls();
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) =>
      `  <url><loc>${xmlLoc(entry.loc)}</loc><lastmod>${now}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`
  )
  .join("\n")}
</urlset>
`;

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log(`Sitemap: ${urls.length} URLs → ${outPath}`);
