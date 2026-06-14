import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/panels/StatusBadge";

const HOURS = [9, 10, 11, 12, 14, 15, 16, 17, 18];

function startOfWeek(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function VisitCalendar({ visits = [], properties = [], weekOffset = 0, onSelect }) {
  const days = useMemo(() => {
    const start = startOfWeek();
    start.setDate(start.getDate() + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekOffset]);

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || "Propiedad";

  const visitsByDay = useMemo(() => {
    const map = {};
    days.forEach((d) => {
      const key = d.toDateString();
      map[key] = visits.filter((v) => {
        if (!v.scheduled_at) return false;
        return new Date(v.scheduled_at).toDateString() === key;
      });
    });
    return map;
  }, [days, visits]);

  return (
    <div className="bg-white rounded-2xl border border-border/40 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border/30 bg-[hsl(0,0%,98%)]">
        {days.map((d) => (
          <div key={d.toISOString()} className="p-3 text-center border-r border-border/20 last:border-r-0">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">
              {d.toLocaleDateString("es-CO", { weekday: "short" })}
            </p>
            <p className="text-sm font-extrabold mt-0.5">{d.getDate()}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 min-h-[320px]">
        {days.map((d) => {
          const key = d.toDateString();
          const dayVisits = visitsByDay[key] || [];
          return (
            <div key={key} className="p-2 border-r border-border/20 last:border-r-0 space-y-1.5 min-h-[120px]">
              {dayVisits.length === 0 ? (
                <p className="text-[10px] text-muted-foreground text-center pt-6">—</p>
              ) : (
                dayVisits.map((v) => {
                  const hour = new Date(v.scheduled_at).getHours();
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => onSelect?.(v)}
                      className={cn(
                        "w-full text-left rounded-lg border p-2 transition-colors hover:border-brand-violet/40",
                        v.visit_type === "virtual" ? "bg-brand-magenta/5 border-brand-magenta/20" : "bg-brand-violet/5 border-brand-violet/20"
                      )}
                    >
                      <p className="text-[10px] font-extrabold truncate">{v.user_name}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{propTitle(v.property_id)}</p>
                      <p className="text-[9px] font-semibold mt-0.5">{hour}:00</p>
                      <div className="mt-1"><StatusBadge status={v.status} /></div>
                    </button>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
      <div className="px-4 py-2 border-t border-border/20 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
        <span>Horario sugerido: {HOURS[0]}:00 – {HOURS[HOURS.length - 1]}:00</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-violet/40" /> Presencial</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-magenta/40" /> Virtual</span>
      </div>
    </div>
  );
}
