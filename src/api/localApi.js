import { SEED_PROPERTIES } from "./mockData";
import { createStore } from "./store";
import { getPortalSeedData } from "./portalSeed";
import { workflowToPublicStatus } from "../lib/adminConstants";
import { validateVisitBooking } from "../lib/visitSlots";
import { seedAdminNotificationsIfNeeded } from "../lib/adminNotifications";
import * as localAuth from "../lib/localAuth";

const STORAGE_KEY = "matchcolombia_properties_v11";
const INQUIRIES_KEY = "matchcolombia_inquiries";
const VISITS_KEY = "matchcolombia_visits";
const MESSAGES_KEY = "matchcolombia_messages";
const APPLICATIONS_KEY = "matchcolombia_applications";
const LEASES_KEY = "matchcolombia_leases";
const PAYMENTS_KEY = "matchcolombia_payments";
const TICKETS_KEY = "matchcolombia_tickets";
const OWNERS_KEY = "matchcolombia_owners";
const POIS_KEY = "matchcolombia_pois";
const SETTINGS_KEY = "matchcolombia_admin_settings";
const PORTAL_SEEDED_KEY = "matchcolombia_portal_seeded_v2";

import { apiDelay } from "../lib/apiDelay";
import { notifySiteBrandingUpdated } from "../lib/siteBranding";

const delay = apiDelay;

function notifyPropertiesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("properties-updated"));
  }
}

function loadProperties() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROPERTIES));
  } catch (err) {
    console.warn("LUMORA HOME: no se pudo guardar propiedades iniciales", err);
  }
  return [...SEED_PROPERTIES];
}

function saveProperties(properties) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  } catch (err) {
    console.warn("LUMORA HOME: no se pudo guardar propiedades", err);
  }
}

function generateId(prefix = "prop") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeRefCode(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 33 + id.charCodeAt(i)) >>> 0;
  return `REF${String(1000000 + (hash % 8999999))}`;
}

function loadVisits() {
  try {
    const raw = localStorage.getItem(VISITS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* empty */
  }
  return [];
}

function loadOwners() {
  try {
    const raw = localStorage.getItem(OWNERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* empty */
  }
  return [];
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* empty */
  }
  return null;
}

function saveSettings(data) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...data, updated_at: new Date().toISOString() }));
}

function matchesFilter(item, criteria) {
  return Object.entries(criteria).every(([key, value]) => {
    if (value === undefined || value === null || value === "") return true;
    return item[key] === value;
  });
}

function sortList(list, sortField) {
  const sorted = [...list];
  if (sortField === "-created_date") {
    sorted.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
  } else if (sortField === "-updated_date") {
    sorted.sort((a, b) => new Date(b.updated_date || b.created_date || 0) - new Date(a.updated_date || a.created_date || 0));
  } else if (sortField === "-listed_date") {
    sorted.sort((a, b) => {
      const listed = (item) =>
        new Date(item.published_at || item.reviewed_at || item.updated_date || item.created_date || 0).getTime();
      return listed(b) - listed(a);
    });
  }
  return sorted;
}

function seedPortalIfNeeded() {
  try {
    const props = loadProperties();
    const ids = props.slice(0, 2).map((p) => p.id);
    const seed = getPortalSeedData(ids);

    if (!localStorage.getItem(PORTAL_SEEDED_KEY)) {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(seed.inquiries));
      localStorage.setItem(VISITS_KEY, JSON.stringify(seed.visits));
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(seed.messages));
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(seed.applications));
      localStorage.setItem(LEASES_KEY, JSON.stringify(seed.leases));
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(seed.payments));
      localStorage.setItem(TICKETS_KEY, JSON.stringify(seed.tickets));
      localStorage.setItem(OWNERS_KEY, JSON.stringify(seed.owners));
      localStorage.setItem(POIS_KEY, JSON.stringify(seed.pois));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(seed.settings));
      localStorage.setItem(PORTAL_SEEDED_KEY, "1");
      return;
    }

    if (!localStorage.getItem(OWNERS_KEY)) {
      localStorage.setItem(OWNERS_KEY, JSON.stringify(seed.owners));
    }
    if (!localStorage.getItem(POIS_KEY)) {
      localStorage.setItem(POIS_KEY, JSON.stringify(seed.pois));
    }
    if (!localStorage.getItem(SETTINGS_KEY)) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(seed.settings));
    }
  } catch {
    /* ignore corrupt demo seed data */
  }
}

export function initLocalApi() {
  if (typeof window === "undefined") return;
  try {
    seedPortalIfNeeded();
    seedAdminNotificationsIfNeeded();
    localAuth.initLocalAuth();
  } catch (err) {
    console.warn("LUMORA HOME: seed del portal falló", err);
  }
}

const Property = {
  async filter(criteria = {}, sort = "-created_date", limit = 100) {
    let list = loadProperties().filter((p) => matchesFilter(p, criteria));
    list = sortList(list, sort);
    return list.slice(0, limit);
  },

  async get(id) {
    return loadProperties().find((p) => p.id === id) || null;
  },

  async create(data) {
    await delay(150);
    const properties = loadProperties();
    const id = generateId("prop");
    const publication_status = data.publication_status || "borrador";
    const isPublished = publication_status === "publicada";
    const now = new Date().toISOString();
    const property = {
      ...data,
      id,
      reference_code: data.reference_code || makeRefCode(id),
      publication_status,
      status: data.status || workflowToPublicStatus(publication_status),
      created_date: now,
      updated_date: now,
      published_at: isPublished ? (data.published_at || now) : data.published_at || null,
      reviewed_at: isPublished ? (data.reviewed_at || now) : data.reviewed_at || null,
      images: data.images || [],
      image_meta: data.image_meta || [],
      videos: data.videos || [],
      history: [],
      audit_log: [{ action: "created", at: now, by: data.created_by || "admin" }],
      owner_user_id: data.owner_user_id || null,
    };
    properties.unshift(property);
    saveProperties(properties);
    notifyPropertiesUpdated();
    return property;
  },

  async update(id, patch, editor = "admin") {
    await delay(120);
    const properties = loadProperties();
    const idx = properties.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Propiedad no encontrada");
    const current = properties[idx];
    const nextPublication = patch.publication_status ?? current.publication_status;
    if (nextPublication === "publicada") {
      const ownerUserId = patch.owner_user_id ?? current.owner_user_id;
      if (ownerUserId) {
        const owner = loadOwners().find((o) => o.user_id === ownerUserId);
        if (owner && owner.verification_status !== "verificado") {
          throw new Error("El propietario debe estar verificado para publicar el inmueble.");
        }
      }
    }
    const history = [...(current.history || [])];
    const audit_log = [...(current.audit_log || [])];
    if (patch.publication_status && patch.publication_status !== current.publication_status) {
      history.push({ type: "workflow", from: current.publication_status, to: patch.publication_status, at: new Date().toISOString(), by: editor });
    }
    if (patch.status && patch.status !== current.status) {
      history.push({ type: "status", from: current.status, to: patch.status, at: new Date().toISOString(), by: editor });
    }
    Object.entries(patch).forEach(([key, val]) => {
      if (current[key] !== val && !["history", "audit_log", "updated_date"].includes(key)) {
        audit_log.push({ field: key, at: new Date().toISOString(), by: editor });
      }
    });
    const publication_status = patch.publication_status ?? current.publication_status;
    const syncedStatus = patch.publication_status ? workflowToPublicStatus(publication_status) : patch.status;
    const now = new Date().toISOString();
    const becamePublished = publication_status === "publicada" && current.publication_status !== "publicada";
    properties[idx] = {
      ...current,
      ...patch,
      publication_status,
      status: syncedStatus ?? patch.status ?? current.status,
      history,
      audit_log: audit_log.slice(-80),
      updated_date: now,
      published_at: becamePublished ? now : (patch.published_at ?? current.published_at ?? null),
      reviewed_at: becamePublished && !current.reviewed_at
        ? now
        : (patch.reviewed_at ?? current.reviewed_at ?? null),
    };
    saveProperties(properties);
    notifyPropertiesUpdated();
    return properties[idx];
  },

  async delete(id) {
    await delay(80);
    saveProperties(loadProperties().filter((p) => p.id !== id));
    notifyPropertiesUpdated();
    return { ok: true };
  },
};

const InquiryStore = createStore(INQUIRIES_KEY);
const Inquiry = {
  ...InquiryStore,
  async create(data) {
    return InquiryStore.create({
      ...data,
      pipeline_stage: data.pipeline_stage || "nuevo",
      status: data.status || "nueva",
      source: data.source || "web",
      tags: data.tags || [],
      internal_notes: data.internal_notes || "",
      needs_reply: true,
    }, "inq");
  },
};
const VisitStore = createStore(VISITS_KEY);
const Visit = {
  ...VisitStore,
  async create(data) {
    const existing = loadVisits();
    validateVisitBooking({
      scheduledAt: data.scheduled_at,
      propertyId: data.property_id,
      existingVisits: existing,
    });
    return VisitStore.create({
      ...data,
      status: data.status || "pendiente",
      visit_type: data.visit_type || "presencial",
    }, "visit");
  },
};
const Message = createStore(MESSAGES_KEY);
const Application = createStore(APPLICATIONS_KEY);
const Lease = createStore(LEASES_KEY);
const Payment = createStore(PAYMENTS_KEY);
const Ticket = createStore(TICKETS_KEY);
const Owner = {
  ...createStore(OWNERS_KEY, []),
  async getByUserId(userId) {
    return loadOwners().find((o) => o.user_id === userId) || null;
  },
};
const POI = createStore(POIS_KEY, []);
const AdminSettings = {
  async get() {
    await delay(50);
    return loadSettings() || getPortalSeedData([]).settings;
  },
  async update(patch) {
    await delay(100);
    const current = (await this.get()) || {};
    saveSettings({ ...current, ...patch });
    if ("site_logo" in patch) notifySiteBrandingUpdated();
    return loadSettings();
  },
};

const Core = {
  async UploadFile({ file }) {
    await delay(600);
    return { file_url: URL.createObjectURL(file) };
  },
};

export const api = {
  entities: { Property, Inquiry, Visit, Message, Application, Lease, Payment, Ticket, Owner, POI, AdminSettings },
  integrations: { Core },
  auth: localAuth,
};
