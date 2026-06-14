import React from "react";
import { cn } from "@/lib/utils";

function formatCanon(value) {
  return `$${value.toLocaleString("es-CO")}`;
}

function Field({ label, value, valueClass }) {
  return (
    <div>
      <p className="text-[14px] text-[hsl(0,0%,40%)]">{label}:</p>
      <p className={cn("text-[15px] sm:text-[16px] font-semibold text-[hsl(0,0%,8%)] mt-0.5 leading-snug", valueClass)}>
        {value}
      </p>
    </div>
  );
}

export default function OwnerDashboardScreen({ className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-lg border border-[hsl(0,0%,88%)] bg-[hsl(0,0%,97%)] p-3 sm:p-4 max-w-sm mx-auto lg:max-w-[340px] lg:mx-0">
        <div className="rounded-md bg-white border border-[hsl(0,0%,90%)] px-4 py-5 sm:px-5 sm:py-6 font-[system-ui,-apple-system,BlinkMacSystemFont,sans-serif]">
          <p className="text-[16px] sm:text-[17px] font-bold text-[hsl(0,0%,8%)] leading-tight">Carlos Gómez</p>
          <p className="text-[14px] text-[hsl(0,0%,42%)] mt-1">Apartamento Quinta Camacho</p>

          <div className="mt-5 space-y-3.5">
            <Field label="Canon" value={formatCanon(2300000)} />
            <Field label="Estado" value="Pagado ✓" valueClass="text-[hsl(152,45%,32%)]" />
          </div>

          <div className="my-5 h-px bg-[hsl(0,0%,91%)]" />

          <div className="space-y-3.5">
            <Field label="Ticket" value="Reparación grifería" />
            <Field label="Estado" value="Técnico asignado" valueClass="text-[hsl(265,50%,42%)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
