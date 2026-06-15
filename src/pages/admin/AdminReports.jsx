import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { StatCard } from "@/components/panels/StatusBadge";
import { computeReportMetrics } from "@/lib/adminMetrics";
import { PROPERTY_WORKFLOW } from "@/lib/adminConstants";
import { Building2, Users, Percent, DollarSign, AlertTriangle } from "lucide-react";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function AdminReports() {
  const { data: properties = [] } = useQuery({ queryKey: ["admin-properties"], queryFn: () => api.entities.Property.filter({}, "-created_date", 200) });
  const { data: inquiries = [] } = useQuery({ queryKey: ["admin-inquiries"], queryFn: () => api.entities.Inquiry.filter({}, "-created_date", 200) });
  const { data: leases = [] } = useQuery({ queryKey: ["admin-leases"], queryFn: () => api.entities.Lease.filter({}, "-created_date", 100) });
  const { data: payments = [] } = useQuery({ queryKey: ["admin-payments"], queryFn: () => api.entities.Payment.filter({}, "-created_date", 100) });

  const stats = useMemo(
    () => computeReportMetrics({ properties, inquiries, leases, payments }),
    [properties, inquiries, leases, payments]
  );

  const leadsPorProp = useMemo(() =>
    properties.map((p) => ({
      title: p.title,
      count: inquiries.filter((i) => i.property_id === p.id).length,
    })).filter((x) => x.count > 0).sort((a, b) => b.count - a.count).slice(0, 8),
  [properties, inquiries]);

  const conversion = inquiries.length
    ? Math.round((inquiries.filter((i) => ["cerrado", "aprobado"].includes(i.pipeline_stage)).length / inquiries.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold">Reportes</h2>
        <p className="text-sm text-muted-foreground">Métricas de operación, pipeline e ingresos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Ingreso real (comisión)" value={formatCOP(stats.realIncome)} icon={DollarSign} />
        <StatCard label="Proyectado mensual" value={formatCOP(stats.projected)} hint="10% contratos activos" icon={DollarSign} />
        <StatCard label="Total leads" value={inquiries.length} icon={Users} />
        <StatCard label="Tasa conversión" value={`${conversion}%`} icon={Percent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-border/40 p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Building2 className="w-4 h-4" /> Propiedades por workflow</h3>
          <ul className="space-y-2">
            {stats.byWorkflow.map((row) => {
              const label = PROPERTY_WORKFLOW.find((w) => w.key === row.key)?.label || row.key;
              return (
                <li key={row.key} className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{label}</span>
                  <span className="font-extrabold text-brand-violet">{row.count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-border/40 p-6">
          <h3 className="font-bold mb-4">Pipeline de leads</h3>
          <ul className="space-y-2">
            {stats.pipeline.map((row) => (
              <li key={row.key} className="flex items-center justify-between text-sm">
                <span className="font-semibold">{row.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-brand-violet rounded-full" style={{ width: `${inquiries.length ? (row.count / inquiries.length) * 100 : 0}%` }} />
                  </div>
                  <span className="font-extrabold text-brand-violet w-6 text-right">{row.count}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {stats.stagnant.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2 text-amber-900"><AlertTriangle className="w-4 h-4" /> Propiedades estancadas (sin leads)</h3>
          <ul className="space-y-2 text-sm">
            {stats.stagnant.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span className="font-semibold truncate pr-4">{p.title}</span>
                <span className="text-muted-foreground shrink-0">{p.days} días publicada</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border/40 p-6">
        <h3 className="font-bold mb-4">Leads por propiedad (top 8)</h3>
        {leadsPorProp.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos aún.</p>
        ) : (
          <ul className="space-y-3">
            {leadsPorProp.map((row) => (
              <li key={row.title} className="flex items-center justify-between text-sm">
                <span className="font-semibold truncate pr-4">{row.title}</span>
                <span className="font-extrabold text-brand-violet">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
