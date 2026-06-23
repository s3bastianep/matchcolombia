import { getDb } from "./pool.js";

export async function migrate() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      role TEXT NOT NULL DEFAULT 'seeker',
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS app_records (
      entity_type TEXT NOT NULL,
      id TEXT NOT NULL,
      record TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (entity_type, id)
    );

    CREATE INDEX IF NOT EXISTS users_username_idx ON users (username);
    CREATE INDEX IF NOT EXISTS app_records_entity_idx ON app_records (entity_type);
  `);
}
