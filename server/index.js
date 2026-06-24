import { mkdirSync, existsSync, readFileSync } from "node:fs";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "./db/migrate.js";
import { seedIfEmpty, syncDemoPortalTickets } from "./db/seed.js";
import { authMiddleware } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import entityRoutes, { settingsRouter } from "./routes/entities.js";
import uploadRoutes from "./routes/upload.js";
import analyticsRoutes from "./routes/analytics.js";
import { securityHeadersMiddleware } from "./securityHeaders.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist");
const dataDir = process.env.DATA_DIR || path.join(root, "data");
const uploadDir = process.env.UPLOAD_DIR || path.join(dataDir, "uploads");
const port = Number(process.env.PORT) || 3000;

mkdirSync(dataDir, { recursive: true });
mkdirSync(uploadDir, { recursive: true });

const app = express();
app.disable("x-powered-by");
app.use(securityHeadersMiddleware);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, backend: "sqlite" });
});

app.get("/api/build-info", (_req, res) => {
  let faviconVersion = null;
  let jsBundle = null;
  try {
    const indexHtml = readFileSync(path.join(distDir, "index.html"), "utf8");
    faviconVersion = indexHtml.match(/favicon\.svg\?v=(\d+)/)?.[1] ?? null;
    jsBundle = indexHtml.match(/assets\/(index-[^"]+\.js)/)?.[1] ?? null;
  } catch {
    /* dist aún no generado */
  }
  res.json({
    ok: true,
    gitSha: process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GITHUB_SHA || null,
    faviconVersion,
    jsBundle,
    distExists: existsSync(path.join(distDir, "index.html")),
  });
});

const CANONICAL_HOST = (process.env.CANONICAL_HOST || "habibar.com").toLowerCase();

function prerenderHtmlPath(urlPath) {
  if (urlPath === "/" || urlPath === "") {
    return path.join(distDir, "index.html");
  }
  const propertyMatch = urlPath.match(/^\/propiedad\/([^/]+)$/);
  if (propertyMatch) {
    const file = path.join(distDir, "propiedad", propertyMatch[1], "index.html");
    return existsSync(file) ? file : null;
  }
  const segments = urlPath.replace(/^\//, "").split("/").filter(Boolean);
  if (segments[0] === "explorar") {
    const file = path.join(distDir, ...segments, "index.html");
    return existsSync(file) ? file : null;
  }
  const staticRoutes = ["anunciar", "publicar", "privacidad", "arriendos-bogota", "preguntas-frecuentes"];
  if (staticRoutes.includes(segments[0]) && segments.length === 1) {
    const file = path.join(distDir, segments[0], "index.html");
    return existsSync(file) ? file : null;
  }
  return null;
}

// HTTPS + host canónico (sin www) en producción
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production") return next();

  const host = (req.headers.host || "").split(":")[0].toLowerCase();
  const proto = (req.headers["x-forwarded-proto"] || req.protocol || "http").split(",")[0].trim();

  if (proto !== "https") {
    return res.redirect(301, `https://${host || CANONICAL_HOST}${req.originalUrl}`);
  }

  if (host.startsWith("www.")) {
    const bare = host.slice(4);
    return res.redirect(301, `https://${bare || CANONICAL_HOST}${req.originalUrl}`);
  }

  next();
});

app.use(express.json({ limit: "2mb" }));
app.use(authMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/entities", entityRoutes);
app.use("/api/settings", settingsRouter);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(uploadDir, { maxAge: "7d" }));

const HTML_CACHE = "no-cache, no-store, must-revalidate";

function sendHtml(res, file, next) {
  res.setHeader("Cache-Control", HTML_CACHE);
  res.sendFile(file, (err) => (err ? next(err) : undefined));
}

app.use(
  "/assets",
  express.static(path.join(distDir, "assets"), {
    maxAge: "1y",
    immutable: true,
  })
);

app.use(
  express.static(distDir, {
    maxAge: "1h",
    index: false,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", HTML_CACHE);
      }
    },
  })
);

// HTML prerenderizado por ruta (SSG) antes del fallback SPA
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
  const file = prerenderHtmlPath(req.path);
  if (file) return sendHtml(res, file, next);
  next();
});

// SPA fallback (sin wildcard * — incompatible con Express 5)
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
  sendHtml(res, path.join(distDir, "index.html"), next);
});

app.use((err, _req, res, _next) => {
  console.error("HABIBAR API error:", err);
  res.status(500).json({ error: err.message || "Error interno" });
});

async function start() {
  await migrate();

  app.listen(port, "0.0.0.0", () => {
    console.log(`HABIBAR API escuchando en :${port}`);
  });

  seedIfEmpty()
    .then(() => syncDemoPortalTickets())
    .catch((err) => {
      console.error("HABIBAR API: seed falló (el servidor sigue activo):", err);
    });
}

process.on("unhandledRejection", (reason) => {
  console.error("HABIBAR API: unhandledRejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("HABIBAR API: uncaughtException:", err);
});

start().catch((err) => {
  console.error("No se pudo iniciar el servidor:", err);
  process.exit(1);
});
