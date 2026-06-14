const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export function createStore(storageKey, seedData = []) {
  function load() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {
      /* empty */
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(seedData));
    } catch (err) {
      console.warn(`MatchColombia: no se pudo inicializar ${storageKey}`, err);
    }
    return [...seedData];
  }

  function save(items) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (err) {
      console.warn(`MatchColombia: no se pudo guardar ${storageKey}`, err);
    }
  }

  function matches(item, criteria) {
    return Object.entries(criteria).every(([key, value]) => {
      if (value === undefined || value === null || value === "") return true;
      return item[key] === value;
    });
  }

  function sortList(list, sortField) {
    const sorted = [...list];
    if (sortField?.startsWith("-")) {
      const field = sortField.slice(1);
      sorted.sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av === bv) return 0;
        return av > bv ? -1 : 1;
      });
    } else if (sortField) {
      sorted.sort((a, b) => {
        const av = a[sortField];
        const bv = b[sortField];
        if (av === bv) return 0;
        return av > bv ? 1 : -1;
      });
    }
    return sorted;
  }

  return {
    async filter(criteria = {}, sort = "-created_date", limit = 200) {
      let list = load().filter((item) => matches(item, criteria));
      list = sortList(list, sort);
      return list.slice(0, limit);
    },

    async get(id) {
      return load().find((item) => item.id === id) || null;
    },

    async create(data, idPrefix = "item") {
      await delay(120);
      const items = load();
      const item = {
        ...data,
        id: data.id || `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        created_date: data.created_date || new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };
      items.unshift(item);
      save(items);
      return item;
    },

    async update(id, patch) {
      await delay(120);
      const items = load();
      const idx = items.findIndex((item) => item.id === id);
      if (idx === -1) throw new Error("Registro no encontrado");
      items[idx] = { ...items[idx], ...patch, updated_date: new Date().toISOString() };
      save(items);
      return items[idx];
    },

    async delete(id) {
      await delay(80);
      const items = load().filter((item) => item.id !== id);
      save(items);
      return { ok: true };
    },
  };
}
