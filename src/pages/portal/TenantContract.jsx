import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import StatusBadge from "@/components/panels/StatusBadge";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function TenantContract() {
  const { user } = useAuth();
  const { data: leases = [] } = useQuery({
    queryKey: ["tenant-leases", user?.id],
    queryFn: () => base44.entities.Lease.filter({ tenant_user_id: user?.id }),
    enabled: !!user?.id,
  });
  const lease = leases[0];

  if (!lease) return <p className="text-muted-foreground">No tienes contrato activo.</p>;

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-xl font-extrabold">Mi contrato</h2>
      <div className="bg-white rounded-2xl border border-border/40 p-6 space-y-4">
        <div className="flex justify-between"><span className="text-muted-foreground text-sm">Estado</span><StatusBadge status={lease.status} /></div>
        <div className="flex justify-between"><span className="text-muted-foreground text-sm">Inicio</span><span className="font-bold">{lease.start_date}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground text-sm">Fin</span><span className="font-bold">{lease.end_date}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground text-sm">Canon mensual</span><span className="font-extrabold">{formatCOP(lease.monthly_rent)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground text-sm">Administración</span><span className="font-bold">{formatCOP(lease.admin_fee)}</span></div>
        <p className="text-xs text-muted-foreground pt-2 border-t">Renovación: recibirás aviso 30 días antes del vencimiento.</p>
      </div>
    </div>
  );
}
