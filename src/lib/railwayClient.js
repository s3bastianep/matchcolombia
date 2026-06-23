import { getToken } from "./railwayAuth.js";

export function isRailwayBackendConfigured() {
  return import.meta.env.VITE_USE_RAILWAY_API === "true";
}

export function getApiBase() {
  const base = import.meta.env.VITE_API_URL;
  if (base === undefined || base === "") return "/api";
  return base.replace(/\/$/, "");
}

export async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body === "object") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const res = await fetch(`${getApiBase()}${path}`, { ...options, headers, body });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text || "Respuesta inválida" };
  }

  if (!res.ok) {
    throw new Error(data?.error || `Error ${res.status}`);
  }
  return data;
}
