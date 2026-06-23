import pg from "pg";

const { Pool } = pg;

let pool = null;

export function getPool() {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no configurada. Agrega PostgreSQL en Railway y vincúlalo al servicio.");
  }
  pool = new Pool({
    connectionString,
    ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
  });
  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}
