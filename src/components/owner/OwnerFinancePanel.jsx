import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { StatCard } from "@/components/panels/StatusBadge";
import { computeOwnerFinance, formatCOP, formatPercent } from "@/lib/ownerFinance";
import { cn } from "@/lib/utils";
import OwnerDashboardCharts from "@/components/owner/OwnerDashboardCharts";
import {
  TrendingUp,
  Banknote,
  Wrench,
  PiggyBank,
  Repeat,
  Building2,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function YieldBar({ label, value, max, tone = "violet" }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const bar = tone === "emerald" ? "bg-emerald-500" : tone === "amber" ? "bg-amber-500" : "bg-brand-violet";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-muted-foreground">{label}</span>
        <span className="font-bold tabular-nums">{formatCOP(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function PropertyFinanceCard({ row }) {
  const { property, value, monthlyRent, timesRented, totalIncome, maintenanceCost, netEarnings, grossYield, cumulativeRoi } = row;

  return (
    <article className="bg-white rounded-2xl border border-border/40 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-extrabold text-base">{property.title || "Inmueble"}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {property.neighborhood || property.city || "N/D"} · Valor ref. {formatCOP(value)}
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-violet/10 text-brand-violet">
          {timesRented} arriendo{timesRented !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-[hsl(0,0%,98%)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Canon actual</p>
          <p className="text-sm font-extrabold mt-1 tabular-nums">{formatCOP(monthlyRent)}</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50/80">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/80">Ingresos</p>
          <p className="text-sm font-extrabold mt-1 text-emerald-800 tabular-nums">{formatCOP(totalIncome)}</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-50/80">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800/80">Mantenimiento</p>
          <p className="text-sm font-extrabold mt-1 text-amber-900 tabular-nums">{formatCOP(maintenanceCost)}</p>
        </div>
        <div className="p-3 rounded-xl bg-brand-violet/[0.06]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-violet">Ganancia neta</p>
          <p className="text-sm font-extrabold mt-1 text-brand-violet tabular-nums">{formatCOP(netEarnings)}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <YieldBar label="Ingresos por arriendo" value={totalIncome} max={value} tone="emerald" />
        <YieldBar label="Gastos de mantenimiento" value={maintenanceCost} max={totalIncome || maintenanceCost || 1} tone="amber" />
      </div>

      <div className="flex flex-wrap gap-4 pt-3 border-t border-border/30 text-sm">
        <div className="flex items-center gap-1.5">
          <Percent className="w-4 h-4 text-brand-violet" />
          <span className="text-muted-foreground">Rentabilidad anual bruta:</span>
          <span className="font-extrabold text-brand-violet">{formatPercent(grossYield)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span className="text-muted-foreground">ROI acumulado:</span>
          <span className="font-extrabold text-emerald-700">{formatPercent(cumulativeRoi)}</span>
        </div>
      </div>
    </article>
  );
}

export default function OwnerFinancePanel({ compact = false }) {
  const { user } = useAuth();

  const { data: properties = [] } = useQuery({
    queryKey: ["owner-finance-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });
  const { data: leases = [] } = useQuery({
    queryKey: ["owner-finance-leases"],
    queryFn: () => api.entities.Lease.filter({}, "-created_date", 200),
  });
  const { data: payments = [] } = useQuery({
    queryKey: ["owner-finance-payments"],
    queryFn: () => api.entities.Payment.filter({}, "-created_date", 500),
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ["owner-finance-tickets"],
    queryFn: () => api.entities.Ticket.filter({}, "-created_date", 200),
  });

  const finance = useMemo(
    () =>
      computeOwnerFinance({
        ownerUserId: user?.id,
        properties,
        leases,
        payments,
        tickets,
      }),
    [user?.id, properties, leases, payments, tickets]
  );

  const s = finance.summary;

  if (!s) return null;

  if (compact) {
    return (
      <div className="bg-white rounded-2xl border border-border/40 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-magenta">Rentabilidad</p>
            <p className="text-lg font-extrabold mt-0.5">{formatCOP(s.netEarnings)} netos</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Rentabilidad anual</p>
            <p className="text-lg font-extrabold text-brand-violet">{formatPercent(s.grossAnnualYield)}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-emerald-50">
            <p className="text-muted-foreground">Ingresos</p>
            <p className="font-bold text-emerald-800">{formatCOP(s.totalIncome)}</p>
          </div>
          <div className="p-2 rounded-lg bg-amber-50">
            <p className="text-muted-foreground">Mantenimiento</p>
            <p className="font-bold text-amber-900">{formatCOP(s.totalMaintenance)}</p>
          </div>
          <div className="p-2 rounded-lg bg-brand-violet/5">
            <p className="text-muted-foreground">Arriendos</p>
            <p className="font-bold">{s.timesRented}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold">Rentabilidad de tu inmueble</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Ingresos por arriendo, gastos de mantenimiento y rentabilidad frente al valor de tu propiedad.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Ganancia neta"
          value={formatCOP(s.netEarnings)}
          hint={`${s.paidMonths} meses con pago recibido`}
          icon={PiggyBank}
          tone="emerald"
        />
        <StatCard
          label="Ingresos totales"
          value={formatCOP(s.totalIncome)}
          hint="Canon cobrado histórico"
          icon={Banknote}
          tone="emerald"
        />
        <StatCard
          label="Gastos mantenimiento"
          value={formatCOP(s.totalMaintenance)}
          hint="Reparaciones aprobadas"
          icon={Wrench}
          tone="amber"
        />
        <StatCard
          label="Veces arrendado"
          value={s.timesRented}
          hint={`${s.propertyCount} inmueble${s.propertyCount !== 1 ? "s" : ""} en cartera`}
          icon={Repeat}
        />
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
        <div className="bg-white rounded-2xl border border-border/40 p-5 sm:p-6 shadow-sm">
          <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-violet" />
            Valor del inmueble vs ingresos
          </h3>
          <p className="text-3xl font-extrabold tabular-nums tracking-tight">{formatCOP(s.totalPropertyValue)}</p>
          <p className="text-xs text-muted-foreground mt-1 mb-6">Valor de referencia de tu cartera</p>

          <div className="space-y-4">
            <YieldBar label="Ingresos acumulados por arriendo" value={s.totalIncome} max={s.totalPropertyValue} tone="emerald" />
            <YieldBar label="Gastos en mantenimiento" value={s.totalMaintenance} max={s.totalIncome || 1} tone="amber" />
            <YieldBar label="Ganancia neta acumulada" value={Math.max(0, s.netEarnings)} max={s.totalPropertyValue} tone="violet" />
          </div>

          <div className="mt-6 pt-4 border-t border-border/30 grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ingreso anual proyectado</p>
                <p className="text-lg font-extrabold text-emerald-700 tabular-nums">{formatCOP(s.annualRent)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ArrowDownRight className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Costo vs ingreso</p>
                <p className="text-lg font-extrabold tabular-nums">
                  {s.totalIncome > 0 ? formatPercent((s.totalMaintenance / s.totalIncome) * 100) : "0%"} en mantenimiento
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-violet/[0.08] to-brand-magenta/[0.06] rounded-2xl border border-brand-violet/15 p-5 sm:p-6">
          <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-violet" />
            Rentabilidad
          </h3>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rentabilidad anual bruta</p>
              <p className="text-4xl font-extrabold text-brand-violet mt-1 tabular-nums">{formatPercent(s.grossAnnualYield)}</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Canon anual estimado ÷ valor del inmueble. Referencia de mercado en Bogotá: 5% a 8% bruto.
              </p>
            </div>
            <div className="pt-4 border-t border-brand-violet/15">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ROI acumulado (neto)</p>
              <p className="text-3xl font-extrabold text-emerald-700 mt-1 tabular-nums">{formatPercent(s.cumulativeRoi)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                (Ingresos − mantenimiento) ÷ valor del inmueble, histórico.
              </p>
            </div>
          </div>
        </div>
      </div>

      {finance.properties.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg">Detalle por inmueble</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {finance.properties.map((row) => (
              <PropertyFinanceCard key={row.property.id} row={row} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-extrabold text-lg mb-4">Análisis gráfico</h3>
        <OwnerDashboardCharts finance={finance} tickets={finance.ownerTickets || []} />
      </div>
    </div>
  );
}
