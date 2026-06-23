import jwt from "jsonwebtoken";
import { query } from "../db/pool.js";

const JWT_SECRET = process.env.JWT_SECRET || "habibar-dev-secret-change-me";

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function sanitizeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email || "",
    phone: row.phone || "",
    role: row.role || "seeker",
    created_at: row.created_at,
  };
}

export async function findUserByUsername(username) {
  const normalized = username.trim().toLowerCase();
  const { rows } = await query("SELECT * FROM users WHERE username = $1 LIMIT 1", [normalized]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const { rows } = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function findUserByPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  const { rows } = await query(
    "SELECT * FROM users WHERE regexp_replace(phone, '[^0-9]', '', 'g') = $1 LIMIT 1",
    [digits]
  );
  return rows[0] || null;
}

export async function createUser({ id, name, username, email, phone, role, passwordHash }) {
  const normalized = username.trim().toLowerCase();
  await query(
    `INSERT INTO users (id, username, name, email, phone, role, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, normalized, name.trim(), email?.trim() || "", phone?.trim() || "", role || "seeker", passwordHash]
  );
  return findUserById(id);
}

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }
  const payload = verifyToken(token);
  if (!payload?.sub) {
    req.user = null;
    return next();
  }
  const row = await findUserById(payload.sub);
  req.user = sanitizeUser(row);
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }
  next();
}

export { sanitizeUser };
