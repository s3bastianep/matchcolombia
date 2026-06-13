import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StatusBadge from "@/components/panels/StatusBadge";
import { Pencil, Trash2, Plus, ExternalLink } from "lucide-react";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

const STATUSES = ["disponible", "en_proceso", "reservado", "arrendado", "vendido"];

export default function AdminProperties() {
  const qc = useQueryClient();
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => base44.entities.Property.filter({}, "-created_date", 200),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Property.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-properties"] }),
  });

  const remove = useMutation({
    mutationFn: (id) => base44.entities.Property.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-properties"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold">Propiedades</h2>
          <p className="text-sm text-muted-foreground">CRUD completo — fotos, precio, ubicación y estado.</p>
        </div>
        <Link to="/publicar/nuevo" className="inline-flex items-center gap-2 gradient-cta text-white text-sm font-bold px-4 py-2.5 rounded-xl">
          <Plus className="w-4 h-4" /> Nueva propiedad
        </Link>
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
                  <th className="text-left p-4 font-bold">Precio</th>
                  <th className="text-left p-4 font-bold">Zona</th>
                  <th className="text-left p-4 font-bold">Estado</th>
                  <th className="text-right p-4 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-secondary/30">
                    <td className="p-4">
                      <p className="font-bold line-clamp-1">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.property_type}</p>
                    </td>
                    <td className="p-4 font-semibold">{formatCOP(p.monthly_rent)}</td>
                    <td className="p-4 text-muted-foreground">{p.neighborhood}, {p.city}</td>
                    <td className="p-4">
                      <select
                        value={p.status || "disponible"}
                        onChange={(e) => updateStatus.mutate({ id: p.id, status: e.target.value })}
                        className="text-xs font-semibold border rounded-lg px-2 py-1.5 bg-white"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </select>
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
