import { SEED_PROPERTIES } from "./mockData";
import { createStore } from "./store";
import { getPortalSeedData } from "./portalSeed";
import * as localAuth from "../lib/localAuth";

const STORAGE_KEY = "matchcolombia_properties_v5";
const INQUIRIES_KEY = "matchcolombia_inquiries";
const VISITS_KEY = "matchcolombia_visits";
const MESSAGES_KEY = "matchcolombia_messages";
const APPLICATIONS_KEY = "matchcolombia_applications";
const LEASES_KEY = "matchcolombia_leases";
const PAYMENTS_KEY = "matchcolombia_payments";
const TICKETS_KEY = "matchcolombia_tickets";
const PORTAL_SEEDED_KEY = "matchcolombia_portal_seeded";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function loadProperties() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROPERTIES));
  return [...SEED_PROPERTIES];
}

function saveProperties(properties) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

function generateId(prefix = "prop") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
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
  }
  return sorted;
}

function seedPortalIfNeeded() {
  if (localStorage.getItem(PORTAL_SEEDED_KEY)) return;
  const props = loadProperties();
  const ids = props.slice(0, 2).map((p) => p.id);
  const seed = getPortalSeedData(ids);
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(seed.inquiries));
  localStorage.setItem(VISITS_KEY, JSON.stringify(seed.visits));
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(seed.messages));
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(seed.applications));
  localStorage.setItem(LEASES_KEY, JSON.stringify(seed.leases));
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(seed.payments));
  localStorage.setItem(TICKETS_KEY, JSON.stringify(seed.tickets));
  localStorage.setItem(PORTAL_SEEDED_KEY, "1");
}

seedPortalIfNeeded();

const Property = {
  async filter(criteria = {}, sort = "-created_date", limit = 100) {
    await delay();
    let list = loadProperties().filter((p) => matchesFilter(p, criteria));
    list = sortList(list, sort);
    return list.slice(0, limit);
  },

  async get(id) {
    await delay();
    return loadProperties().find((p) => p.id === id) || null;
  },

  async create(data) {
    await delay(500);
    const properties = loadProperties();
    const property = {
      ...data,
      id: generateId("prop"),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      status: data.status || "disponible",
      images: data.images || [],
      videos: data.videos || [],
      history: [],
    };
    properties.unshift(property);
    saveProperties(properties);
    return property;
  },

  async update(id, patch) {
    await delay(400);
    const properties = loadProperties();
    const idx = properties.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Propiedad no encontrada");
    const history = [...(properties[idx].history || [])];
    if (patch.status && patch.status !== properties[idx].status) {
      history.push({ type: "status", from: properties[idx].status, to: patch.status, at: new Date().toISOString() });
    }
    properties[idx] = { ...properties[idx], ...patch, history, updated_date: new Date().toISOString() };
    saveProperties(properties);
    return properties[idx];
  },

  async delete(id) {
    await delay(400);
    saveProperties(loadProperties().filter((p) => p.id !== id));
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
    }, "inq");
  },
};
const Visit = createStore(VISITS_KEY);
const Message = createStore(MESSAGES_KEY);
const Application = createStore(APPLICATIONS_KEY);
const Lease = createStore(LEASES_KEY);
const Payment = createStore(PAYMENTS_KEY);
const Ticket = createStore(TICKETS_KEY);

const Core = {
  async UploadFile({ file }) {
    await delay(600);
    return { file_url: URL.createObjectURL(file) };
  },
};

export const api = {
  entities: { Property, Inquiry, Visit, Message, Application, Lease, Payment, Ticket },
  integrations: { Core },
  auth: localAuth,
};
