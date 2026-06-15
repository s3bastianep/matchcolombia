import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/api/apiClient";
import { StatCard } from "@/components/panels/StatusBadge";
import { computeDashboardMetrics } from "@/lib/adminMetrics";
import {
  Building2, Users, Calendar, AlertTriangle, MessageSquare,
  Shield, FileText, DollarSign, ArrowRight, Bell,
} from "lucide-react";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function AdminDashboard() {
  const { data: properties = [] } = useQuery({ queryKey: ["admin-properties"], queryFn: () => api.entities.Property.filter({}, "-created_date", 200) });
  const { data: inquiries = [] } = useQuery({ queryKey: ["admin-inquiries"], queryFn: () => api.entities.Inquiry.filter({}, "-created_date", 200) });
  const { data: visits = [] } = useQuery({ queryKey: ["admin-visits"], queryFn: () => api.entities.Visit.filter({}, "scheduled_at", 200) });
  const { data: messages = [] } = useQuery({ queryKey: ["admin-messages"], queryFn: () => api.entities.Message.filter({}, "-created_date", 200) });
  const { data: leases = [] } = useQuery({ queryKey: ["admin-leases"], queryFn: () => api.entities.Lease.filter({}, "-created_date", 100) });
  const { data: payments = [] } = useQuery({ queryKey: ["admin-payments"], queryFn: () => api.entities.Payment.filter({}, "-created_date", 100) });
  const { data: tickets = [] } = useQuery({ queryKey: ["admin-tickets"], queryFn: () => api.entities.Ticket.filter({}, "-created_date", 100) });
  const { data: owners = [] } = useQuery({ queryKey: ["admin-owners"], queryFn: () => api.entities.Owner.filter({}, "-created_date", 100) });

  const m = useMemo(
    () => computeDashboardMetrics({ properties, inquiries, visits, messages, leases, payments, tickets, owners }),
    [properties, inquiries, visits, messages, leases, payments, tickets, owners]
  );

  const pendingVisits = visits.filter((v) => v.status === "pendiente").length;

  const alerts = [
    m.unansweredLeads > 0 && { label: `${m.unansweredLeads} leads sin responder`, to: "/admin/leads", icon: MessageSquare },
    pendingVisits > 0 && { label: `${pendingVisits} visitas por aprobar`, to: "/admin/visitas", icon: Calendar },
    m.pendingVerifications > 0 && { label: `${m.pendingVerifications} propietarios por verificar`, to: "/admin/propietarios", icon: Shield },
    m.overduePayments > 0 && { label: `${m.overduePayments} pagos atrasados`, to: "/admin/inquilinos", icon: DollarSign },
    m.staleProperties.length > 0 && { label: `${m.staleProperties.length} propiedades estancadas`, to: "/admin/propiedades", icon: AlertTriangle },
  ].filter(Boolean);

  const quickLinks = [
    { to: "/admin/propiedades", title: "Propiedades", desc: "Workflow, fotos y publicación" },
    { to: "/admin/propietarios", title: "Propietarios", desc: "Verificación de documentos" },
    { to: "/admin/leads", title: "CRM Leads", desc: "Pipeline de 9 etapas" },
    { to: "/admin/visitas", title: "Visitas", desc: "Calendario semanal" },
    { to: "/admin/aplicaciones", title: "Aplicaciones", desc: "Revisión de candidatos" },
    { to: "/admin/inquilinos", title: "Inquilinos", desc: "Contratos y tickets" },
    { to: "/admin/reportes", title: "Reportes", desc: "Métricas de operación" },
    { to: "/admin/configuracion", title: "Configuración", desc: "WhatsApp y POIs" },
    { to: "/admin/notificaciones", title: "Notificaciones", desc: "Alertas internas" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Panel Admin</h2>
        <p className="text-sm text-muted-foreground mt-1">Vista operativa — leads, visitas, propiedades e inquilinos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Propiedades activas" value={m.activeProps} hint={`${properties.length} total`} icon={Building2} />
        <StatCard label="Leads nuevos" value={m.newLeads} hint={`${m.unansweredLeads} sin responder`} icon={Users} />
        <StatCard label="Visitas hoy" value={m.visitsToday} hint={`${m.visitsWeek} esta semana`} icon={Calendar} />
        <StatCard label="Ingreso proyectado" value={formatCOP(m.projectedIncome)} hint="10% comisión activa" icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Conversión → visita" value={`${m.conversionLeadsToVisits}%`} icon={Users} />
        <StatCard label="Conversión → cierre" value={`${m.conversionToClose}%`} icon={FileText} />
        <StatCard label="Días prom. arriendo" value={m.avgDaysToRent ?? "—"} icon={Building2} />
        <StatCard label="Tickets abiertos" value={m.openTickets} hint={`${m.unreadMessages} mensajes sin leer`} icon={Bell} />
      </div>

      {alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5">
          <p className="text-xs font-extrabold uppercase tracking-wider text-amber-800 mb-3">Requiere atención</p>
          <div className="flex flex-wrap gap-3">
            {alerts.map((a) => (
              <Link key={a.to} to={a.to} className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl bg-white border border-amber-200/50 hover:border-amber-300">
                <a.icon className="w-4 h-4 text-amber-600" />
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {m.contractsRenewing.length > 0 && (
        <div className="bg-white rounded-2xl border border-border/40 p-5">
          <p className="font-bold mb-3">Contratos por renovar (60 días)</p>
          <ul className="space-y-2 text-sm">
            {m.contractsRenewing.map((l) => (
              <li key={l.id} className="flex justify-between">
                <span className="text-muted-foreground">Contrato {l.id.slice(-6)}</span>
                <span className="font-semibold">vence {l.end_date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((item) => (
          <Link key={item.to} to={item.to} className="group bg-white rounded-2xl border border-border/40 p-5 hover:border-brand-violet/30 hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <p className="font-extrabold">{item.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-violet shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
