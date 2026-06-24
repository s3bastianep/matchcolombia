import { query } from "./pool.js";

const MAX_LABEL = 200;
const MAX_TARGET = 500;
const MAX_PATH = 300;

function clip(value, max) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function rowToEvent(row) {
  if (!row) return null;
  let meta = {};
  try {
    meta = row.meta ? JSON.parse(row.meta) : {};
  } catch {
    meta = {};
  }
  return {
    id: row.id,
    session_id: row.session_id,
    user_id: row.user_id || null,
    event_type: row.event_type,
    path: row.path,
    label: row.label,
    target: row.target,
    device: row.device,
    meta,
    created_at: row.created_at,
  };
}

export async function insertAnalyticsEvents(events = []) {
  const now = Date.now();
  let inserted = 0;

  for (const raw of events) {
    const eventType = clip(raw.event_type || raw.type, 40);
    if (!eventType) continue;

    const id = raw.id || `evt-${now}-${Math.random().toString(36).slice(2, 10)}`;
    const sessionId = clip(raw.session_id || raw.sessionId, 80);
    if (!sessionId) continue;

    const path = clip(raw.path || "/", MAX_PATH) || "/";
    const label = clip(raw.label, MAX_LABEL);
    const target = clip(raw.target, MAX_TARGET);
    const device = clip(raw.device, 20) || "unknown";
    const userId = raw.user_id || raw.userId || null;
    const meta = JSON.stringify(raw.meta && typeof raw.meta === "object" ? raw.meta : {});
    const createdAt = raw.created_at || new Date().toISOString();

    await query(
      `INSERT INTO analytics_events (id, session_id, user_id, event_type, path, label, target, device, meta, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [id, sessionId, userId, eventType, path, label, target, device, meta, createdAt]
    );
    inserted += 1;
  }

  return { inserted };
}

export async function getUsageReport({ days = 7 } = {}) {
  const windowDays = Math.min(Math.max(Number(days) || 7, 1), 90);
  const since = new Date(Date.now() - windowDays * 86400000).toISOString();

  const { rows: summaryRows } = await query(
    `SELECT
       COUNT(*) AS total_events,
       COUNT(DISTINCT session_id) AS sessions,
       SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS page_views,
       SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END) AS clicks
     FROM analytics_events
     WHERE created_at >= $1`,
    [since]
  );

  const { rows: pageRows } = await query(
    `SELECT path, COUNT(*) AS count
     FROM analytics_events
     WHERE created_at >= $1 AND event_type = 'page_view'
     GROUP BY path
     ORDER BY count DESC
     LIMIT 20`,
    [since]
  );

  const { rows: clickRows } = await query(
    `SELECT label, target, path, COUNT(*) AS count
     FROM analytics_events
     WHERE created_at >= $1 AND event_type = 'click' AND label != ''
     GROUP BY label, target, path
     ORDER BY count DESC
     LIMIT 30`,
    [since]
  );

  const { rows: clicksByPage } = await query(
    `SELECT path, COUNT(*) AS count
     FROM analytics_events
     WHERE created_at >= $1 AND event_type = 'click'
     GROUP BY path
     ORDER BY count DESC
     LIMIT 15`,
    [since]
  );

  const { rows: deviceRows } = await query(
    `SELECT device, COUNT(*) AS count
     FROM analytics_events
     WHERE created_at >= $1
     GROUP BY device
     ORDER BY count DESC`,
    [since]
  );

  const { rows: dailyRows } = await query(
    `SELECT date(created_at) AS day,
            COUNT(*) AS events,
            COUNT(DISTINCT session_id) AS sessions
     FROM analytics_events
     WHERE created_at >= $1
     GROUP BY date(created_at)
     ORDER BY day ASC`,
    [since]
  );

  const { rows: customRows } = await query(
    `SELECT event_type, COUNT(*) AS count
     FROM analytics_events
     WHERE created_at >= $1 AND event_type NOT IN ('page_view', 'click')
     GROUP BY event_type
     ORDER BY count DESC
     LIMIT 15`,
    [since]
  );

  const summary = summaryRows[0] || {};

  return {
    periodDays: windowDays,
    since,
    summary: {
      totalEvents: Number(summary.total_events) || 0,
      sessions: Number(summary.sessions) || 0,
      pageViews: Number(summary.page_views) || 0,
      clicks: Number(summary.clicks) || 0,
    },
    topPages: pageRows.map((r) => ({ path: r.path, count: Number(r.count) || 0 })),
    topClicks: clickRows.map((r) => ({
      label: r.label,
      target: r.target || null,
      path: r.path,
      count: Number(r.count) || 0,
    })),
    clicksByPage: clicksByPage.map((r) => ({ path: r.path, count: Number(r.count) || 0 })),
    devices: deviceRows.map((r) => ({ device: r.device, count: Number(r.count) || 0 })),
    daily: dailyRows.map((r) => ({
      day: r.day,
      events: Number(r.events) || 0,
      sessions: Number(r.sessions) || 0,
    })),
    customEvents: customRows.map((r) => ({
      eventType: r.event_type,
      count: Number(r.count) || 0,
    })),
  };
}

export async function pruneAnalyticsEvents({ keepDays = 90 } = {}) {
  const cutoff = new Date(Date.now() - keepDays * 86400000).toISOString();
  const { rowCount } = await query("DELETE FROM analytics_events WHERE created_at < $1", [cutoff]);
  return { deleted: rowCount || 0 };
}
