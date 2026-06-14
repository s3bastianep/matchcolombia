import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import StatusBadge from "@/components/panels/StatusBadge";
import { EmptyState } from "@/components/panels/PipelineBoard";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

export default function SeekerVisits() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: visits = [] } = useQuery({
    queryKey: ["my-visits", user?.id],
    queryFn: () => base44.entities.Visit.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });
  const { data: properties = [] } = useQuery({
    queryKey: ["visit-properties"],
    queryFn: () => base44.entities.Property.filter({}, "-created_date", 200),
  });

  const fmt = (iso) => new Date(iso).toLocaleString("es-CO", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

  if (!visits.length) {
    return (
      <EmptyState
        title="Sin visitas agendadas"
        description="Desde el detalle de una propiedad puedes solicitar y confirmar tu visita."
        action={<Link to="/explorar" className="inline-block gradient-cta text-white font-bold px-5 py-2.5 rounded-xl text-sm">Buscar inmuebles</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold">Mis visitas</h2>
      {visits.map((v) => {
        const prop = properties.find((p) => p.id === v.property_id);
        return (
          <div key={v.id} className="bg-white rounded-2xl border border-border/40 p-5">
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="font-extrabold">{prop?.title || "Propiedad"}</p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Calendar className="w-4 h-4" /> {fmt(v.scheduled_at)}
                </p>
              </div>
              <StatusBadge status={v.status} />
            </div>
            {v.status === "confirmada" && (
              <p className="text-xs text-brand-violet font-semibold mt-3 bg-brand-violet/10 px-3 py-2 rounded-lg">
                ✓ Visita confirmada — te esperamos en la dirección indicada.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
