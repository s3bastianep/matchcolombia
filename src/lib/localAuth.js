import { ROLES } from "./roles";
import { apiDelay } from "./apiDelay";
import { BRAND } from "./brand";

const USERS_KEY = "habibar_users";
const SESSION_KEY = "habibar_session";
const DEMO_USERS_SEEDED = "habibar_demo_users_seeded";

const delay = apiDelay;

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return { ...safe, role: safe.role || "seeker" };
}

function generateToken() {
  return `mc_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

async function seedDemoUsers() {
  if (localStorage.getItem(DEMO_USERS_SEEDED)) return;
  const users = loadUsers();
  const demos = [
    { id: "user-admin-demo", name: `Admin ${BRAND.name}`, username: "admin", email: "admin@habibar.com", password: "admin123", role: ROLES.ADMIN },
    { id: "user-seeker-demo", name: "Laura Buscadora", username: "buscador", email: "buscador@demo.co", password: "demo123", role: ROLES.SEEKER },
    { id: "user-tenant-demo", name: "Ana Inquilina", username: "inquilino", email: "inquilino@demo.co", password: "demo123", role: ROLES.TENANT },
    { id: "user-owner-demo", name: "Pedro Propietario", username: "propietario", email: "propietario@demo.co", password: "demo123", role: ROLES.OWNER },
  ];
  for (const d of demos) {
    if (!users.some((u) => normalizeUsername(u.username) === d.username)) {
      users.push({
        id: d.id,
        name: d.name,
        username: d.username,
        email: d.email,
        role: d.role,
        passwordHash: await hashPassword(d.password),
        created_at: new Date().toISOString(),
      });
    }
  }
  saveUsers(users);
  localStorage.setItem(DEMO_USERS_SEEDED, "1");
}

export function initLocalAuth() {
  seedDemoUsers().catch(() => {});
}

export async function register({ name, username, email, password, role = ROLES.SEEKER }) {
  await delay(400);
  await seedDemoUsers();

  if (!name?.trim()) throw new Error("Ingresa tu nombre");
  if (!username?.trim()) throw new Error("Ingresa un usuario");
  if (!password || password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");

  const users = loadUsers();
  const normalized = normalizeUsername(username);

  if (users.some((u) => normalizeUsername(u.username) === normalized)) {
    throw new Error("Ese usuario ya está registrado");
  }

  if (email && users.some((u) => u.email?.toLowerCase() === email.toLowerCase())) {
    throw new Error("Ese correo ya está registrado");
  }

  const user = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    username: username.trim(),
    email: email?.trim() || "",
    role: role || ROLES.SEEKER,
    passwordHash: await hashPassword(password),
    created_at: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  const session = {
    token: generateToken(),
    userId: user.id,
    user: sanitizeUser(user),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  saveSession(session);

  return { user: session.user, access_token: session.token };
}

export async function login(username, password) {
  await delay(350);
  await seedDemoUsers();

  if (!username?.trim() || !password) {
    throw new Error("Usuario y contraseña son obligatorios");
  }

  const users = loadUsers();
  const normalized = normalizeUsername(username);
  const user = users.find((u) => normalizeUsername(u.username) === normalized);

  if (!user) throw new Error("Usuario o contraseña incorrectos");

  const hash = await hashPassword(password);
  if (user.passwordHash !== hash) throw new Error("Usuario o contraseña incorrectos");

  const session = {
    token: generateToken(),
    userId: user.id,
    user: sanitizeUser(user),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  saveSession(session);

  return { user: session.user, access_token: session.token };
}

export async function loginViaEmailPassword(identifier, password) {
  return login(identifier, password);
}

export async function me() {
  const session = loadSession();
  if (!session) return null;

  const users = loadUsers();
  const user = users.find((u) => u.id === session.userId);
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  return sanitizeUser(user);
}

export function getToken() {
  return loadSession()?.token || null;
}

export function getCurrentUserId() {
  return loadSession()?.userId || null;
}

export function setToken(token) {
  const session = loadSession();
  if (session) saveSession({ ...session, token });
}

export async function logout() {
  await delay(100);
  localStorage.removeItem(SESSION_KEY);
}

export async function resetPasswordRequest() {
  await delay(300);
  return { ok: true };
}

export async function resetPassword() {
  await delay(300);
  throw new Error("Restablecimiento no disponible en modo demo");
}

export async function verifyOtp() {
  throw new Error("Verificación OTP no disponible en modo demo");
}

export async function resendOtp() {
  throw new Error("Reenvío OTP no disponible en modo demo");
}

export function loginWithProvider() {
  throw new Error("Inicio con Google no disponible en modo demo");
}

/** Cuenta rápida al agendar visita (WhatsApp como identificador). */
export async function registerFromBooking({ name, phone }) {
  await delay(350);
  await seedDemoUsers();

  if (!name?.trim()) throw new Error("Ingresa tu nombre");
  if (!phone?.trim()) throw new Error("Ingresa tu WhatsApp o celular");

  const normalizedPhone = phone.replace(/\D/g, "");
  const users = loadUsers();
  const existing = users.find((u) => u.phone && u.phone.replace(/\D/g, "") === normalizedPhone);

  if (existing) {
    const session = {
      token: generateToken(),
      userId: existing.id,
      user: sanitizeUser(existing),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    saveSession(session);
    return { user: session.user, access_token: session.token, isNew: false };
  }

  const user = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    username: `wa_${normalizedPhone.slice(-10) || Date.now()}`,
    email: "",
    phone: phone.trim(),
    role: ROLES.SEEKER,
    passwordHash: await hashPassword(`habibar_${normalizedPhone}_${Date.now()}`),
    created_at: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  const session = {
    token: generateToken(),
    userId: user.id,
    user: sanitizeUser(user),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  saveSession(session);

  return { user: session.user, access_token: session.token, isNew: true };
}
