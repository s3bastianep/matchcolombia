import React from "react";
import { cn } from "@/lib/utils";

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-[hsl(0,0%,90%)] bg-[hsl(0,0%,99%)] px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[hsl(0,0%,45%)]">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-[hsl(0,0%,12%)] mt-1 tabular-nums">{value}</p>
    </div>
  );
}

export default function SellDashboardScreen({ className }) {
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
            <span className="text-[11px] text-[hsl(0,0%,50%)] font-mono">app.matchcolombia.co/venta</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 font-[system-ui,sans-serif]">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5 pb-4 border-b border-[hsl(0,0%,92%)]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[hsl(265,50%,50%)]">Panel de venta</p>
              <h3 className="text-lg sm:text-xl font-bold text-[hsl(0,0%,12%)] mt-0.5">Apartamento Quinta Camacho</h3>
              <p className="text-[12px] text-[hsl(0,0%,45%)] mt-0.5">Chapinero · Bogotá</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[hsl(152,60%,94%)] text-[hsl(152,45%,32%)] border border-[hsl(152,40%,80%)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[hsl(152,55%,42%)]" />
              Negociación activa
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Metric label="Visualizaciones" value="543" />
            <Metric label="Interesados" value="17" />
            <Metric label="Visitas agendadas" value="8" />
            <Metric label="Ofertas recibidas" value="2" />
          </div>

          <div className="mt-4 rounded-lg border border-[hsl(0,0%,90%)] bg-[hsl(0,0%,97%)] px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[hsl(0,0%,45%)]">Estado</p>
            <p className="text-[13px] font-semibold text-[hsl(152,45%,32%)] mt-1 flex items-center gap-2">
              <span className="text-base" role="img" aria-hidden>🟢</span>
              Negociación activa
            </p>
            <p className="text-[12px] text-[hsl(0,0%,45%)] mt-1">Última oferta revisada hoy</p>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-4">
        Vista del panel de venta. Datos de ejemplo.
      </p>
    </div>
  );
}
