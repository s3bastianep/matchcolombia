import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import StatusBadge from "@/components/panels/StatusBadge";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function TenantPayments() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: payments = [] } = useQuery({
    queryKey: ["tenant-payments", user?.id],
    queryFn: () => base44.entities.Payment.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const pay = useMutation({
    mutationFn: (id) => base44.entities.Payment.update(id, { status: "pagado", paid_at: new Date().toISOString() }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant-payments"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">Estado de cuenta</h2>
        <p className="text-sm text-muted-foreground">Historial de pagos — integración con pasarela colombiana próximamente.</p>
      </div>
      <div className="space-y-3">
        {payments.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-border/40 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold">{formatCOP(p.amount)}</p>
              <p className="text-xs text-muted-foreground">Periodo {p.period} · Vence {p.due_date}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={p.status} />
              {p.status === "pendiente" && (
                <button type="button" onClick={() => pay.mutate(p.id)} className="text-xs font-bold gradient-cta text-white px-4 py-2 rounded-xl">
                  Pagar ahora
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
