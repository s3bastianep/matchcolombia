import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { StatCard } from "@/components/panels/StatusBadge";
import { Building2, Users, Wrench, ArrowRight } from "lucide-react";

export default function OwnerPortal() {
  const { user } = useAuth();
  const { data: properties = [] } = useQuery({ queryKey: ["owner-properties"], queryFn: () => base44.entities.Property.filter({}, "-created_date", 200) });
  const { data: inquiries = [] } = useQuery({ queryKey: ["admin-inquiries"], queryFn: () => base44.entities.Inquiry.filter({}, "-created_date", 200) });
  const { data: tickets = [] } = useQuery({ queryKey: ["admin-tickets"], queryFn: () => base44.entities.Ticket.filter({}, "-created_date", 200) });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold">Panel propietario</h2>
        <p className="text-sm text-muted-foreground mt-1">Visibilidad de tu activo sin depender del WhatsApp.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Propiedades" value={properties.length} icon={Building2} />
        <StatCard label="Leads recibidos" value={inquiries.length} icon={Users} />
        <StatCard label="Tickets mantenimiento" value={tickets.filter((t) => t.status !== "resuelto").length} icon={Wrench} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { to: "/propietario/propiedades", title: "Mis propiedades", desc: "Estado, leads y rentabilidad" },
          { to: "/propietario/leads", title: "Leads", desc: "Interesados por propiedad" },
          { to: "/propietario/tickets", title: "Mantenimiento", desc: "Aprueba gastos y tickets" },
          { to: "/publicar/nuevo", title: "Publicar inmueble", desc: "Agregar nueva propiedad" },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="bg-white rounded-2xl border border-border/40 p-5 hover:shadow-md flex justify-between items-center group">
            <div>
              <p className="font-extrabold">{item.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-[hsl(32,95%,45%)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
