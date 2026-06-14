import React from "react";
import { cn } from "@/lib/utils";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

function Field({ label, value, valueClass }) {
  return (
    <div>
      <p className="text-[13px] text-[hsl(0,0%,48%)]">{label}</p>
      <p className={cn("text-[15px] sm:text-base font-semibold text-[hsl(0,0%,12%)] mt-1 leading-snug", valueClass)}>
        {value}
      </p>
    </div>
  );
}

export default function OwnerDashboardScreen({ className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-2xl border border-[hsl(0,0%,90%)] bg-white shadow-[0_12px_48px_rgba(15,23,42,0.1)] overflow-hidden max-w-sm mx-auto lg:max-w-md lg:mx-0">
        <div className="px-4 py-3 border-b border-[hsl(0,0%,92%)] flex items-center justify-between bg-[hsl(0,0%,99%)]">
          <span className="text-xs font-extrabold tracking-tight text-brand-violet">MatchColombia</span>
          <span className="text-[11px] font-medium text-[hsl(0,0%,50%)]">Hoy, 10:42</span>
        </div>

        <div className="p-5 sm:p-6 font-[system-ui,-apple-system,BlinkMacSystemFont,sans-serif]">
          <h3 className="text-[17px] font-bold text-[hsl(0,0%,10%)] leading-tight">Carlos Gómez</h3>
          <p className="text-[14px] text-[hsl(0,0%,45%)] mt-1">Apartamento Quinta Camacho</p>

          <div className="mt-6 space-y-4">
            <Field label="Canon" value={formatCOP(2300000)} />
            <Field label="Estado" value="Pagado ✓" valueClass="text-[hsl(152,45%,32%)]" />
          </div>

          <div className="my-6 h-px bg-[hsl(0,0%,92%)]" />

          <div className="space-y-4">
            <Field label="Ticket" value="Reparación grifería" />
            <Field label="Estado" value="Técnico asignado" valueClass="text-brand-violet" />
          </div>
        </div>
      </div>
      <p className="text-center text-[11px] text-muted-foreground/75 mt-3 lg:text-left">
        Vista del panel propietario
      </p>
    </div>
  );
}
