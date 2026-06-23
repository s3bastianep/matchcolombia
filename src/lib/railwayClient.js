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
  const { timeoutMs = 12_000, headers: optionHeaders, body: optionBody, ...fetchOptions } = options;
  const headers = { ...(optionHeaders || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body = optionBody;
  if (body && !(body instanceof FormData) && typeof body === "object") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(`${getApiBase()}${path}`, {
      ...fetchOptions,
      headers,
      body,
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("El servidor tardó demasiado en responder. Intenta de nuevo.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
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
