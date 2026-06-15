import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import StatusBadge from "@/components/panels/StatusBadge";
import { FileText, MessageSquare, Calendar, Heart, ArrowRight } from "lucide-react";

export default function SeekerPortal() {
  const { user } = useAuth();
  const { data: applications = [] } = useQuery({
    queryKey: ["my-applications", user?.id],
    queryFn: () => api.entities.Application.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });
  const { data: visits = [] } = useQuery({
    queryKey: ["my-visits", user?.id],
    queryFn: () => api.entities.Visit.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold">Hola, {user?.name?.split(" ")[0]}</h2>
        <p className="text-sm text-muted-foreground mt-1">Tu proceso de arriendo/compra en un solo lugar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: "/explorar", label: "Explorar", icon: Heart, desc: "Lista y mapa" },
          { to: "/portal/aplicaciones", label: "Mis procesos", icon: FileText, desc: `${applications.length} activos` },
          { to: "/portal/mensajes", label: "Mensajes", icon: MessageSquare, desc: "Chat por propiedad" },
          { to: "/portal/visitas", label: "Visitas", icon: Calendar, desc: `${visits.length} agendadas` },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="bg-white rounded-2xl border border-border/40 p-5 hover:shadow-md transition-all group">
            <item.icon className="w-5 h-5 text-brand-violet mb-3" />
            <p className="font-extrabold">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            <ArrowRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>

      {applications.length > 0 && (
        <section>
          <h3 className="font-bold mb-3">Estado de tus procesos</h3>
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-border/40 p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-sm">Solicitud #{app.id.slice(-6)}</p>
                  <p className="text-xs text-muted-foreground">Propiedad {app.property_id?.slice(-8)}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
