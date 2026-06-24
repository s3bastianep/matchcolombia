import Database from "better-sqlite3";
import path from "node:path";
import { mkdirSync } from "node:fs";

let db = null;

export function getDataDir() {
  return process.env.DATA_DIR || path.join(process.cwd(), "data");
}

export function getDb() {
  if (!db) {
    const dir = getDataDir();
    mkdirSync(dir, { recursive: true });
    const file = process.env.DATABASE_PATH || path.join(dir, "habibar.db");
    db = new Database(file);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    console.log(`HABIBAR API: SQLite en ${file}`);
  }
  return db;
}

/** Convierte $1, $2… a ? respetando el orden en que aparecen en el SQL (no el índice). */
function convertSql(text, params = []) {
  const orderedParams = [];
  const sql = text
    .replace(/\$(\d+)::jsonb/g, (_, index) => {
      orderedParams.push(params[Number(index) - 1]);
      return "?";
    })
    .replace(/\$(\d+)/g, (_, index) => {
      orderedParams.push(params[Number(index) - 1]);
      return "?";
    })
    .replace(/::int/g, "");
  return { sql, params: orderedParams };
}

export async function query(text, params = []) {
  const database = getDb();
  const { sql, params: boundParams } = convertSql(text, params);
  const upper = text.trim().toUpperCase();

  if (upper.startsWith("SELECT") || upper.includes("RETURNING")) {
    const stmt = database.prepare(sql);
    if (!upper.startsWith("SELECT") && upper.includes("RETURNING")) {
      const row = stmt.get(...boundParams);
      return { rows: row ? [row] : [], rowCount: row ? 1 : 0 };
    }
    const rows = stmt.all(...boundParams);
    return { rows, rowCount: rows.length };
  }

  const result = database.prepare(sql).run(...boundParams);
  return { rows: [], rowCount: result.changes };
}
