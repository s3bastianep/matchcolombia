import React from "react";
import { cn } from "@/lib/utils";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

function Row({ label, value, valueClass }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-[hsl(0,0%,92%)] last:border-0 text-[13px]">
      <span className="text-[hsl(0,0%,45%)] shrink-0">{label}</span>
      <span className={cn("font-semibold text-right text-[hsl(0,0%,15%)]", valueClass)}>{value}</span>
    </div>
  );
}

export default function OwnerDashboardScreen({ className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-xl border border-[hsl(0,0%,88%)] bg-[hsl(0,0%,96%)] shadow-[0_24px_80px_rgba(15,23,42,0.14)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(0,0%,93%)] border-b border-[hsl(0,0%,88%)]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-2 h-7 rounded-md bg-white border border-[hsl(0,0%,88%)] flex items-center px-3">
            <span className="text-[11px] text-[hsl(0,0%,50%)] font-mono">app.matchcolombia.co/propietario</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 font-[system-ui,sans-serif]">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5 pb-4 border-b border-[hsl(0,0%,92%)]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[hsl(265,50%,50%)]">Panel propietario</p>
              <h3 className="text-lg sm:text-xl font-bold text-[hsl(0,0%,12%)] mt-0.5">Carlos Gómez</h3>
              <p className="text-[12px] text-[hsl(0,0%,45%)] mt-0.5">Apartamento Quinta Camacho · Chapinero</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[hsl(152,60%,94%)] text-[hsl(152,45%,32%)] border border-[hsl(152,40%,80%)]">
              Arrendado
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="rounded-lg border border-[hsl(0,0%,90%)] p-4 bg-[hsl(0,0%,99%)]">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[hsl(0,0%,45%)] mb-3">Pagos</p>
              <Row label="Canon mensual" value={formatCOP(2300000)} />
              <Row label="Último pago" value="Recibido ✓" valueClass="text-[hsl(152,45%,32%)]" />
              <Row label="Próximo pago" value="05/07/2026" />
            </div>

            <div className="rounded-lg border border-[hsl(0,0%,90%)] p-4 bg-[hsl(0,0%,99%)]">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[hsl(0,0%,45%)] mb-3">Contrato</p>
              <Row label="Inicio" value="01/03/2026" />
              <Row label="Fin" value="01/03/2027" />
              <Row label="Inquilino" value="Laura Méndez" />
            </div>

            <div className="sm:col-span-2 rounded-lg border border-[hsl(0,0%,90%)] p-4 bg-[hsl(0,0%,99%)]">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[hsl(0,0%,45%)] mb-3">Tickets</p>
              <div className="rounded-md bg-[hsl(0,0%,97%)] border border-[hsl(0,0%,90%)] px-3 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-bold text-[hsl(0,0%,15%)]">#1823 Grifería cocina</p>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[hsl(265,60%,95%)] text-[hsl(265,50%,42%)]">
                    Técnico asignado
                  </span>
                </div>
                <p className="text-[12px] text-[hsl(0,0%,45%)] mt-1.5">Actualizado hoy · Mantenimiento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-4">
        Vista del panel propietario. Datos de ejemplo.
      </p>
    </div>
  );
}
