import { getApiBase } from "@/lib/railwayClient";

const SESSION_KEY = "habibar_analytics_session";
const QUEUE_KEY = "habibar_analytics_queue";
const OPT_OUT_KEY = "habibar_analytics_optout";
const FLUSH_MS = 4000;
const MAX_QUEUE = 120;

let flushTimer = null;
let flushing = false;

function isEnabled() {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(OPT_OUT_KEY) === "1") return false;
  if (window.location.pathname.startsWith("/admin")) return false;
  return true;
}

export function getAnalyticsSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `s-anon-${Date.now()}`;
  }
}

function getDevice() {
  if (typeof window === "undefined") return "unknown";
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(events) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(events.slice(-MAX_QUEUE)));
  } catch {
    /* quota */
  }
}

function enqueue(event) {
  const queue = readQueue();
  queue.push({
    ...event,
    session_id: getAnalyticsSessionId(),
    device: getDevice(),
    created_at: new Date().toISOString(),
  });
  writeQueue(queue);
  scheduleFlush();
}

export function trackEvent(eventType, payload = {}) {
  if (!isEnabled()) return;
  enqueue({
    event_type: eventType,
    path: payload.path || window.location.pathname,
    label: payload.label || "",
    target: payload.target || "",
    meta: payload.meta || {},
  });
}

export function trackPageView(path = window.location.pathname) {
  if (!isEnabled()) return;
  trackEvent("page_view", {
    path,
    label: document.title || path,
  });
}

export function trackClick({ label, target, path }) {
  if (!isEnabled()) return;
  if (!label && !target) return;
  trackEvent("click", { label, target, path: path || window.location.pathname });
}

async function sendBatch(events) {
  const res = await fetch(`${getApiBase()}/analytics/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events }),
    keepalive: true,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
}

export async function flushAnalytics() {
  if (flushing || !isEnabled()) return;
  const queue = readQueue();
  if (!queue.length) return;

  flushing = true;
  const batch = queue.slice(0, 50);
  try {
    await sendBatch(batch);
    writeQueue(queue.slice(batch.length));
  } catch {
    /* reintento en el próximo flush */
  } finally {
    flushing = false;
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    flushAnalytics();
  }, FLUSH_MS);
}

export function initAnalyticsTransport() {
  if (typeof window === "undefined") return undefined;

  const onHide = () => {
    flushAnalytics();
  };

  window.addEventListener("pagehide", onHide);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") onHide();
  });

  scheduleFlush();

  return () => {
    window.removeEventListener("pagehide", onHide);
    if (flushTimer) clearTimeout(flushTimer);
  };
}

export function describeClickTarget(el) {
  if (!el) return { label: "", target: "" };

  const trackLabel = el.getAttribute("data-track");
  const aria = el.getAttribute("aria-label");
  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  const label = trackLabel || aria || text.slice(0, 120) || el.tagName.toLowerCase();

  let target = "";
  if (el.tagName === "A") {
    target = el.getAttribute("href") || "";
  } else {
    const link = el.closest("a[href]");
    if (link) target = link.getAttribute("href") || "";
  }

  return { label, target };
}
