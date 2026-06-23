import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import StatusBadge from "@/components/panels/StatusBadge";
import { Link } from "react-router-dom";
import { hasPendingOwnerChanges } from "@/api/propertyMutations";
import { Pencil } from "lucide-react";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function OwnerProperties() {
  const { user } = useAuth();
  const { data: properties = [] } = useQuery({
    queryKey: ["owner-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });
  const { data: inquiries = [] } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => api.entities.Inquiry.filter({}, "-created_date", 200),
  });

  const mine = properties.filter((p) => p.owner_user_id === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">Mis propiedades</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Puedes solicitar ajustes a tu publicación; el equipo los revisará antes de aplicarlos.
        </p>
      </div>
      {mine.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no tienes inmuebles asignados.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mine.map((p) => {
            const leads = inquiries.filter((i) => i.property_id === p.id).length;
            const pending = hasPendingOwnerChanges(p);
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-border/40 p-5">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="font-extrabold">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.neighborhood}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={p.status} />
                    {pending && <StatusBadge status="pendiente_aprobacion" />}
                  </div>
                </div>
                <p className="font-bold mt-3">{formatCOP(p.monthly_rent)}/mes</p>
                {pending && (
                  <p className="text-xs text-amber-800 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 mt-2">
                    Tienes cambios en revisión desde{" "}
                    {new Date(p.pending_changes.submitted_at).toLocaleDateString("es-CO")}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">{leads} lead{leads !== 1 ? "s" : ""} recibidos</p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <Link to={`/propiedad/${p.id}`} className="text-xs font-bold text-brand-magenta hover:underline">
                    Ver publicación →
                  </Link>
                  <Link
                    to={`/propietario/propiedades/${p.id}/editar`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-violet hover:underline"
                  >
                    <Pencil className="w-3 h-3" /> Editar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
