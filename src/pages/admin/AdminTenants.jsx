import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatusBadge from "@/components/panels/StatusBadge";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function AdminTenants() {
  const qc = useQueryClient();
  const { data: leases = [] } = useQuery({ queryKey: ["admin-leases"], queryFn: () => base44.entities.Lease.filter({}, "-created_date", 100) });
  const { data: tickets = [] } = useQuery({ queryKey: ["admin-tickets"], queryFn: () => base44.entities.Ticket.filter({}, "-created_date", 100) });
  const { data: properties = [] } = useQuery({ queryKey: ["admin-properties"], queryFn: () => base44.entities.Property.filter({}, "-created_date", 200) });

  const updateTicket = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Ticket.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tickets"] }),
  });

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || id;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold">Inquilinos activos</h2>
        <p className="text-sm text-muted-foreground">Contratos, pagos y tickets de soporte.</p>
      </div>

      <section>
        <h3 className="font-bold mb-3">Contratos activos</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {leases.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl border border-border/40 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-extrabold">{propTitle(l.property_id)}</p>
                  <p className="text-sm text-muted-foreground mt-1">{formatCOP(l.monthly_rent)}/mes</p>
                </div>
                <StatusBadge status={l.status} />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {l.start_date} → {l.end_date}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-bold mb-3">Tickets de soporte</h3>
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-border/40 p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">{t.title}</p>
                <p className="text-xs text-muted-foreground">{propTitle(t.property_id)} · Prioridad {t.priority}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={t.status} />
                {t.status === "abierto" && (
                  <button type="button" onClick={() => updateTicket.mutate({ id: t.id, status: "en_proceso" })} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary">
                    Tomar
                  </button>
                )}
                {t.status === "en_proceso" && (
                  <button type="button" onClick={() => updateTicket.mutate({ id: t.id, status: "resuelto" })} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[hsl(168,72%,40%)]/10 text-[hsl(168,72%,32%)]">
                    Resolver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
