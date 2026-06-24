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

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      user_id TEXT,
      event_type TEXT NOT NULL,
      path TEXT NOT NULL DEFAULT '/',
      label TEXT NOT NULL DEFAULT '',
      target TEXT NOT NULL DEFAULT '',
      device TEXT NOT NULL DEFAULT 'unknown',
      meta TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events (created_at);
    CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON analytics_events (event_type);
    CREATE INDEX IF NOT EXISTS analytics_events_path_idx ON analytics_events (path);
  `);
}
