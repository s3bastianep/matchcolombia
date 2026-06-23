import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import { migrate } from "./db/migrate.js";
import { seedIfEmpty } from "./db/seed.js";
import { authMiddleware } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import entityRoutes, { settingsRouter } from "./routes/entities.js";
import uploadRoutes from "./routes/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist");
const uploadDir = process.env.UPLOAD_DIR || path.join(root, "uploads");
const port = Number(process.env.PORT) || 3000;

mkdirSync(uploadDir, { recursive: true });

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(authMiddleware);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, backend: "railway" });
});

app.use("/api/auth", authRoutes);
app.use("/api/entities", entityRoutes);
app.use("/api/settings", settingsRouter);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(uploadDir, { maxAge: "7d" }));

app.use(express.static(distDir, { maxAge: "1h", index: false }));

app.get("*", (req, res, next) => {
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
