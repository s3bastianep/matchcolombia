import { SEED_PROPERTIES } from "./mockData";
import * as localAuth from "../lib/localAuth";

const STORAGE_KEY = "matchcolombia_properties_v5";
const INQUIRIES_KEY = "arriendobog_inquiries";

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

function generateId() {
  return `prop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function matchesFilter(property, criteria) {
  return Object.entries(criteria).every(([key, value]) => {
    if (value === undefined || value === null || value === "") return true;
    return property[key] === value;
  });
}

function sortProperties(list, sortField) {
  const sorted = [...list];
  if (sortField === "-created_date") {
    sorted.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }
  return sorted;
}

const Property = {
  async filter(criteria = {}, sort = "-created_date", limit = 100) {
    await delay();
    let list = loadProperties();
    list = list.filter((p) => matchesFilter(p, criteria));
    list = sortProperties(list, sort);
    return list.slice(0, limit);
  },

  async create(data) {
    await delay(500);
    const properties = loadProperties();
    const property = {
      ...data,
      id: generateId(),
      created_date: new Date().toISOString(),
      status: data.status || "disponible",
    };
    properties.unshift(property);
    saveProperties(properties);
    return property;
  },
};

const Inquiry = {
  async create(data) {
    await delay(400);
    const inquiries = JSON.parse(localStorage.getItem(INQUIRIES_KEY) || "[]");
    const inquiry = { ...data, id: `inq-${Date.now()}`, created_date: new Date().toISOString() };
    inquiries.push(inquiry);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    return inquiry;
  },
};

const Core = {
  async UploadFile({ file }) {
    await delay(600);
    return { file_url: URL.createObjectURL(file) };
  },
};

export const api = {
  entities: { Property, Inquiry },
  integrations: { Core },
  auth: localAuth,
};
