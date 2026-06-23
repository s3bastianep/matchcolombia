import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/panels/StatusBadge";
import { hasPendingOwnerChanges, pickOwnerPatch } from "@/api/propertyMutations";
import { pushAdminNotification } from "@/lib/adminNotifications";
import { toast } from "sonner";
import { ArrowLeft, Clock } from "lucide-react";

export default function OwnerPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data: property, isLoading } = useQuery({
    queryKey: ["owner-property", id],
    queryFn: () => api.entities.Property.get(id),
  });

  const [form, setForm] = useState(null);

  React.useEffect(() => {
    if (property && !form) {
      const draft = property.pending_changes?.patch || {};
      setForm({ ...property, ...draft });
    }
  }, [property, form]);

  const save = useMutation({
    mutationFn: (data) => {
      const { id: _id, history, audit_log, created_date, pending_changes, publication_status, status, owner_user_id, reference_code, ...rest } = data;
      const patch = pickOwnerPatch(rest);
      return api.entities.Property.update(id, patch, user?.id, { role: "owner" });
    },
    onSuccess: () => {
      pushAdminNotification({
        type: "owner",
        title: "Cambios de propietario pendientes",
        message: `El propietario solicitó ajustes en "${property?.title || "un inmueble"}".`,
        link: `/admin/propiedades/${id}`,
      });
      qc.invalidateQueries({ queryKey: ["owner-properties"] });
      qc.invalidateQueries({ queryKey: ["owner-property", id] });
      toast.success("Cambios enviados. El equipo los revisará antes de publicarlos.");
      navigate("/propietario/propiedades");
    },
    onError: (err) => {
      toast.error(err?.message || "No se pudieron enviar los cambios");
    },
  });

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  if (property?.owner_user_id && property.owner_user_id !== user?.id) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">No tienes permiso para editar este inmueble.</p>
        <Link to="/propietario/propiedades" className="text-sm font-bold text-brand-magenta hover:underline">← Volver</Link>
      </div>
    );
  }

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const pending = hasPendingOwnerChanges(property);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/propietario/propiedades" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Mis propiedades
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-extrabold">Editar publicación</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Los ajustes no se publican de inmediato: nuestro equipo los revisa y aprueba antes de actualizar la ficha.
        </p>
      </div>

      {pending && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-900">Cambios en revisión</p>
            <p className="text-xs text-amber-800/90 mt-1">
              Enviaste ajustes el{" "}
              {new Date(property.pending_changes.submitted_at).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              . La publicación actual sigue visible hasta que el administrador apruebe.
            </p>
            <div className="mt-2"><StatusBadge status="pendiente_aprobacion" /></div>
          </div>
        </div>
      )}

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

        <div className="flex gap-3 pt-2">
          <Button onClick={() => save.mutate(form)} disabled={save.isPending} className="gradient-cta text-white font-bold">
            {save.isPending ? "Enviando…" : "Enviar para aprobación"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/propietario/propiedades")}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}
