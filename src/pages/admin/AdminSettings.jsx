import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MapPin } from "lucide-react";

export default function AdminSettings() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => base44.entities.AdminSettings.get(),
  });
  const { data: pois = [] } = useQuery({
    queryKey: ["admin-pois"],
    queryFn: () => base44.entities.POI.filter({}, "-created_date", 200),
  });

  const [form, setForm] = useState(null);
  const [newPoi, setNewPoi] = useState({ name: "", city: "Bogotá", neighborhood: "", category: "Comercio" });

  useEffect(() => {
    if (settings && !form) setForm({ ...settings });
  }, [settings, form]);

  const saveSettings = useMutation({
    mutationFn: (patch) => base44.entities.AdminSettings.update(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-settings"] }),
  });

  const addPoi = useMutation({
    mutationFn: (data) => base44.entities.POI.create(data, "poi"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pois"] });
      setNewPoi({ name: "", city: "Bogotá", neighborhood: "", category: "Comercio" });
    },
  });

  const removePoi = useMutation({
    mutationFn: (id) => base44.entities.POI.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-pois"] }),
  });

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  const updateTemplate = (idx, field, value) => {
    const templates = [...(form.whatsapp_templates || [])];
    templates[idx] = { ...templates[idx], [field]: value };
    setForm((f) => ({ ...f, whatsapp_templates: templates }));
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl font-extrabold">Configuración</h2>
        <p className="text-sm text-muted-foreground">Plantillas WhatsApp, POIs y horarios bloqueados.</p>
      </div>

      <section className="bg-white rounded-2xl border border-border/40 p-6 space-y-4">
        <h3 className="font-bold">Plantillas WhatsApp</h3>
        {(form.whatsapp_templates || []).map((tpl, i) => (
          <div key={tpl.id || i} className="space-y-2 pb-4 border-b border-border/20 last:border-0">
            <Input value={tpl.name} onChange={(e) => updateTemplate(i, "name", e.target.value)} placeholder="Nombre" />
            <Textarea value={tpl.body} onChange={(e) => updateTemplate(i, "body", e.target.value)} rows={2} placeholder="Mensaje con {{nombre}}, {{fecha}}…" />
          </div>
        ))}
        <Button onClick={() => saveSettings.mutate({ whatsapp_templates: form.whatsapp_templates })} disabled={saveSettings.isPending} className="gradient-cta text-white font-bold">
          Guardar plantillas
        </Button>
      </section>

      <section className="bg-white rounded-2xl border border-border/40 p-6 space-y-4">
        <h3 className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4" /> Puntos de interés (POI)</h3>
        <div className="space-y-2">
          {pois.map((poi) => (
            <div key={poi.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-secondary text-sm">
              <div>
                <p className="font-bold">{poi.name}</p>
                <p className="text-xs text-muted-foreground">{poi.neighborhood}, {poi.city} · {poi.category}</p>
              </div>
              <button type="button" onClick={() => removePoi.mutate(poi.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Nombre" value={newPoi.name} onChange={(e) => setNewPoi((p) => ({ ...p, name: e.target.value }))} />
          <Input placeholder="Barrio" value={newPoi.neighborhood} onChange={(e) => setNewPoi((p) => ({ ...p, neighborhood: e.target.value }))} />
          <Input placeholder="Ciudad" value={newPoi.city} onChange={(e) => setNewPoi((p) => ({ ...p, city: e.target.value }))} />
          <Input placeholder="Categoría" value={newPoi.category} onChange={(e) => setNewPoi((p) => ({ ...p, category: e.target.value }))} />
        </div>
        <Button variant="outline" onClick={() => newPoi.name && addPoi.mutate(newPoi)} className="font-bold">
          <Plus className="w-4 h-4 mr-1" /> Agregar POI
        </Button>
      </section>

      <section className="bg-white rounded-2xl border border-border/40 p-6 space-y-3">
        <h3 className="font-bold">Usuarios admin</h3>
        {(form.admin_users || []).map((u, i) => (
          <div key={i} className="flex items-center justify-between text-sm p-3 rounded-xl bg-secondary">
            <div>
              <p className="font-bold">{u.name}</p>
              <p className="text-xs text-muted-foreground">@{u.username} · {u.role}</p>
            </div>
            <span className="text-[10px] font-bold text-brand-violet">{u.permissions?.join(", ")}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
