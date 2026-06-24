import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { insertAnalyticsEvents, getUsageReport, pruneAnalyticsEvents } from "../db/analyticsStore.js";

const router = Router();

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "No autorizado" });
  }
  next();
}

router.post("/events", async (req, res) => {
  try {
    const events = Array.isArray(req.body?.events) ? req.body.events : [];
    if (!events.length) {
      return res.json({ ok: true, inserted: 0 });
    }
    if (events.length > 50) {
      return res.status(400).json({ error: "Máximo 50 eventos por lote" });
    }

    const userId = req.user?.id || null;
    const sanitized = events
      .filter((evt) => evt && typeof evt === "object")
      .map((evt) => ({
        ...evt,
        user_id: userId || evt.user_id || null,
      }));

    const { inserted } = await insertAnalyticsEvents(sanitized);
    res.json({ ok: true, inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/report", requireAuth, requireAdmin, async (req, res) => {
  try {
    const days = Number(req.query.days) || 7;
    const report = await getUsageReport({ days });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/prune", requireAuth, requireAdmin, async (req, res) => {
  try {
    const keepDays = Number(req.body?.keepDays) || 90;
    const result = await pruneAnalyticsEvents({ keepDays });
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
