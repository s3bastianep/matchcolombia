import React from "react";
import { cn } from "@/lib/utils";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

export default function TenantPortalScreen({ className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-xl border border-[hsl(0,0%,88%)] bg-[hsl(0,0%,96%)] shadow-[0_24px_80px_rgba(15,23,42,0.12)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(0,0%,93%)] border-b border-[hsl(0,0%,88%)]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-2 h-7 rounded-md bg-white border border-[hsl(0,0%,88%)] flex items-center px-3">
            <span className="text-[11px] text-[hsl(0,0%,50%)] font-mono">app.matchcolombia.co/inquilino</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 font-[system-ui,sans-serif]">
          <div className="mb-5 pb-4 border-b border-[hsl(0,0%,92%)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[hsl(340,70%,48%)]">Portal del arrendatario</p>
            <h3 className="text-lg font-bold text-[hsl(0,0%,12%)] mt-0.5">Laura Méndez</h3>
            <p className="text-[12px] text-[hsl(0,0%,45%)]">Apartamento Quinta Camacho</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-[hsl(0,0%,90%)] overflow-hidden">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[hsl(0,0%,45%)] px-4 py-2.5 bg-[hsl(0,0%,97%)] border-b border-[hsl(0,0%,90%)]">
                Historial de pagos
              </p>
              <table className="w-full text-[12px]">
                <tbody>
                  {[
                    { period: "May 2026", amount: 2300000, status: "Pagado" },
                    { period: "Jun 2026", amount: 2300000, status: "Pagado" },
                  ].map((p) => (
                    <tr key={p.period} className="border-b border-[hsl(0,0%,93%)] last:border-0">
                      <td className="px-4 py-2.5 text-[hsl(0,0%,45%)]">{p.period}</td>
                      <td className="px-4 py-2.5 font-semibold">{formatCOP(p.amount)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={cn(
                          "text-[11px] font-semibold",
                          p.status === "Pagado" ? "text-[hsl(152,45%,32%)]" : "text-[hsl(35,80%,40%)]"
                        )}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-[hsl(0,0%,90%)] p-3.5">
                <p className="text-[11px] font-bold text-[hsl(0,0%,45%)] uppercase">Contrato digital</p>
                <p className="text-[13px] font-semibold mt-1">Vigente hasta 01/03/2027</p>
                <p className="text-[12px] text-[hsl(265,50%,48%)] mt-1 font-medium">Ver contrato →</p>
              </div>
              <div className="rounded-lg border border-[hsl(0,0%,90%)] p-3.5">
                <p className="text-[11px] font-bold text-[hsl(0,0%,45%)] uppercase">Mantenimiento</p>
                <p className="text-[13px] font-semibold mt-1">#1823 Grifería cocina</p>
                <p className="text-[12px] text-[hsl(0,0%,45%)] mt-1">Técnico asignado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-4">
        Vista del portal inquilino. Datos de ejemplo.
      </p>
    </div>
  );
}
