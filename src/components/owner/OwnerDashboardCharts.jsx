import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  buildMonthlyCashflow,
  buildPortfolioComparison,
  buildPropertyIncomeSplit,
  buildTicketStatusSplit,
  formatCOP,
} from "@/lib/ownerFinance";

const PIE_COLORS = ["#8B5CF6", "#E91E7A", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];

function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden ${className}`}>
      <div className="px-5 pt-5 pb-2 border-b border-border/20">
        <h3 className="font-extrabold text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function CopTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border/50 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-semibold tabular-nums">
          {entry.name}: {formatCOP(entry.value)}
        </p>
      ))}
    </div>
  );
}

function CountTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border/50 rounded-xl shadow-lg px-3 py-2 text-xs font-bold">
      {payload[0].payload.label}: {payload[0].value}
    </div>
  );
}

export default function OwnerDashboardCharts({ finance, tickets = [], compact = false }) {
  const charts = useMemo(() => {
    if (!finance?.summary) return null;
    return {
      monthly: buildMonthlyCashflow(
        finance.ownerPayments || [],
        finance.ownerTickets || [],
        finance.leaseById || new Map()
      ),
      portfolio: buildPortfolioComparison(finance.summary),
      propertySplit: buildPropertyIncomeSplit(finance.properties || []),
      ticketSplit: buildTicketStatusSplit(tickets.length ? tickets : finance.ownerTickets || []),
    };
  }, [finance, tickets]);

  if (!charts) return null;

  const chartHeight = compact ? 200 : 260;

  if (compact) {
    return (
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={charts.monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="ownerIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1e6)}M`} width={36} />
            <Tooltip content={<CopTooltip />} />
            <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#8B5CF6" strokeWidth={2} fill="url(#ownerIncomeGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Ingresos mensuales" subtitle="Canon cobrado por mes" className="xl:col-span-2">
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ingresosArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gastosArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,92%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} width={42} />
                <Tooltip content={<CopTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
                <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#10b981" strokeWidth={2.5} fill="url(#ingresosArea)" />
                <Area type="monotone" dataKey="gastos" name="Mantenimiento" stroke="#f59e0b" strokeWidth={2} fill="url(#gastosArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Tickets de mantenimiento" subtitle="Por estado actual">
          <div style={{ height: chartHeight }}>
            {charts.ticketSplit.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">Sin tickets</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.ticketSplit}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {charts.ticketSplit.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CountTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Balance acumulado" subtitle="Ingresos, gastos y ganancia neta">
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.portfolio} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,92%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} width={42} />
                <Tooltip content={<CopTooltip />} />
                <Bar dataKey="value" name="Monto" radius={[8, 8, 0, 0]}>
                  {charts.portfolio.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Ingresos por inmueble" subtitle="Distribución de tu cartera">
          <div style={{ height: chartHeight }}>
            {charts.propertySplit.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">Sin ingresos registrados</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.propertySplit}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {charts.propertySplit.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCOP(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
