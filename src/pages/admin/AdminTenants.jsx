import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import StatusBadge from "@/components/panels/StatusBadge";
import { StatCard } from "@/components/panels/StatusBadge";
import { DollarSign, FileText, Wrench } from "lucide-react";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function AdminTenants() {
  const qc = useQueryClient();
  const { data: leases = [] } = useQuery({ queryKey: ["admin-leases"], queryFn: () => api.entities.Lease.filter({}, "-created_date", 100) });
  const { data: payments = [] } = useQuery({ queryKey: ["admin-payments"], queryFn: () => api.entities.Payment.filter({}, "-created_date", 100) });
  const { data: tickets = [] } = useQuery({ queryKey: ["admin-tickets"], queryFn: () => api.entities.Ticket.filter({}, "-created_date", 100) });
  const { data: properties = [] } = useQuery({ queryKey: ["admin-properties"], queryFn: () => api.entities.Property.filter({}, "-created_date", 200) });

  const updateTicket = useMutation({
    mutationFn: ({ id, status, assigned_to }) => api.entities.Ticket.update(id, { status, ...(assigned_to ? { assigned_to } : {}) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tickets"] }),
  });

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || id;
  const activeLeases = leases.filter((l) => l.status === "activo");
  const overdue = payments.filter((p) => p.status === "atrasado" || (p.status === "pendiente" && new Date(p.due_date) < new Date()));
  const openTickets = tickets.filter((t) => t.status !== "resuelto");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold">Inquilinos activos</h2>
        <p className="text-sm text-muted-foreground">Contratos, pagos y tickets de soporte.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Contratos activos" value={activeLeases.length} icon={FileText} />
        <StatCard label="Pagos atrasados" value={overdue.length} icon={DollarSign} />
        <StatCard label="Tickets abiertos" value={openTickets.length} icon={Wrench} />
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
              {l.contract_url && (
                <a href={l.contract_url} className="text-xs font-bold text-brand-violet mt-2 inline-block">Ver contrato →</a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-bold mb-3">Pagos recientes</h3>
        <div className="bg-white rounded-2xl border border-border/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-[hsl(0,0%,98%)]">
                <th className="text-left p-3 font-bold">Periodo</th>
                <th className="text-left p-3 font-bold">Monto</th>
                <th className="text-left p-3 font-bold">Vence</th>
                <th className="text-left p-3 font-bold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border/20">
                  <td className="p-3">{p.period}</td>
                  <td className="p-3 font-semibold">{formatCOP(p.amount)}</td>
                  <td className="p-3 text-muted-foreground">{p.due_date}</td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
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
                {t.assigned_to && <p className="text-[10px] text-muted-foreground mt-1">Asignado: {t.assigned_to}</p>}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={t.status} />
                {t.status === "abierto" && (
                  <button type="button" onClick={() => updateTicket.mutate({ id: t.id, status: "en_proceso", assigned_to: "admin" })} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary">
                    Tomar
                  </button>
                )}
                {t.status === "en_proceso" && (
                  <button type="button" onClick={() => updateTicket.mutate({ id: t.id, status: "resuelto" })} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-violet/10 text-brand-violet">
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
