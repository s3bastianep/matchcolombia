import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import StatusBadge from "@/components/panels/StatusBadge";

export default function OwnerTickets() {
  const { data: tickets = [] } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: () => api.entities.Ticket.filter({}, "-created_date", 200),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">Mantenimiento</h2>
        <p className="text-sm text-muted-foreground">Tickets del inquilino. Aprueba reparaciones y gastos.</p>
      </div>
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-border/40 p-4 flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-bold">{t.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
              <p className="text-[10px] text-muted-foreground mt-2">Prioridad: {t.priority}</p>
            </div>
            <StatusBadge status={t.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
