import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/api/apiClient";
import StatusBadge from "@/components/panels/StatusBadge";
import { PROPERTY_WORKFLOW } from "@/lib/adminConstants";
import { hasPendingOwnerChanges } from "@/api/propertyMutations";
import { Pencil, Trash2, Plus, ExternalLink } from "lucide-react";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function AdminProperties() {
  const qc = useQueryClient();
  const [workflowFilter, setWorkflowFilter] = useState("all");
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });
  const { data: owners = [] } = useQuery({
    queryKey: ["admin-owners"],
    queryFn: () => api.entities.Owner.filter({}, "-created_date", 100),
  });

  const updateWorkflow = useMutation({
    mutationFn: ({ id, publication_status }) => api.entities.Property.update(id, { publication_status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-properties"] }),
  });

  const remove = useMutation({
    mutationFn: (id) => api.entities.Property.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-properties"] }),
  });

  const ownerName = (userId) => owners.find((o) => o.user_id === userId)?.name || "N/D";
  const workflow = (p) => p.publication_status || (p.status === "disponible" ? "publicada" : p.status);

  const filtered = workflowFilter === "all"
    ? properties
    : properties.filter((p) => workflow(p) === workflowFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold">Propiedades</h2>
          <p className="text-sm text-muted-foreground">Workflow de publicación, referencia y propietario.</p>
        </div>
        <Link to="/publicar/nuevo" className="inline-flex items-center gap-2 gradient-cta text-white text-sm font-bold px-4 py-2.5 rounded-xl">
          <Plus className="w-4 h-4" /> Nueva propiedad
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setWorkflowFilter("all")} className={`text-xs font-bold px-3 py-1.5 rounded-lg ${workflowFilter === "all" ? "bg-brand-violet/10 text-brand-violet" : "bg-secondary"}`}>
          Todas ({properties.length})
        </button>
        {PROPERTY_WORKFLOW.map((w) => (
          <button
            key={w.key}
            type="button"
            onClick={() => setWorkflowFilter(w.key)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg ${workflowFilter === w.key ? "bg-brand-violet/10 text-brand-violet" : "bg-secondary"}`}
          >
            {w.label} ({properties.filter((p) => workflow(p) === w.key).length})
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : (
        <div className="bg-white rounded-2xl border border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 bg-[hsl(0,0%,98%)]">
                  <th className="text-left p-4 font-bold">Inmueble</th>
                  <th className="text-left p-4 font-bold">REF</th>
                  <th className="text-left p-4 font-bold">Precio</th>
                  <th className="text-left p-4 font-bold">Propietario</th>
                  <th className="text-left p-4 font-bold">Workflow</th>
                  <th className="text-right p-4 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-secondary/30">
                    <td className="p-4">
                      <p className="font-bold line-clamp-1">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.neighborhood}, {p.city}</p>
                      {hasPendingOwnerChanges(p) && (
                        <span className="inline-flex mt-1.5 text-[10px] font-bold text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/25">
                          Cambios del propietario
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{p.reference_code || "N/D"}</td>
                    <td className="p-4 font-semibold">{formatCOP(p.monthly_rent)}</td>
                    <td className="p-4 text-xs">{ownerName(p.owner_user_id)}</td>
                    <td className="p-4">
                      <select
                        value={workflow(p)}
                        onChange={(e) => updateWorkflow.mutate({ id: p.id, publication_status: e.target.value })}
                        className="text-xs font-semibold border rounded-lg px-2 py-1.5 bg-white"
                      >
                        {PROPERTY_WORKFLOW.map((w) => (
                          <option key={w.key} value={w.key}>{w.label}</option>
                        ))}
                      </select>
                      <div className="mt-1"><StatusBadge status={workflow(p)} /></div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/propiedad/${p.id}`} className="p-2 rounded-lg hover:bg-secondary" title="Ver">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link to={`/admin/propiedades/${p.id}`} className="p-2 rounded-lg hover:bg-secondary" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button type="button" onClick={() => window.confirm("¿Eliminar?") && remove.mutate(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
