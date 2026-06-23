import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { getSitemapUrls, SITE_URL } = await import("../src/lib/seo.js");

function xmlLoc(loc) {
  const href = `${SITE_URL}${loc.startsWith("/") ? loc : `/${loc}`}`;
  return href.replace(/&/g, "&amp;");
}

const urls = getSitemapUrls();
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) =>
      `  <url><loc>${xmlLoc(entry.loc)}</loc><lastmod>${entry.lastmod}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`
  )
  .join("\n")}
</urlset>
`;

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log(`Sitemap: ${urls.length} URLs → ${outPath}`);
