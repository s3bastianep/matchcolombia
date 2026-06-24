import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { countInventoryPhotos, inventoryKindLabel } from "@/lib/ownerInventory";
import StatusBadge from "@/components/panels/StatusBadge";
import { ClipboardList, Plus, Camera, ArrowRight } from "lucide-react";

export default function OwnerInventory() {
  const { user } = useAuth();

  const { data: properties = [] } = useQuery({
    queryKey: ["owner-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });
  const { data: inventories = [], isLoading } = useQuery({
    queryKey: ["owner-inventories", user?.id],
    queryFn: () => api.entities.PropertyInventory.filter({ owner_user_id: user?.id }, "-updated_date", 100),
    enabled: !!user?.id,
  });

  const mine = useMemo(
    () => properties.filter((p) => p.owner_user_id === user?.id),
    [properties, user?.id]
  );

  const propertyTitle = (id) => mine.find((p) => p.id === id)?.title || "Inmueble";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-magenta" />
            Inventario del inmueble
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Registra fotos y notas de cada espacio al entregar o recibir el apartamento. Queda documentado para ti y
            para el equipo HABIBAR.
          </p>
        </div>
        <Link
          to="/propietario/inventario/nuevo"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-magenta text-white px-4 py-2.5 text-sm font-bold hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nuevo inventario
        </Link>
      </div>

      {mine.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
          <p className="text-sm text-muted-foreground">Primero necesitas un inmueble asignado a tu cuenta.</p>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="w-9 h-9 rounded-full border-2 border-brand-magenta border-t-transparent animate-spin" />
        </div>
      ) : inventories.length === 0 ? (
        <div className="rounded-2xl border border-border/50 bg-white p-8 text-center">
          <Camera className="w-10 h-10 text-brand-magenta/50 mx-auto mb-3" />
          <p className="font-semibold">Aún no tienes inventarios</p>
          <p className="text-sm text-muted-foreground mt-1">
            Crea uno al entregar o recibir un apartamento para dejar constancia con fotos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {inventories.map((inv) => (
            <div key={inv.id} className="bg-white rounded-2xl border border-border/40 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-magenta">
                    {inventoryKindLabel(inv.kind)}
                  </p>
                  <p className="font-extrabold mt-1 truncate">{propertyTitle(inv.property_id)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Actualizado {new Date(inv.updated_date || inv.created_date).toLocaleDateString("es-CO")}
                  </p>
                </div>
                <StatusBadge status={inv.status === "completado" ? "completado" : "borrador"} />
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {inv.general_notes || "Sin notas generales aún."}
              </p>
              <p className="text-xs font-semibold text-foreground mt-3">
                {countInventoryPhotos(inv)} foto{countInventoryPhotos(inv) !== 1 ? "s" : ""} ·{" "}
                {(inv.rooms || []).length} espacios
              </p>
              <Link
                to={`/propietario/inventario/${inv.id}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-violet mt-4 hover:underline"
              >
                Ver o editar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
