import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { StatCard } from "@/components/panels/StatusBadge";
import { Building2, Users, Percent, DollarSign } from "lucide-react";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function AdminReports() {
  const { data: properties = [] } = useQuery({ queryKey: ["admin-properties"], queryFn: () => base44.entities.Property.filter({}, "-created_date", 200) });
  const { data: inquiries = [] } = useQuery({ queryKey: ["admin-inquiries"], queryFn: () => base44.entities.Inquiry.filter({}, "-created_date", 200) });
  const { data: leases = [] } = useQuery({ queryKey: ["admin-leases"], queryFn: () => base44.entities.Lease.filter({}, "-created_date", 100) });

  const stats = useMemo(() => {
    const activas = properties.filter((p) => p.status === "disponible").length;
    const cerrados = inquiries.filter((i) => (i.pipeline_stage || i.status) === "cerrado").length;
    const conversion = inquiries.length ? Math.round((cerrados / inquiries.length) * 100) : 0;
    const comisionEst = leases.reduce((sum, l) => sum + (l.monthly_rent || 0) * 0.1, 0);
    const leadsPorProp = properties.map((p) => ({
      title: p.title,
      count: inquiries.filter((i) => i.property_id === p.id).length,
    })).filter((x) => x.count > 0).sort((a, b) => b.count - a.count).slice(0, 5);
    return { activas, conversion, comisionEst, leadsPorProp };
  }, [properties, inquiries, leases]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold">Reportes</h2>
        <p className="text-sm text-muted-foreground">Métricas básicas de operación.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Propiedades activas" value={stats.activas} icon={Building2} />
        <StatCard label="Total leads" value={inquiries.length} icon={Users} />
        <StatCard label="Tasa conversión" value={`${stats.conversion}%`} icon={Percent} />
        <StatCard label="Comisión estimada/mes" value={formatCOP(stats.comisionEst)} hint="10% sobre arriendos activos" icon={DollarSign} />
      </div>

      <div className="bg-white rounded-2xl border border-border/40 p-6">
        <h3 className="font-bold mb-4">Leads por propiedad (top 5)</h3>
        {stats.leadsPorProp.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos aún.</p>
        ) : (
          <ul className="space-y-3">
            {stats.leadsPorProp.map((row) => (
              <li key={row.title} className="flex items-center justify-between text-sm">
                <span className="font-semibold truncate pr-4">{row.title}</span>
                <span className="font-extrabold text-[hsl(265,75%,50%)]">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
