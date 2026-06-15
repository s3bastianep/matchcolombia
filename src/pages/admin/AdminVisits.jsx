import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import StatusBadge from "@/components/panels/StatusBadge";
import VisitCalendar from "@/components/admin/VisitCalendar";
import { VISIT_TYPES } from "@/lib/adminConstants";
import { pushAdminNotification } from "@/lib/adminNotifications";
import { Calendar, Check, RotateCcw, List, LayoutGrid, ChevronLeft, ChevronRight, X, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VISIT_RULES_HINT } from "@/lib/visitSlots";

const VISIT_CARD_STYLE = {
  pendiente: "border-l-amber-400 bg-amber-50/30",
  confirmada: "border-l-emerald-500 bg-emerald-50/25",
  reprogramada: "border-l-brand-violet bg-brand-violet/[0.04]",
  completada: "border-l-foreground/30 bg-white",
  cancelada: "border-l-red-400 bg-red-50/30",
};

export default function AdminVisits() {
  const qc = useQueryClient();
  const [view, setView] = useState("calendar");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState(null);
  const [rescheduleAt, setRescheduleAt] = useState("");

  const { data: visits = [] } = useQuery({
    queryKey: ["admin-visits"],
    queryFn: () => api.entities.Visit.filter({}, "scheduled_at", 200),
  });
  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });

  const updateVisit = useMutation({
    mutationFn: ({ id, patch }) => api.entities.Visit.update(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-visits"] });
      setSelected(null);
    },
  });

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || "Propiedad";

  const fmt = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("es-CO", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const pending = useMemo(() => visits.filter((v) => v.status === "pendiente"), [visits]);

  const confirm = (id) => {
    updateVisit.mutate({ id, patch: { status: "confirmada" } });
    pushAdminNotification({ type: "visit", title: "Visita confirmada", message: "Una visita fue confirmada.", link: "/admin/visitas" });
  };

  const reject = (id) => {
    updateVisit.mutate({ id, patch: { status: "cancelada" } });
    pushAdminNotification({ type: "visit", title: "Visita rechazada", message: "Se liberó el horario.", link: "/admin/visitas" });
  };

  const VisitCard = ({ v, compact }) => (
    <div className={cn("rounded-2xl border border-border/40 border-l-4 p-5", VISIT_CARD_STYLE[v.status] || "bg-white")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-extrabold">{v.user_name}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{propTitle(v.property_id)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={v.status} />
          <StatusBadge status={v.visit_type || "presencial"} />
        </div>
      </div>
      <p className="flex items-center gap-2 text-sm font-semibold mt-4">
        <Calendar className="w-4 h-4 text-brand-violet" />
        {fmt(v.scheduled_at)}
      </p>
      {v.notes && <p className="text-xs text-muted-foreground mt-2">{v.notes}</p>}
      {!compact && (
        <div className="flex flex-wrap gap-2 mt-4">
          {v.status === "pendiente" && (
            <>
              <button type="button" onClick={() => confirm(v.id)} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                <Check className="w-3.5 h-3.5" /> Aprobar
              </button>
              <button type="button" onClick={() => reject(v.id)} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200/60">
                <X className="w-3.5 h-3.5" /> Rechazar
              </button>
            </>
          )}
          <button type="button" onClick={() => { setSelected(v); setRescheduleAt(v.scheduled_at?.slice(0, 16) || ""); }} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-border/50">
            <RotateCcw className="w-3.5 h-3.5" /> Reprogramar
          </button>
        </div>
      )}
      {compact && v.status === "pendiente" && (
        <div className="flex gap-2 mt-3">
          <button type="button" onClick={() => confirm(v.id)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white">Aprobar</button>
          <button type="button" onClick={() => reject(v.id)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600">Rechazar</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-brand-magenta/15 bg-gradient-to-r from-brand-magenta/[0.05] to-brand-violet/[0.04] p-5">
        <h2 className="text-xl font-extrabold">Calendario de visitas</h2>
        <p className="text-sm text-muted-foreground mt-1">Aprueba, rechaza o reprograma solicitudes. {VISIT_RULES_HINT}</p>
      </div>

      {pending.length > 0 && (
        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-600" />
            <p className="font-extrabold text-amber-900">Pendientes de aprobación ({pending.length})</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {pending.map((v) => (
              <VisitCard key={v.id} v={v} compact />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold text-muted-foreground">Todas las visitas</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setView("calendar")} className={cn("p-2 rounded-lg border", view === "calendar" ? "bg-brand-violet/10 text-brand-violet border-brand-violet/20" : "bg-white border-border/40")}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setView("list")} className={cn("p-2 rounded-lg border", view === "list" ? "bg-brand-violet/10 text-brand-violet border-brand-violet/20" : "bg-white border-border/40")}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === "calendar" && (
        <>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setWeekOffset((w) => w - 1)} className="p-2 rounded-lg bg-white border border-border/40"><ChevronLeft className="w-4 h-4" /></button>
            <p className="text-sm font-bold">Semana {weekOffset === 0 ? "actual" : weekOffset > 0 ? `+${weekOffset}` : weekOffset}</p>
            <button type="button" onClick={() => setWeekOffset((w) => w + 1)} className="p-2 rounded-lg bg-white border border-border/40"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <VisitCalendar visits={visits} properties={properties} weekOffset={weekOffset} onSelect={setSelected} />
        </>
      )}

      {view === "list" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visits.map((v) => (
            <VisitCard key={v.id} v={v} />
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-extrabold">{selected.user_name}</h3>
            <p className="text-sm text-muted-foreground">{propTitle(selected.property_id)}</p>
            <p className="text-sm font-semibold">{fmt(selected.scheduled_at)}</p>
            <StatusBadge status={selected.status} />
            <select
              value={selected.visit_type || "presencial"}
              onChange={(e) => setSelected((s) => ({ ...s, visit_type: e.target.value }))}
              className="w-full text-sm border rounded-lg px-3 py-2"
            >
              {VISIT_TYPES.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
            <div>
              <label className="text-xs font-bold text-muted-foreground">Nueva fecha/hora</label>
              <Input type="datetime-local" value={rescheduleAt} onChange={(e) => setRescheduleAt(e.target.value)} className="mt-1" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateVisit.mutate({
                  id: selected.id,
                  patch: { scheduled_at: new Date(rescheduleAt).toISOString(), status: "reprogramada", visit_type: selected.visit_type },
                })}
                className="text-xs font-bold px-3 py-2 rounded-xl gradient-cta text-white"
              >
                Guardar cambios
              </button>
              {selected.status === "pendiente" && (
                <>
                  <button type="button" onClick={() => confirm(selected.id)} className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-600 text-white">Aprobar</button>
                  <button type="button" onClick={() => reject(selected.id)} className="text-xs font-bold px-3 py-2 rounded-xl bg-red-50 text-red-600">Rechazar</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
