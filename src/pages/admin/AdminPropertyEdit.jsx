import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/panels/StatusBadge";
import { PROPERTY_WORKFLOW, PHOTO_CATEGORIES } from "@/lib/adminConstants";
import { hasPendingOwnerChanges } from "@/api/propertyMutations";
import { Check, X } from "lucide-react";

export default function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: property, isLoading } = useQuery({
    queryKey: ["admin-property", id],
    queryFn: () => api.entities.Property.get(id),
  });
  const { data: owners = [] } = useQuery({
    queryKey: ["admin-owners"],
    queryFn: () => api.entities.Owner.filter({}, "-created_date", 100),
  });

  const [form, setForm] = useState(null);

  React.useEffect(() => {
    if (property && !form) setForm({ ...property });
  }, [property, form]);

  const save = useMutation({
    mutationFn: (data) => {
      const { id: _id, history, audit_log, created_date, ...patch } = data;
      return api.entities.Property.update(id, patch);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      navigate("/admin/propiedades");
    },
  });

  const approvePending = useMutation({
    mutationFn: () => api.entities.Property.update(id, {}, "admin", { action: "approve_pending_changes" }),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      qc.invalidateQueries({ queryKey: ["admin-property", id] });
      qc.invalidateQueries({ queryKey: ["owner-properties"] });
      if (updated) setForm({ ...updated });
    },
  });

  const rejectPending = useMutation({
    mutationFn: () => api.entities.Property.update(id, {}, "admin", { action: "reject_pending_changes" }),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      qc.invalidateQueries({ queryKey: ["admin-property", id] });
      qc.invalidateQueries({ queryKey: ["owner-properties"] });
      if (updated) setForm({ ...updated });
    },
  });

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const workflow = form.publication_status || (form.status === "disponible" ? "publicada" : form.status);
  const pending = property?.pending_changes;
  const pendingPatch = pending?.patch || {};
  const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

  const pendingFields = [
    { key: "title", label: "Título" },
    { key: "description", label: "Descripción" },
    { key: "monthly_rent", label: "Arriendo/mes", format: formatCOP },
    { key: "admin_fee", label: "Administración", format: formatCOP },
    { key: "neighborhood", label: "Barrio" },
    { key: "address", label: "Dirección" },
  ].filter((f) => pendingPatch[f.key] !== undefined);

  const updateImageCategory = (idx, category) => {
    const meta = [...(form.image_meta || form.images?.map(() => ({})) || [])];
    while (meta.length < (form.images?.length || 0)) meta.push({});
    meta[idx] = { ...meta[idx], category };
    setForm((f) => ({ ...f, image_meta: meta }));
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold">Editar propiedad</h2>
        {form.reference_code && (
          <span className="text-xs font-mono font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
            {form.reference_code}
          </span>
        )}
      </div>

      {hasPendingOwnerChanges(property) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 space-y-4">
          <div>
            <p className="font-extrabold text-amber-900">Cambios solicitados por el propietario</p>
            <p className="text-xs text-amber-800/90 mt-1">
              Enviados el{" "}
              {new Date(pending.submitted_at).toLocaleString("es-CO")}
              {pending.submitted_by ? ` · ${pending.submitted_by}` : ""}
            </p>
          </div>
          <div className="space-y-2">
            {pendingFields.map((f) => (
              <div key={f.key} className="grid sm:grid-cols-2 gap-2 text-sm bg-white/70 rounded-xl p-3 border border-amber-500/15">
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">{f.label} actual</p>
                  <p className="font-medium mt-0.5">
                    {f.format ? f.format(property[f.key]) : (property[f.key] || "—")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-amber-800">Propuesto</p>
                  <p className="font-bold text-amber-900 mt-0.5">
                    {f.format ? f.format(pendingPatch[f.key]) : (pendingPatch[f.key] || "—")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => approvePending.mutate()}
              disabled={approvePending.isPending || rejectPending.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              <Check className="w-4 h-4 mr-1" />
              {approvePending.isPending ? "Aprobando…" : "Aprobar cambios"}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.confirm("¿Rechazar los cambios del propietario?") && rejectPending.mutate()}
              disabled={approvePending.isPending || rejectPending.isPending}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              {rejectPending.isPending ? "Rechazando…" : "Rechazar"}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border/40 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground">Workflow</label>
            <select
              value={workflow}
              onChange={(e) => set("publication_status", e.target.value)}
              className="mt-1 w-full text-sm border rounded-lg px-3 py-2 bg-white"
            >
              {PROPERTY_WORKFLOW.map((w) => (
                <option key={w.key} value={w.key}>{w.label}</option>
              ))}
            </select>
            <div className="mt-1"><StatusBadge status={workflow} /></div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">Propietario</label>
            <select
              value={form.owner_user_id || ""}
              onChange={(e) => set("owner_user_id", e.target.value || null)}
              className="mt-1 w-full text-sm border rounded-lg px-3 py-2 bg-white"
            >
              <option value="">Sin asignar</option>
              {owners.map((o) => (
                <option key={o.id} value={o.user_id}>{o.name} ({o.verification_status})</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground">Título</label>
          <Input value={form.title || ""} onChange={(e) => set("title", e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground">Descripción</label>
          <Textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} rows={4} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground">Arriendo/mes</label>
            <Input type="number" value={form.monthly_rent || ""} onChange={(e) => set("monthly_rent", Number(e.target.value))} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">Administración</label>
            <Input type="number" value={form.admin_fee || ""} onChange={(e) => set("admin_fee", Number(e.target.value))} className="mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground">Barrio</label>
            <Input value={form.neighborhood || ""} onChange={(e) => set("neighborhood", e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">Dirección</label>
            <Input value={form.address || ""} onChange={(e) => set("address", e.target.value)} className="mt-1" />
          </div>
        </div>

        {form.images?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2">Categorías de fotos</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.images.map((url, i) => (
                <div key={i} className="rounded-xl border overflow-hidden">
                  <img src={url} alt="" className="w-full h-24 object-cover" />
                  <select
                    value={form.image_meta?.[i]?.category || ""}
                    onChange={(e) => updateImageCategory(i, e.target.value)}
                    className="w-full text-[10px] border-t px-2 py-1.5"
                  >
                    <option value="">Sin categoría</option>
                    {PHOTO_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {form.history?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2">Histórico de workflow</p>
            <ul className="text-xs space-y-1 text-muted-foreground max-h-32 overflow-y-auto">
              {form.history.map((h, i) => (
                <li key={i}>{h.from} → {h.to} · {new Date(h.at).toLocaleDateString("es-CO")} ({h.by})</li>
              ))}
            </ul>
          </div>
        )}

        {form.audit_log?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2">Auditoría ({form.audit_log.length})</p>
            <ul className="text-[10px] space-y-0.5 text-muted-foreground max-h-24 overflow-y-auto">
              {form.audit_log.slice(-8).map((a, i) => (
                <li key={i}>{a.field || a.action} · {new Date(a.at).toLocaleString("es-CO")}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button onClick={() => save.mutate(form)} disabled={save.isPending} className="gradient-cta text-white font-bold">
            Guardar cambios
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/propiedades")}>Cancelar</Button>
        </div>
        {save.isError && (
          <p className="text-sm text-red-600">{save.error?.message || "Error al guardar"}</p>
        )}
      </div>
    </div>
  );
}
