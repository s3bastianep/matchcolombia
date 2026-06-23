import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BRAND } from "@/lib/brand";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { StatCard } from "@/components/panels/StatusBadge";
import StatusBadge from "@/components/panels/StatusBadge";
import { Link } from "react-router-dom";
import { CreditCard, FileText, Wrench, MessageSquare, AlertCircle } from "lucide-react";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function TenantPortal() {
  const { user } = useAuth();
  const { data: leases = [] } = useQuery({
    queryKey: ["tenant-leases", user?.id],
    queryFn: () => api.entities.Lease.filter({ tenant_user_id: user?.id }),
    enabled: !!user?.id,
  });
  const { data: payments = [] } = useQuery({
    queryKey: ["tenant-payments", user?.id],
    queryFn: () => api.entities.Payment.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ["tenant-tickets", user?.id],
    queryFn: () => api.entities.Ticket.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const lease = leases[0];
  const pending = payments.find((p) => p.status === "pendiente");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold">Mi arriendo</h2>
        <p className="text-sm text-muted-foreground mt-1">Contrato, pagos, soporte y renovación.</p>
      </div>

      {pending && (
        <div className="bg-brand-magenta/10 border border-brand-magenta/25 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-brand-magenta shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">Pago pendiente: {formatCOP(pending.amount)}</p>
            <p className="text-xs text-muted-foreground">Vence {pending.due_date}</p>
          </div>
          <Link to="/inquilino/pagos" className="text-xs font-bold gradient-cta text-white px-4 py-2 rounded-xl shrink-0">Pagar</Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Contrato" value={lease ? "Activo" : "N/D"} hint={lease?.end_date ? `Hasta ${lease.end_date}` : ""} icon={FileText} />
        <StatCard label="Próximo pago" value={pending ? formatCOP(pending.amount) : "Al día"} icon={CreditCard} />
        <StatCard label="Tickets abiertos" value={tickets.filter((t) => t.status !== "resuelto").length} icon={Wrench} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { to: "/inquilino/contrato", label: "Ver contrato", icon: FileText },
          { to: "/inquilino/pagos", label: "Estado de cuenta", icon: CreditCard },
          { to: "/inquilino/tickets", label: "Soporte", icon: Wrench },
          { to: "/portal/mensajes", label: `Chat con ${BRAND.name}`, icon: MessageSquare },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="bg-white rounded-2xl border border-border/40 p-5 hover:shadow-md transition-all flex items-center gap-3">
            <item.icon className="w-5 h-5 text-brand-violet" />
            <span className="font-bold">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
