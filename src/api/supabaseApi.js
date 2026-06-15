import { supabase } from "@/lib/supabaseClient";
import { validateVisitBooking } from "@/lib/visitSlots";
import { seedAdminNotificationsIfNeeded } from "@/lib/adminNotifications";
import { notifySiteBrandingUpdated } from "@/lib/siteBranding";
import { getPortalSeedData } from "./portalSeed";
import { createSupabaseStore, getSingletonRecord, upsertSingletonRecord } from "./entityRepository";
import {
  applyPropertyUpdate,
  buildNewProperty,
  generatePropertyId,
  matchesFilter,
  sortList,
} from "./propertyMutations";
import * as supabaseAuth from "@/lib/supabaseAuth";

function notifyPropertiesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("properties-updated"));
  }
}

async function loadOwnersList() {
  return createSupabaseStore(supabase, "owner").filter({}, "-created_date", 500);
}

const Property = {
  async filter(criteria = {}, sort = "-created_date", limit = 100) {
    let list = (await createSupabaseStore(supabase, "property").filter({}, sort, 500)).filter((p) =>
      matchesFilter(p, criteria)
    );
    list = sortList(list, sort);
    return list.slice(0, limit);
  },

  async get(id) {
    return createSupabaseStore(supabase, "property").get(id);
  },

  async create(data) {
    const property = buildNewProperty(data, data.id || generatePropertyId());
    const row = await createSupabaseStore(supabase, "property").create(property, "prop");
    notifyPropertiesUpdated();
    return row;
  },

  async update(id, patch, editor = "admin") {
    const store = createSupabaseStore(supabase, "property");
    const current = await store.get(id);
    if (!current) throw new Error("Propiedad no encontrada");
    const owners = await loadOwnersList();
    const next = applyPropertyUpdate(current, patch, editor, owners);
    const row = await store.update(id, next);
    notifyPropertiesUpdated();
    return row;
  },

  async delete(id) {
    await createSupabaseStore(supabase, "property").delete(id);
    notifyPropertiesUpdated();
    return { ok: true };
  },
};

const InquiryStore = createSupabaseStore(supabase, "inquiry");
const Inquiry = {
  ...InquiryStore,
  async create(data) {
    return InquiryStore.create(
      {
        ...data,
        pipeline_stage: data.pipeline_stage || "nuevo",
        status: data.status || "nueva",
        source: data.source || "web",
        tags: data.tags || [],
        internal_notes: data.internal_notes || "",
        needs_reply: true,
      },
      "inq"
    );
  },
};

const VisitStore = createSupabaseStore(supabase, "visit");
const Visit = {
  ...VisitStore,
  async create(data) {
    const existing = await VisitStore.filter({}, "-created_date", 500);
    validateVisitBooking({
      scheduledAt: data.scheduled_at,
      propertyId: data.property_id,
      existingVisits: existing,
    });
    return VisitStore.create(
      {
        ...data,
        status: data.status || "pendiente",
        visit_type: data.visit_type || "presencial",
      },
      "visit"
    );
  },
};

const Message = createSupabaseStore(supabase, "message");
const Application = createSupabaseStore(supabase, "application");
const Lease = createSupabaseStore(supabase, "lease");
const Payment = createSupabaseStore(supabase, "payment");
const Ticket = createSupabaseStore(supabase, "ticket");
const POI = createSupabaseStore(supabase, "poi");

const OwnerStore = createSupabaseStore(supabase, "owner");
const Owner = {
  ...OwnerStore,
  async getByUserId(userId) {
    const list = await OwnerStore.filter({ user_id: userId }, "-created_date", 1);
    return list[0] || null;
  },
};

const AdminSettings = {
  async get() {
    const row = await getSingletonRecord(supabase, "admin_settings", "site");
    if (row) return row;
    return getPortalSeedData([]).settings;
  },
  async update(patch) {
    const current = (await this.get()) || {};
    const next = { ...current, ...patch };
    const row = await upsertSingletonRecord(supabase, "admin_settings", "site", next);
    if ("site_logo" in patch) notifySiteBrandingUpdated();
    return row;
  },
};

const Core = {
  async UploadFile({ file }) {
    const ext = file.name.split(".").pop() || "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("uploads").getPublicUrl(path);
    return { file_url: data.publicUrl };
  },
};

export async function initSupabaseApi() {
  supabaseAuth.initSupabaseAuth();
  try {
    seedAdminNotificationsIfNeeded();
  } catch (err) {
    console.warn("LUMORA HOME: notificaciones admin", err);
  }
}

export const api = {
  entities: { Property, Inquiry, Visit, Message, Application, Lease, Payment, Ticket, Owner, POI, AdminSettings },
  integrations: { Core },
  auth: supabaseAuth,
};
