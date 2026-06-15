import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/panels/StatusBadge";
import { PROPERTY_WORKFLOW, PHOTO_CATEGORIES } from "@/lib/adminConstants";

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

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const workflow = form.publication_status || (form.status === "disponible" ? "publicada" : form.status);

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
