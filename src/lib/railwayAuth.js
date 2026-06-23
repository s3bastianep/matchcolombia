import { ROLES } from "./roles";
import { apiRequest } from "./railwayClient";

const TOKEN_KEY = "habibar_railway_token";
const USER_KEY = "habibar_railway_user";

let cachedUserId = null;

function saveSession(user, access_token) {
  localStorage.setItem(TOKEN_KEY, access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  cachedUserId = user?.id || null;
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  cachedUserId = null;
}

export function initRailwayAuth() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    cachedUserId = raw ? JSON.parse(raw)?.id || null : null;
  } catch {
    cachedUserId = null;
  }
}

export async function register({ name, username, email, password, role = ROLES.SEEKER }) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: { name, username, email, password, role },
  });
  saveSession(data.user, data.access_token);
  return data;
}

export async function login(username, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: { username, password },
  });
  saveSession(data.user, data.access_token);
  return data;
}

export async function loginViaEmailPassword(identifier, password) {
  return login(identifier, password);
}

export async function me() {
  const token = getToken();
  if (!token) return null;
  try {
    const user = await apiRequest("/auth/me");
    saveSession(user, token);
    return user;
  } catch {
    clearSession();
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUserId() {
  if (cachedUserId) return cachedUserId;
  try {
    const raw = localStorage.getItem(USER_KEY);
    cachedUserId = raw ? JSON.parse(raw)?.id || null : null;
  } catch {
    cachedUserId = null;
  }
  return cachedUserId;
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export async function logout() {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } catch {
    /* ignore */
  }
  clearSession();
}

export async function resetPasswordRequest(email) {
  return apiRequest("/auth/reset-password-request", { method: "POST", body: { email } });
}

export async function resetPassword() {
  throw new Error("Restablecimiento no disponible todavía");
}

export async function verifyOtp() {
  throw new Error("Verificación OTP no disponible");
}

export async function resendOtp() {
  throw new Error("Reenvío OTP no disponible");
}

export function loginWithProvider() {
  throw new Error("Inicio con Google estará disponible pronto");
}

export async function registerFromBooking({ name, phone }) {
  const data = await apiRequest("/auth/register-from-booking", {
    method: "POST",
    body: { name, phone },
  });
  saveSession(data.user, data.access_token);
  return data;
}
