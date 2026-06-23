-- HABIBAR — PostgreSQL en Railway

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'seeker',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_username_idx ON users (username);

CREATE TABLE IF NOT EXISTS app_records (
  entity_type TEXT NOT NULL,
  id TEXT NOT NULL,
  record JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (entity_type, id)
);

CREATE INDEX IF NOT EXISTS app_records_entity_idx ON app_records (entity_type);
CREATE INDEX IF NOT EXISTS app_records_property_status_idx
  ON app_records ((record->>'status'))
  WHERE entity_type = 'property';
