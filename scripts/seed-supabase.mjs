/**
 * Carga datos demo en Supabase (propiedades, visitas, usuarios admin, etc.)
 * Requiere SUPABASE_SERVICE_ROLE_KEY — nunca expongas esta clave en el frontend.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_PROPERTIES } from "../src/api/mockData.js";
import { getPortalSeedData } from "../src/api/portalSeed.js";
import { buildNewProperty } from "../src/api/propertyMutations.js";

const root = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile() {
  const envPath = path.join(root, "..", ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

const DEMO_USERS = [
  { username: "admin", password: "admin123", name: "Admin HABIBAR", role: "admin", email: "admin@habibar.co" },
  { username: "buscador", password: "demo123", name: "Laura Buscadora", role: "seeker", email: "buscador@demo.co" },
  { username: "inquilino", password: "demo123", name: "Ana Inquilina", role: "tenant", email: "inquilino@demo.co" },
  { username: "propietario", password: "demo123", name: "Pedro Propietario", role: "owner", email: "propietario@demo.co" },
];

function authEmail(username) {
  return `${username.trim().toLowerCase()}@auth.habibar.app`;
}

async function upsertRecord(entityType, record) {
  const now = new Date().toISOString();
  const { error } = await admin.from("app_records").upsert(
    {
      entity_type: entityType,
      id: record.id,
      record,
      created_at: record.created_date || now,
      updated_at: record.updated_date || now,
    },
    { onConflict: "entity_type,id" }
  );
  if (error) throw new Error(`${entityType}/${record.id}: ${error.message}`);
}

async function ensureDemoUsers() {
  const idMap = {};
  for (const demo of DEMO_USERS) {
    const email = authEmail(demo.username);
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    let user = list?.users?.find((u) => u.email === email);

    if (!user) {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password: demo.password,
        email_confirm: true,
        user_metadata: {
          username: demo.username,
          name: demo.name,
          role: demo.role,
          display_email: demo.email,
        },
      });
      if (error) throw new Error(`Usuario ${demo.username}: ${error.message}`);
      user = data.user;
    }

    idMap[demo.username] = user.id;

    await admin.from("profiles").upsert({
      id: user.id,
      username: demo.username,
      name: demo.name,
      role: demo.role,
      display_email: demo.email,
      auth_email: email,
    });
  }
  return idMap;
}

function remapUserIds(seed, idMap) {
  const legacy = {
    "user-admin-demo": idMap.admin,
    "user-seeker-demo": idMap.buscador,
    "user-tenant-demo": idMap.inquilino,
    "user-owner-demo": idMap.propietario,
  };
  const swap = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const next = { ...obj };
    if (next.user_id && legacy[next.user_id]) next.user_id = legacy[next.user_id];
    return next;
  };
  return {
    inquiries: seed.inquiries.map(swap),
    visits: seed.visits.map(swap),
    messages: seed.messages.map(swap),
    applications: seed.applications.map(swap),
    leases: seed.leases.map(swap),
    payments: seed.payments.map(swap),
    tickets: seed.tickets.map(swap),
    owners: seed.owners.map(swap),
    pois: seed.pois,
    settings: seed.settings,
  };
}

async function main() {
  console.log("Sembrando Supabase…");

  const idMap = await ensureDemoUsers();
  console.log("Usuarios demo listos:", Object.keys(idMap).join(", "));

  for (const prop of SEED_PROPERTIES) {
    await upsertRecord("property", buildNewProperty(prop, prop.id));
  }
  console.log(`Propiedades: ${SEED_PROPERTIES.length}`);

  const propIds = SEED_PROPERTIES.slice(0, 2).map((p) => p.id);
  const seed = remapUserIds(getPortalSeedData(propIds), idMap);

  for (const item of seed.inquiries) await upsertRecord("inquiry", item);
  for (const item of seed.visits) await upsertRecord("visit", item);
  for (const item of seed.messages) await upsertRecord("message", item);
  for (const item of seed.applications) await upsertRecord("application", item);
  for (const item of seed.leases) await upsertRecord("lease", item);
  for (const item of seed.payments) await upsertRecord("payment", item);
  for (const item of seed.tickets) await upsertRecord("ticket", item);
  for (const item of seed.owners) await upsertRecord("owner", item);
  for (const item of seed.pois) await upsertRecord("poi", item);
  await upsertRecord("admin_settings", { ...seed.settings, id: "site" });

  console.log("Seed completado.");
  console.log("Login admin: usuario admin / contraseña admin123");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
