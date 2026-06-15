import { matchesFilter, sortList } from "./propertyMutations";

function rowToRecord(row) {
  if (!row) return null;
  return {
    ...row.record,
    id: row.id,
    created_date: row.record?.created_date || row.created_at,
    updated_date: row.record?.updated_date || row.updated_at,
  };
}

export function createSupabaseStore(client, entityType, options = {}) {
  const table = options.table || "app_records";

  async function fetchAll() {
    const { data, error } = await client.from(table).select("*").eq("entity_type", entityType);
    if (error) throw new Error(error.message);
    return (data || []).map(rowToRecord);
  }

  return {
    async filter(criteria = {}, sort = "-created_date", limit = 200) {
      let list = (await fetchAll()).filter((item) => matchesFilter(item, criteria));
      list = sortList(list, sort);
      return list.slice(0, limit);
    },

    async get(id) {
      const { data, error } = await client
        .from(table)
        .select("*")
        .eq("entity_type", entityType)
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return rowToRecord(data);
    },

    async create(data, idPrefix = "item") {
      const now = new Date().toISOString();
      const id = data.id || `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const record = {
        ...data,
        id,
        created_date: data.created_date || now,
        updated_date: now,
      };

      const { data: row, error } = await client
        .from(table)
        .insert({
          id,
          entity_type: entityType,
          record,
          created_at: now,
          updated_at: now,
        })
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return rowToRecord(row);
    },

    async update(id, patch) {
      const current = await this.get(id);
      if (!current) throw new Error("Registro no encontrado");

      const now = new Date().toISOString();
      const record = { ...current, ...patch, id, updated_date: now };

      const { data: row, error } = await client
        .from(table)
        .update({ record, updated_at: now })
        .eq("entity_type", entityType)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return rowToRecord(row);
    },

    async delete(id) {
      const { error } = await client.from(table).delete().eq("entity_type", entityType).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true };
    },
  };
}

export async function upsertSingletonRecord(client, entityType, id, record) {
  const now = new Date().toISOString();
  const payload = {
    id,
    entity_type: entityType,
    record: { ...record, id, updated_date: now },
    created_at: record.created_at || now,
    updated_at: now,
  };

  const { data, error } = await client
    .from("app_records")
    .upsert(payload, { onConflict: "entity_type,id" })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return rowToRecord(data);
}

export async function getSingletonRecord(client, entityType, id) {
  const { data, error } = await client
    .from("app_records")
    .select("*")
    .eq("entity_type", entityType)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return rowToRecord(data);
}
