import { query } from "./pool.js";

function rowToRecord(row) {
  if (!row) return null;
  return {
    ...row.record,
    id: row.id,
    created_date: row.record?.created_date || row.created_at,
    updated_date: row.record?.updated_date || row.updated_at,
  };
}

export async function fetchAll(entityType) {
  const { rows } = await query(
    "SELECT * FROM app_records WHERE entity_type = $1 ORDER BY updated_at DESC",
    [entityType]
  );
  return rows.map(rowToRecord);
}

export async function getRecord(entityType, id) {
  const { rows } = await query(
    "SELECT * FROM app_records WHERE entity_type = $1 AND id = $2 LIMIT 1",
    [entityType, id]
  );
  return rowToRecord(rows[0]);
}

export async function createRecord(entityType, data, idPrefix = "item") {
  const now = new Date().toISOString();
  const id = data.id || `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const record = {
    ...data,
    id,
    created_date: data.created_date || now,
    updated_date: now,
  };
  const { rows } = await query(
    `INSERT INTO app_records (entity_type, id, record, created_at, updated_at)
     VALUES ($1, $2, $3::jsonb, $4, $5)
     RETURNING *`,
    [entityType, id, JSON.stringify(record), now, now]
  );
  return rowToRecord(rows[0]);
}

export async function updateRecord(entityType, id, record) {
  const now = new Date().toISOString();
  const payload = { ...record, id, updated_date: now };
  const { rows } = await query(
    `UPDATE app_records SET record = $3::jsonb, updated_at = $4
     WHERE entity_type = $1 AND id = $2
     RETURNING *`,
    [entityType, id, JSON.stringify(payload), now]
  );
  if (!rows[0]) throw new Error("Registro no encontrado");
  return rowToRecord(rows[0]);
}

export async function deleteRecord(entityType, id) {
  const { rowCount } = await query(
    "DELETE FROM app_records WHERE entity_type = $1 AND id = $2",
    [entityType, id]
  );
  if (!rowCount) throw new Error("Registro no encontrado");
  return { ok: true };
}

export async function upsertSingleton(entityType, id, record) {
  const now = new Date().toISOString();
  const payload = { ...record, id, updated_date: now };
  const { rows } = await query(
    `INSERT INTO app_records (entity_type, id, record, created_at, updated_at)
     VALUES ($1, $2, $3::jsonb, $4, $5)
     ON CONFLICT (entity_type, id) DO UPDATE
     SET record = EXCLUDED.record, updated_at = EXCLUDED.updated_at
     RETURNING *`,
    [entityType, id, JSON.stringify(payload), record.created_at || now, now]
  );
  return rowToRecord(rows[0]);
}

export async function getSingleton(entityType, id) {
  return getRecord(entityType, id);
}
