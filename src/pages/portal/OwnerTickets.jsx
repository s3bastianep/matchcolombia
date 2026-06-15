import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import MaintenanceTicketCard from "@/components/tickets/MaintenanceTicketCard";
import { ticketNeedsOwnerAction, TICKET_STATUS_ORDER } from "@/lib/ticketUtils";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "pendiente_aprobacion", label: "Por aprobar" },
  { id: "en_proceso", label: "En proceso" },
  { id: "resuelto", label: "Finalizados" },
  { id: "abierto", label: "Abiertos" },
];

export default function OwnerTickets() {
  const [filter, setFilter] = useState("todos");

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["owner-tickets"],
    queryFn: () => api.entities.Ticket.filter({}, "-created_date", 200),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["owner-ticket-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || null;

  const pendingCount = useMemo(() => tickets.filter(ticketNeedsOwnerAction).length, [tickets]);

  const filtered = useMemo(() => {
    if (filter === "todos") {
      return [...tickets].sort(
        (a, b) =>
          TICKET_STATUS_ORDER.indexOf(a.status) - TICKET_STATUS_ORDER.indexOf(b.status) ||
          new Date(b.created_date) - new Date(a.created_date)
      );
    }
    return tickets.filter((t) => t.status === filter);
  }, [tickets, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">Mantenimiento</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Revisa qué pasó, las fotos y el costo de cada reparación. Aprueba o rechaza antes de que ejecutemos el arreglo.
        </p>
        {pendingCount > 0 && (
          <p className="mt-2 text-sm font-bold text-amber-800">
            Tienes {pendingCount} solicitud{pendingCount !== 1 ? "es" : ""} pendiente{pendingCount !== 1 ? "s" : ""} de aprobación.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count =
            f.id === "todos"
              ? tickets.length
              : tickets.filter((t) => t.status === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-3.5 py-2 rounded-full text-xs font-bold border transition-colors",
                filter === f.id
                  ? "bg-foreground text-white border-foreground"
                  : "bg-white border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
              {count > 0 && (
                <span className={cn("ml-1.5 tabular-nums", filter === f.id ? "text-white/80" : "text-brand-violet")}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border/50 bg-white">
          <p className="font-bold text-muted-foreground">No hay tickets en esta categoría.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <MaintenanceTicketCard
              key={t.id}
              ticket={t}
              propertyTitle={propTitle(t.property_id)}
              showOwnerActions
            />
          ))}
        </div>
      )}
    </div>
  );
}
