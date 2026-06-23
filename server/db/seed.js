import bcrypt from "bcryptjs";
import { query } from "./pool.js";
import { upsertSingleton, createRecord, getRecord } from "./entityStore.js";
import { SEED_PROPERTIES } from "../../src/api/mockData.js";
import { getPortalSeedData } from "../../src/api/portalSeed.js";
import { buildNewProperty } from "../../src/api/propertyMutations.js";

const DEMO_USERS = [
  { id: "user-admin-demo", username: "admin", password: "admin123", name: "Admin HABIBAR", role: "admin", email: "admin@habibar.co" },
  { id: "user-seeker-demo", username: "buscador", password: "demo123", name: "Laura Buscadora", role: "seeker", email: "buscador@demo.co" },
  { id: "user-tenant-demo", username: "inquilino", password: "demo123", name: "Ana Inquilina", role: "tenant", email: "inquilino@demo.co" },
  { id: "user-owner-demo", username: "propietario", password: "demo123", name: "Pedro Propietario", role: "owner", email: "propietario@demo.co" },
];

async function countUsers() {
  const { rows } = await query("SELECT COUNT(*)::int AS n FROM users");
  return rows[0]?.n || 0;
}

async function ensureDemoUser(user) {
  const hash = await bcrypt.hash(user.password, 10);
  await query(
    `INSERT INTO users (id, username, name, email, role, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO UPDATE SET
       username = EXCLUDED.username,
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       role = EXCLUDED.role,
       password_hash = EXCLUDED.password_hash`,
    [user.id, user.username.toLowerCase(), user.name, user.email, user.role, hash]
  );
}

async function upsertEntity(entityType, record) {
  const existing = await getRecord(entityType, record.id);
  if (existing) return existing;
  return createRecord(entityType, record, entityType.slice(0, 3));
}

export async function seedIfEmpty() {
  const userCount = await countUsers();
  if (userCount > 0) {
    console.log("HABIBAR API: base de datos ya tiene usuarios, seed omitido.");
    return;
  }

  console.log("HABIBAR API: sembrando datos demo…");

  for (const user of DEMO_USERS) {
    await ensureDemoUser(user);
  }

  for (const prop of SEED_PROPERTIES) {
    await upsertEntity("property", buildNewProperty(prop, prop.id));
  }

  const propIds = SEED_PROPERTIES.slice(0, 2).map((p) => p.id);
  const seed = getPortalSeedData(propIds);

  for (const item of seed.inquiries) await upsertEntity("inquiry", item);
  for (const item of seed.visits) await upsertEntity("visit", item);
  for (const item of seed.messages) await upsertEntity("message", item);
  for (const item of seed.applications) await upsertEntity("application", item);
  for (const item of seed.leases) await upsertEntity("lease", item);
  for (const item of seed.payments) await upsertEntity("payment", item);
  for (const item of seed.tickets) await upsertEntity("ticket", item);
  for (const item of seed.owners) await upsertEntity("owner", item);
  for (const item of seed.pois) await upsertEntity("poi", item);
  await upsertSingleton("admin_settings", "site", { ...seed.settings, id: "site" });

  console.log("HABIBAR API: seed completado. Login: admin / admin123");
}
