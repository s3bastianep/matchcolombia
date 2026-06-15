import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import OwnerDashboardCharts from "@/components/owner/OwnerDashboardCharts";
import { computeOwnerFinance, formatCOP, formatPercent } from "@/lib/ownerFinance";
import { ticketNeedsOwnerAction } from "@/lib/ticketUtils";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  Wrench,
  ArrowRight,
  TrendingUp,
  PiggyBank,
  Banknote,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const QUICK_LINKS = [
  { to: "/propietario/rentabilidad", title: "Rentabilidad", desc: "ROI, ingresos y gastos", icon: TrendingUp, tone: "violet" },
  { to: "/propietario/propiedades", title: "Propiedades", desc: "Estado y canon mensual", icon: Building2, tone: "magenta" },
  { to: "/propietario/leads", title: "Leads", desc: "Interesados activos", icon: Users, tone: "emerald" },
  { to: "/propietario/tickets", title: "Mantenimiento", desc: "Aprueba reparaciones", icon: Wrench, tone: "amber" },
];

const TONE_STYLES = {
  violet: "bg-brand-violet/10 text-brand-violet border-brand-violet/20",
  magenta: "bg-brand-magenta/10 text-brand-magenta border-brand-magenta/20",
  emerald: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-800 border-amber-500/20",
};

function KpiCard({ label, value, hint, icon: Icon, accent = "violet" }) {
  const accents = {
    violet: "from-brand-violet/15 to-brand-violet/5 border-brand-violet/20 text-brand-violet",
    emerald: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/25 text-emerald-700",
    amber: "from-amber-500/15 to-amber-500/5 border-amber-500/25 text-amber-800",
    magenta: "from-brand-magenta/15 to-brand-magenta/5 border-brand-magenta/25 text-brand-magenta",
  };
  return (
    <div className={cn("rounded-2xl border bg-gradient-to-br p-5 shadow-sm", accents[accent])}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-extrabold mt-1.5 tabular-nums tracking-tight text-foreground">{value}</p>
          {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
        </div>
        {Icon && (
          <div className="w-11 h-11 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center shrink-0 shadow-sm">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function OwnerPortal() {
  const { user } = useAuth();

  const { data: properties = [] } = useQuery({
    queryKey: ["owner-dashboard-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });
  const { data: inquiries = [] } = useQuery({
    queryKey: ["owner-dashboard-inquiries"],
    queryFn: () => api.entities.Inquiry.filter({}, "-created_date", 200),
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ["owner-dashboard-tickets"],
    queryFn: () => api.entities.Ticket.filter({}, "-created_date", 200),
  });
  const { data: leases = [] } = useQuery({
    queryKey: ["owner-dashboard-leases"],
    queryFn: () => api.entities.Lease.filter({}, "-created_date", 200),
  });
  const { data: payments = [] } = useQuery({
    queryKey: ["owner-dashboard-payments"],
    queryFn: () => api.entities.Payment.filter({}, "-created_date", 500),
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
  const pendingTickets = tickets.filter(ticketNeedsOwnerAction).length;
  const openTickets = tickets.filter((t) => t.status !== "resuelto" && t.status !== "rechazado").length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-violet via-[#7c3aed] to-brand-magenta text-white p-6 sm:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/70 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Panel propietario
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Hola, {user?.name?.split(" ")[0] || "propietario"}
            </h2>
            <p className="text-sm text-white/80 mt-2 max-w-lg leading-relaxed">
              Resumen de rentabilidad, inmuebles y operación — todo en un solo lugar.
            </p>
          </div>
          {s && (
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20 min-w-[140px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Ganancia neta</p>
                <p className="text-xl font-extrabold mt-1 tabular-nums">{formatCOP(s.netEarnings)}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20 min-w-[120px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Rentabilidad</p>
                <p className="text-xl font-extrabold mt-1 tabular-nums">{formatPercent(s.grossAnnualYield)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {pendingTickets > 0 && (
        <Link
          to="/propietario/tickets"
          className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 hover:bg-amber-100/80 transition-colors"
        >
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <p className="text-sm font-bold text-amber-900 flex-1">
            Tienes {pendingTickets} reparación{pendingTickets !== 1 ? "es" : ""} pendiente{pendingTickets !== 1 ? "s" : ""} de aprobación
          </p>
          <ArrowRight className="w-4 h-4 text-amber-700" />
        </Link>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Ingresos totales"
          value={s ? formatCOP(s.totalIncome) : "—"}
          hint={s ? `${s.paidMonths} pagos recibidos` : undefined}
          icon={Banknote}
          accent="emerald"
        />
        <KpiCard
          label="Ganancia neta"
          value={s ? formatCOP(s.netEarnings) : "—"}
          hint="Después de mantenimiento"
          icon={PiggyBank}
          accent="violet"
        />
        <KpiCard
          label="Leads activos"
          value={inquiries.length}
          hint="Interesados en tus inmuebles"
          icon={Users}
          accent="magenta"
        />
        <KpiCard
          label="Tickets abiertos"
          value={openTickets}
          hint={pendingTickets > 0 ? `${pendingTickets} por aprobar` : "Mantenimiento"}
          icon={Wrench}
          accent="amber"
        />
      </div>

      {/* Charts */}
      <OwnerDashboardCharts finance={finance} tickets={tickets} />

      {/* Quick links */}
      <div>
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground mb-3">Accesos rápidos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group bg-white rounded-2xl border border-border/40 p-4 hover:shadow-md hover:border-brand-violet/20 transition-all flex items-start gap-3"
              >
                <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shrink-0", TONE_STYLES[item.tone])}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-sm group-hover:text-brand-violet transition-colors">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
              </Link>
            );
          })}
        </div>
      </div>

      <Link
        to="/publicar/nuevo"
        className="flex items-center justify-center gap-2 w-full sm:w-auto sm:ml-auto gradient-cta text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:opacity-95 transition-opacity text-sm"
      >
        Publicar nuevo inmueble
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
