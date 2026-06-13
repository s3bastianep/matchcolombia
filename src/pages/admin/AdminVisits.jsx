import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatusBadge from "@/components/panels/StatusBadge";
import { Calendar, Check, RotateCcw } from "lucide-react";

export default function AdminVisits() {
  const qc = useQueryClient();
  const { data: visits = [] } = useQuery({
    queryKey: ["admin-visits"],
    queryFn: () => base44.entities.Visit.filter({}, "scheduled_at", 200),
  });
  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => base44.entities.Property.filter({}, "-created_date", 200),
  });

  const updateVisit = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Visit.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-visits"] }),
  });

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || "Propiedad";

  const fmt = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("es-CO", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">Calendario de visitas</h2>
        <p className="text-sm text-muted-foreground">Confirma, reprograma o cancela visitas agendadas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visits.map((v) => (
          <div key={v.id} className="bg-white rounded-2xl border border-border/40 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-extrabold">{v.user_name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{propTitle(v.property_id)}</p>
              </div>
              <StatusBadge status={v.status} />
            </div>
            <p className="flex items-center gap-2 text-sm font-semibold mt-4">
              <Calendar className="w-4 h-4 text-[hsl(265,75%,58%)]" />
              {fmt(v.scheduled_at)}
            </p>
            {v.notes && <p className="text-xs text-muted-foreground mt-2">{v.notes}</p>}
            <div className="flex flex-wrap gap-2 mt-4">
              {v.status === "pendiente" && (
                <button type="button" onClick={() => updateVisit.mutate({ id: v.id, status: "confirmada" })} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-[hsl(168,72%,40%)]/10 text-[hsl(168,72%,32%)]">
                  <Check className="w-3.5 h-3.5" /> Confirmar
                </button>
              )}
              <button type="button" onClick={() => updateVisit.mutate({ id: v.id, status: "reprogramada" })} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary">
                <RotateCcw className="w-3.5 h-3.5" /> Reprogramar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
