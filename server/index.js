import { mkdirSync, existsSync } from "node:fs";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "./db/migrate.js";
import { seedIfEmpty } from "./db/seed.js";
import { authMiddleware } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import entityRoutes, { settingsRouter } from "./routes/entities.js";
import uploadRoutes from "./routes/upload.js";

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

const CANONICAL_HOST = (process.env.CANONICAL_HOST || "habibar.com").toLowerCase();

function prerenderHtmlPath(urlPath) {
  if (urlPath === "/" || urlPath === "") {
    return path.join(distDir, "index.html");
  }
  const match = urlPath.match(/^\/propiedad\/([^/]+)$/);
  if (match) {
    const file = path.join(distDir, "propiedad", match[1], "index.html");
    return existsSync(file) ? file : null;
  }
  const staticRoutes = ["explorar", "anunciar", "publicar"];
  const segment = urlPath.replace(/^\//, "").split("/")[0];
  if (staticRoutes.includes(segment) && urlPath.split("/").length === 2) {
    const file = path.join(distDir, segment, "index.html");
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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, backend: "sqlite" });
});

app.use("/api/auth", authRoutes);
app.use("/api/entities", entityRoutes);
app.use("/api/settings", settingsRouter);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(uploadDir, { maxAge: "7d" }));

app.use(express.static(distDir, { maxAge: "1h", index: false }));

// HTML prerenderizado por ruta (SSG) antes del fallback SPA
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
  const file = prerenderHtmlPath(req.path);
  if (file) return res.sendFile(file, (err) => (err ? next(err) : undefined));
  next();
});

// SPA fallback (sin wildcard * — incompatible con Express 5)
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
  res.sendFile(path.join(distDir, "index.html"), (err) => {
    if (err) next(err);
  });
});

app.use((err, _req, res, _next) => {
  console.error("HABIBAR API error:", err);
  res.status(500).json({ error: err.message || "Error interno" });
});

async function start() {
  await migrate();
  await seedIfEmpty();
  app.listen(port, "0.0.0.0", () => {
    console.log(`HABIBAR API escuchando en :${port}`);
  });
}

start().catch((err) => {
  console.error("No se pudo iniciar el servidor:", err);
  process.exit(1);
});
