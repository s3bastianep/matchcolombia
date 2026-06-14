import React from "react";
import { Check, X } from "lucide-react";
import { BRAND } from "@/lib/brand";

const ROWS = [
  { traditional: "Llamadas para seguimiento", match: "Panel en tiempo real" },
  { traditional: "Documentos por correo", match: "Contratos digitales" },
  { traditional: "Reportes manuales", match: "Dashboard centralizado" },
  { traditional: "Seguimiento limitado", match: "Tickets y trazabilidad" },
  { traditional: "Información dispersa", match: "Todo en un solo lugar" },
];

export default function TraditionalVsMatch() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="border-l-4 border-brand-magenta pl-4 sm:pl-5 mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Inmobiliaria tradicional vs {BRAND.name}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            La diferencia no es solo tecnología. Es tranquilidad: saber qué pasa con tu inmueble sin depender de llamadas.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 overflow-hidden shadow-sm">
          <div className="grid grid-cols-[1fr_1fr] bg-[hsl(0,0%,97%)] border-b border-border/30 text-xs sm:text-sm font-extrabold">
            <div className="px-4 sm:px-6 py-3.5 text-muted-foreground">Inmobiliaria tradicional</div>
            <div className="px-4 sm:px-6 py-3.5 text-brand-violet border-l border-border/30">{BRAND.name}</div>
          </div>
          {ROWS.map((row) => (
            <div key={row.traditional} className="grid grid-cols-[1fr_1fr] border-b border-border/20 last:border-0 text-sm">
              <div className="px-4 sm:px-6 py-4 flex items-start gap-2.5 text-muted-foreground">
                <X className="w-4 h-4 shrink-0 mt-0.5 text-brand-magenta/70" />
                <span>{row.traditional}</span>
              </div>
              <div className="px-4 sm:px-6 py-4 flex items-start gap-2.5 font-semibold border-l border-border/20 bg-brand-violet/[0.02]">
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-brand-violet" strokeWidth={2.5} />
                <span>{row.match}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
