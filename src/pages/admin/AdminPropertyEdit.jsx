import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: property, isLoading } = useQuery({
    queryKey: ["admin-property", id],
    queryFn: () => base44.entities.Property.get(id),
  });

  const [form, setForm] = useState(null);

  React.useEffect(() => {
    if (property && !form) setForm({ ...property });
  }, [property, form]);

  const save = useMutation({
    mutationFn: (data) => base44.entities.Property.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      navigate("/admin/propiedades");
    },
  });

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-extrabold">Editar propiedad</h2>
      <div className="bg-white rounded-2xl border border-border/40 p-6 space-y-4">
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
        {form.history?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2">Histórico de estado</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {form.history.map((h, i) => (
                <li key={i}>{h.from} → {h.to} · {new Date(h.at).toLocaleDateString("es-CO")}</li>
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
      </div>
    </div>
  );
}
