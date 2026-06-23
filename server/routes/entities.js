import { Router } from "express";
import {
  fetchAll,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getSingleton,
  upsertSingleton,
} from "../db/entityStore.js";
import { requireAuth } from "../middleware/auth.js";
import {
  matchesFilter,
  sortList,
  buildNewProperty,
  applyPropertyUpdate,
  submitOwnerPendingChanges,
  approveOwnerPendingChanges,
  rejectOwnerPendingChanges,
} from "../../src/api/propertyMutations.js";
import { validateVisitBooking } from "../../src/lib/visitSlots.js";
import { getPortalSeedData } from "../../src/api/portalSeed.js";

const router = Router();

const ANON_INSERT = new Set(["visit", "inquiry", "message"]);
const PUBLIC_ENTITY_READ = new Set(["property", "poi"]);

function isPublishedProperty(record) {
  return record?.publication_status === "publicada" && record?.status === "disponible";
}

function parseCriteria(raw) {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

router.get("/:entityType", async (req, res) => {
  try {
    const { entityType } = req.params;
    const criteria = parseCriteria(req.query.criteria);
    const sort = req.query.sort || "-created_date";
    const limit = Math.min(Number(req.query.limit) || 200, 500);

    let list = await fetchAll(entityType);

    if (entityType === "property" && !req.user) {
      list = list.filter(isPublishedProperty);
    }

    list = list.filter((item) => matchesFilter(item, criteria));
    list = sortList(list, sort);
    res.json(list.slice(0, limit));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:entityType/:id", async (req, res) => {
  try {
    const { entityType, id } = req.params;
    const record = await getRecord(entityType, id);
    if (!record) return res.status(404).json({ error: "No encontrado" });

    if (entityType === "property" && !req.user && !isPublishedProperty(record)) {
      return res.status(404).json({ error: "No encontrado" });
    }

    if (!PUBLIC_ENTITY_READ.has(entityType) && !ANON_INSERT.has(entityType) && !req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:entityType", async (req, res) => {
  try {
    const { entityType } = req.params;
    const data = req.body || {};

    if (ANON_INSERT.has(entityType)) {
      if (entityType === "visit") {
        const existing = await fetchAll("visit");
        validateVisitBooking({
          scheduledAt: data.scheduled_at,
          propertyId: data.property_id,
          existingVisits: existing,
        });
        const row = await createRecord(
          "visit",
          {
            ...data,
            status: data.status || "pendiente",
            visit_type: data.visit_type || "presencial",
          },
          "visit"
        );
        return res.status(201).json(row);
      }
      if (entityType === "inquiry") {
        const row = await createRecord(
          "inquiry",
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
        return res.status(201).json(row);
      }
      const row = await createRecord(entityType, data, entityType.slice(0, 3));
      return res.status(201).json(row);
    }

    if (!req.user) return res.status(401).json({ error: "No autenticado" });

    if (entityType === "property") {
      const property = buildNewProperty(data, data.id);
      const row = await createRecord("property", property, "prop");
      return res.status(201).json(row);
    }

    const row = await createRecord(entityType, data, entityType.slice(0, 3));
    res.status(201).json(row);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:entityType/:id", requireAuth, async (req, res) => {
  try {
    const { entityType, id } = req.params;
    const patch = req.body?.patch ?? req.body ?? {};
    const editor = req.body?.editor || req.user.id || req.user.username || "user";
    const action = req.body?.action;

    if (entityType === "property") {
      const current = await getRecord("property", id);
      if (!current) return res.status(404).json({ error: "Propiedad no encontrada" });
      const owners = await fetchAll("owner");
      const role = req.user.role;

      let next;
      if (action === "approve_pending_changes") {
        if (role !== "admin") return res.status(403).json({ error: "No autorizado" });
        next = approveOwnerPendingChanges(current, editor, owners);
      } else if (action === "reject_pending_changes") {
        if (role !== "admin") return res.status(403).json({ error: "No autorizado" });
        next = rejectOwnerPendingChanges(current, editor, req.body?.note || "");
      } else if (role === "owner") {
        if (current.owner_user_id !== req.user.id) {
          return res.status(403).json({ error: "No autorizado para editar este inmueble" });
        }
        next = submitOwnerPendingChanges(current, patch, editor);
      } else {
        next = applyPropertyUpdate(current, patch, editor, owners);
      }

      const row = await updateRecord("property", id, next);
      return res.json(row);
    }

    const current = await getRecord(entityType, id);
    if (!current) return res.status(404).json({ error: "Registro no encontrado" });
    const row = await updateRecord(entityType, id, { ...current, ...patch });
    res.json(row);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:entityType/:id", requireAuth, async (req, res) => {
  try {
    const { entityType, id } = req.params;
    await deleteRecord(entityType, id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const settingsRouter = Router();

settingsRouter.get("/", async (_req, res) => {
  try {
    const row = await getSingleton("admin_settings", "site");
    res.json(row || getPortalSeedData([]).settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

settingsRouter.patch("/", requireAuth, async (req, res) => {
  try {
    const current = (await getSingleton("admin_settings", "site")) || getPortalSeedData([]).settings;
    const next = { ...current, ...req.body, id: "site" };
    const row = await upsertSingleton("admin_settings", "site", next);
    res.json(row);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export { settingsRouter };
export default router;
