import { apiRequest } from "@/lib/railwayClient";
import { validateVisitBooking } from "@/lib/visitSlots";
import { seedAdminNotificationsIfNeeded } from "@/lib/adminNotifications";
import { notifySiteBrandingUpdated, setSiteLogo } from "@/lib/siteBranding";
import * as railwayAuth from "@/lib/railwayAuth";

function notifyPropertiesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("properties-updated"));
  }
}

function entityPath(type) {
  return `/entities/${type}`;
}

function createEntityStore(entityType, idPrefix = "item") {
  return {
    async filter(criteria = {}, sort = "-created_date", limit = 200) {
      const params = new URLSearchParams({
        sort,
        limit: String(limit),
        criteria: JSON.stringify(criteria),
      });
      return apiRequest(`${entityPath(entityType)}?${params}`);
    },

    async get(id) {
      return apiRequest(`${entityPath(entityType)}/${id}`);
    },

    async create(data) {
      return apiRequest(entityPath(entityType), { method: "POST", body: data });
    },

    async update(id, patch) {
      return apiRequest(`${entityPath(entityType)}/${id}`, {
        method: "PATCH",
        body: { patch },
      });
    },

    async delete(id) {
      return apiRequest(`${entityPath(entityType)}/${id}`, { method: "DELETE" });
    },
  };
}

const Property = {
  ...createEntityStore("property", "prop"),
  async create(data) {
    const row = await apiRequest("/entities/property", { method: "POST", body: data });
    notifyPropertiesUpdated();
    return row;
  },
  async update(id, patch, editor = "admin", options = {}) {
    const row = await apiRequest(`/entities/property/${id}`, {
      method: "PATCH",
      body: { patch, editor, action: options.action, note: options.note },
    });
    notifyPropertiesUpdated();
    return row;
  },
  async delete(id) {
    const row = await apiRequest(`/entities/property/${id}`, { method: "DELETE" });
    notifyPropertiesUpdated();
    return row;
  },
};

const InquiryStore = createEntityStore("inquiry", "inq");
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
    });
  },
};

const VisitStore = createEntityStore("visit", "visit");
const Visit = {
  ...VisitStore,
  async create(data) {
    const existing = await VisitStore.filter({}, "-created_date", 500);
    validateVisitBooking({
      scheduledAt: data.scheduled_at,
      propertyId: data.property_id,
      existingVisits: existing,
    });
    return VisitStore.create({
      ...data,
      status: data.status || "pendiente",
      visit_type: data.visit_type || "presencial",
    });
  },
};

const Message = createEntityStore("message");
const Application = createEntityStore("application");
const Lease = createEntityStore("lease");
const Payment = createEntityStore("payment");
const Ticket = createEntityStore("ticket");
const POI = createEntityStore("poi");

const OwnerStore = createEntityStore("owner");
const Owner = {
  ...OwnerStore,
  async getByUserId(userId) {
    const list = await OwnerStore.filter({ user_id: userId }, "-created_date", 1);
    return list[0] || null;
  },
};

const AdminSettings = {
  async get() {
    return apiRequest("/settings");
  },
  async update(patch) {
    const row = await apiRequest("/settings", { method: "PATCH", body: patch });
    if ("site_logo" in patch) {
      try {
        setSiteLogo(patch.site_logo || null);
      } catch {
        /* cache local opcional */
      }
      notifySiteBrandingUpdated();
    }
    return row;
  },
};

const Core = {
  async UploadFile({ file }) {
    const form = new FormData();
    form.append("file", file);
    return apiRequest("/upload", { method: "POST", body: form });
  },
};

export async function initRailwayApi() {
  railwayAuth.initRailwayAuth();
  try {
    await railwayAuth.me();
  } catch {
    /* sesión inválida */
  }
  try {
    seedAdminNotificationsIfNeeded();
  } catch (err) {
    console.warn("HABIBAR: notificaciones admin", err);
  }
}

export const api = {
  entities: { Property, Inquiry, Visit, Message, Application, Lease, Payment, Ticket, Owner, POI, AdminSettings },
  integrations: { Core },
  auth: railwayAuth,
};
