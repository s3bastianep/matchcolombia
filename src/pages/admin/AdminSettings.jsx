import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MapPin, Image, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "@/components/brand/BrandLogo";
import { readImageFile } from "@/lib/siteBranding";

export default function AdminSettings() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => api.entities.AdminSettings.get(),
  });
  const { data: pois = [] } = useQuery({
    queryKey: ["admin-pois"],
    queryFn: () => api.entities.POI.filter({}, "-created_date", 200),
  });

  const [form, setForm] = useState(null);
  const [newPoi, setNewPoi] = useState({ name: "", city: "Bogotá", neighborhood: "", category: "Comercio" });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoDirty, setLogoDirty] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (settings && !form) {
      setForm({ ...settings });
      setLogoPreview(settings.site_logo || null);
      setLogoDirty(false);
    }
  }, [settings, form]);

  const saveSettings = useMutation({
    mutationFn: (patch) => api.entities.AdminSettings.update(patch),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      if ("site_logo" in variables) {
        setLogoDirty(false);
        toast.success("Logo actualizado en toda la página.");
      }
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo guardar. Intenta con una imagen más pequeña.");
    },
  });

  const addPoi = useMutation({
    mutationFn: (data) => api.entities.POI.create(data, "poi"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pois"] });
      setNewPoi({ name: "", city: "Bogotá", neighborhood: "", category: "Comercio" });
    },
  });

  const removePoi = useMutation({
    mutationFn: (id) => api.entities.POI.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-pois"] }),
  });

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  const updateTemplate = (idx, field, value) => {
    const templates = [...(form.whatsapp_templates || [])];
    templates[idx] = { ...templates[idx], [field]: value };
    setForm((f) => ({ ...f, whatsapp_templates: templates }));
  };

  const handleLogoPick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      setLogoPreview(dataUrl);
      setLogoDirty(true);
    } catch (err) {
      toast.error(err.message || "No se pudo cargar la imagen.");
    }
  };

  const saveLogo = () => {
    if (!logoPreview) {
      toast.error("Selecciona una imagen primero.");
      return;
    }
    saveSettings.mutate({ site_logo: logoPreview });
    setForm((f) => ({ ...f, site_logo: logoPreview }));
  };

  const restoreDefaultLogo = () => {
    saveSettings.mutate({ site_logo: null });
    setLogoPreview(null);
    setLogoDirty(false);
    setForm((f) => ({ ...f, site_logo: null }));
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl font-extrabold">Configuración</h2>
        <p className="text-sm text-muted-foreground">Logo del sitio, plantillas WhatsApp, POIs y horarios bloqueados.</p>
      </div>

      <section className="bg-white rounded-2xl border border-border/40 p-6 space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <Image className="w-4 h-4" />
          Logo de la página
        </h3>
        <p className="text-sm text-muted-foreground">
          Sube PNG, JPG o SVG (máx. 400 KB). Se verá en el navbar. El favicon siempre usa la H de HABIBAR.
        </p>

        <div className="rounded-xl border border-border/40 bg-secondary/40 p-4 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Vista previa</p>
            {logoPreview ? (
              <img src={logoPreview} alt="Logo personalizado" className="h-10 w-auto max-w-[200px] object-contain" />
            ) : (
              <BrandLogo link={false} size="md" layout="lockup" />
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleLogoPick}
        />

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="font-bold" onClick={() => fileInputRef.current?.click()}>
            Elegir imagen
          </Button>
          <Button
            type="button"
            onClick={saveLogo}
            disabled={saveSettings.isPending || !logoPreview || !logoDirty}
            className="gradient-cta text-white font-bold"
          >
            Guardar logo
          </Button>
          {(logoPreview || form.site_logo) && (
            <Button type="button" variant="ghost" className="font-bold text-muted-foreground" onClick={restoreDefaultLogo}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Restaurar predeterminado
            </Button>
          )}
        </div>
      </section>

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
