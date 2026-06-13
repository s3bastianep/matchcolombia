import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { StatCard } from "@/components/panels/StatusBadge";
import { Building2, Users, Calendar, TrendingUp, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const { data: properties = [] } = useQuery({ queryKey: ["admin-properties"], queryFn: () => base44.entities.Property.filter({}, "-created_date", 200) });
  const { data: inquiries = [] } = useQuery({ queryKey: ["admin-inquiries"], queryFn: () => base44.entities.Inquiry.filter({}, "-created_date", 200) });
  const { data: visits = [] } = useQuery({ queryKey: ["admin-visits"], queryFn: () => base44.entities.Visit.filter({}, "-created_date", 200) });
  const { data: tickets = [] } = useQuery({ queryKey: ["admin-tickets"], queryFn: () => base44.entities.Ticket.filter({}, "-created_date", 200) });

  const activas = properties.filter((p) => p.status === "disponible").length;
  const nuevosLeads = inquiries.filter((i) => (i.pipeline_stage || i.status) === "nuevo" || i.status === "nueva").length;
  const visitasPendientes = visits.filter((v) => v.status === "pendiente" || v.status === "confirmada").length;
  const ticketsAbiertos = tickets.filter((t) => t.status !== "resuelto").length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Panel Admin</h2>
        <p className="text-sm text-muted-foreground mt-1">Gestión central de propiedades, leads, visitas e inquilinos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Propiedades activas" value={activas} hint={`${properties.length} total`} icon={Building2} />
        <StatCard label="Leads nuevos" value={nuevosLeads} hint={`${inquiries.length} en pipeline`} icon={Users} />
        <StatCard label="Visitas próximas" value={visitasPendientes} icon={Calendar} />
        <StatCard label="Tickets abiertos" value={ticketsAbiertos} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { to: "/admin/propiedades", title: "Propiedades", desc: "CRUD, fotos, estado y ubicación" },
          { to: "/admin/leads", title: "Leads & mensajes", desc: "Pipeline CRM por propiedad" },
          { to: "/admin/visitas", title: "Visitas", desc: "Calendario y confirmaciones" },
          { to: "/admin/inquilinos", title: "Inquilinos activos", desc: "Contratos, pagos y tickets" },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="group bg-white rounded-2xl border border-border/40 p-5 hover:border-[hsl(265,75%,58%)]/30 hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <p className="font-extrabold">{item.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-[hsl(265,75%,50%)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
