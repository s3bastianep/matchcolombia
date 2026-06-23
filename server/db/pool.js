import pg from "pg";

const { Pool } = pg;

let pool = null;

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.DATABASE_PRIVATE_URL) return process.env.DATABASE_PRIVATE_URL;
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL;

  const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env;
  if (PGHOST && PGUSER && PGDATABASE) {
    const auth = PGPASSWORD ? `${encodeURIComponent(PGUSER)}:${encodeURIComponent(PGPASSWORD)}@` : `${encodeURIComponent(PGUSER)}@`;
    const port = PGPORT || "5432";
    return `postgresql://${auth}${PGHOST}:${port}/${PGDATABASE}`;
  }

  return null;
}

export function getPool() {
  if (pool) return pool;
  const connectionString = resolveDatabaseUrl();
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL no configurada. En Railway: + New → Database → PostgreSQL → " +
        "servicio matchcolombia → Variables → Add Reference → Postgres → DATABASE_URL → Redeploy."
    );
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
