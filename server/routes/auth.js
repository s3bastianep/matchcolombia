import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  signToken,
  sanitizeUser,
  findUserByUsername,
  findUserById,
  findUserByPhone,
  createUser,
  requireAuth,
} from "../middleware/auth.js";

const router = Router();

function newUserId() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, role = "seeker" } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ error: "Ingresa tu nombre" });
    if (!username?.trim()) return res.status(400).json({ error: "Ingresa un usuario" });
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existing = await findUserByUsername(username);
    if (existing) return res.status(409).json({ error: "Ese usuario ya está registrado" });

    const id = newUserId();
    const passwordHash = await bcrypt.hash(password, 10);
    const row = await createUser({ id, name, username, email, role, passwordHash });
    const user = sanitizeUser(row);
    const access_token = signToken(user);
    res.json({ user, access_token });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error al registrar" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username?.trim() || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }
    const row = await findUserByUsername(username);
    if (!row) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    const user = sanitizeUser(row);
    res.json({ user, access_token: signToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error al iniciar sesión" });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

router.post("/logout", (_req, res) => {
  res.json({ ok: true });
});

router.post("/register-from-booking", async (req, res) => {
  try {
    const { name, phone } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ error: "Ingresa tu nombre" });
    if (!phone?.trim()) return res.status(400).json({ error: "Ingresa tu WhatsApp o celular" });

    const existing = await findUserByPhone(phone);
    if (existing) {
      const user = sanitizeUser(existing);
      return res.json({ user, access_token: signToken(user), isNew: false });
    }

    const normalizedPhone = phone.replace(/\D/g, "");
    const id = newUserId();
    const passwordHash = await bcrypt.hash(`habibar_${normalizedPhone}_${Date.now()}`, 10);
    const row = await createUser({
      id,
      name,
      username: `wa_${normalizedPhone.slice(-10) || Date.now()}`,
      email: "",
      phone: phone.trim(),
      role: "seeker",
      passwordHash,
    });
    const user = sanitizeUser(row);
    res.json({ user, access_token: signToken(user), isNew: true });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error al crear cuenta" });
  }
});

router.post("/reset-password-request", (_req, res) => {
  res.json({ ok: true });
});

export default router;
