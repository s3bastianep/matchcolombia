import { workflowToPublicStatus } from "../lib/adminConstants.js";

export function generatePropertyId() {
  return `prop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function makeRefCode(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 33 + id.charCodeAt(i)) >>> 0;
  return `REF${String(1000000 + (hash % 8999999))}`;
}

export function buildNewProperty(data, id = generatePropertyId()) {
  const publication_status = data.publication_status || "borrador";
  const isPublished = publication_status === "publicada";
  const now = new Date().toISOString();

  return {
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
}

export function applyPropertyUpdate(current, patch, editor = "admin", owners = []) {
  const nextPublication = patch.publication_status ?? current.publication_status;
  if (nextPublication === "publicada") {
    const ownerUserId = patch.owner_user_id ?? current.owner_user_id;
    if (ownerUserId) {
      const owner = owners.find((o) => o.user_id === ownerUserId);
      if (owner && owner.verification_status !== "verificado") {
        throw new Error("El propietario debe estar verificado para publicar el inmueble.");
      }
    }
  }

  const history = [...(current.history || [])];
  const audit_log = [...(current.audit_log || [])];

  if (patch.publication_status && patch.publication_status !== current.publication_status) {
    history.push({
      type: "workflow",
      from: current.publication_status,
      to: patch.publication_status,
      at: new Date().toISOString(),
      by: editor,
    });
  }
  if (patch.status && patch.status !== current.status) {
    history.push({
      type: "status",
      from: current.status,
      to: patch.status,
      at: new Date().toISOString(),
      by: editor,
    });
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

  return {
    ...current,
    ...patch,
    publication_status,
    status: syncedStatus ?? patch.status ?? current.status,
    history,
    audit_log: audit_log.slice(-80),
    updated_date: now,
    published_at: becamePublished ? now : (patch.published_at ?? current.published_at ?? null),
    reviewed_at: becamePublished && !current.reviewed_at ? now : (patch.reviewed_at ?? current.reviewed_at ?? null),
  };
}

export function matchesFilter(item, criteria) {
  return Object.entries(criteria).every(([key, value]) => {
    if (value === undefined || value === null || value === "") return true;
    return item[key] === value;
  });
}

export function sortList(list, sortField) {
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
  } else if (sortField?.startsWith("-")) {
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
