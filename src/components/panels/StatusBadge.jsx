import React from "react";
import { cn } from "@/lib/utils";

const STYLES = {
  disponible: "bg-[hsl(168,72%,40%)]/10 text-[hsl(168,72%,32%)] border-[hsl(168,72%,40%)]/25",
  en_proceso: "bg-[hsl(32,95%,54%)]/10 text-[hsl(32,95%,38%)] border-[hsl(32,95%,54%)]/25",
  reservado: "bg-[hsl(200,70%,42%)]/10 text-[hsl(200,70%,32%)] border-[hsl(200,70%,42%)]/25",
  arrendado: "bg-[hsl(265,75%,58%)]/10 text-[hsl(265,75%,45%)] border-[hsl(265,75%,58%)]/25",
  vendido: "bg-foreground/10 text-foreground border-foreground/20",
  nueva: "bg-[hsl(200,70%,42%)]/10 text-[hsl(200,70%,32%)] border-[hsl(200,70%,42%)]/25",
  nuevo: "bg-[hsl(200,70%,42%)]/10 text-[hsl(200,70%,32%)] border-[hsl(200,70%,42%)]/25",
  contactado: "bg-[hsl(32,95%,54%)]/10 text-[hsl(32,95%,38%)] border-[hsl(32,95%,54%)]/25",
  visita_agendada: "bg-[hsl(265,75%,58%)]/10 text-[hsl(265,75%,45%)] border-[hsl(265,75%,58%)]/25",
  en_negociacion: "bg-[hsl(32,95%,54%)]/10 text-[hsl(32,95%,38%)] border-[hsl(32,95%,54%)]/25",
  cerrado: "bg-foreground/10 text-foreground border-foreground/20",
  pendiente: "bg-[hsl(32,95%,54%)]/10 text-[hsl(32,95%,38%)] border-[hsl(32,95%,54%)]/25",
  confirmada: "bg-[hsl(168,72%,40%)]/10 text-[hsl(168,72%,32%)] border-[hsl(168,72%,40%)]/25",
  reprogramada: "bg-[hsl(200,70%,42%)]/10 text-[hsl(200,70%,32%)] border-[hsl(200,70%,42%)]/25",
  completada: "bg-foreground/10 text-foreground border-foreground/20",
  cancelada: "bg-red-500/10 text-red-600 border-red-500/20",
  abierto: "bg-[hsl(340,82%,52%)]/10 text-[hsl(340,82%,42%)] border-[hsl(340,82%,52%)]/25",
  resuelto: "bg-[hsl(168,72%,40%)]/10 text-[hsl(168,72%,32%)] border-[hsl(168,72%,40%)]/25",
  documentos_enviados: "bg-[hsl(200,70%,42%)]/10 text-[hsl(200,70%,32%)] border-[hsl(200,70%,42%)]/25",
  en_revision: "bg-[hsl(32,95%,54%)]/10 text-[hsl(32,95%,38%)] border-[hsl(32,95%,54%)]/25",
  aprobado: "bg-[hsl(168,72%,40%)]/10 text-[hsl(168,72%,32%)] border-[hsl(168,72%,40%)]/25",
  rechazado: "bg-red-500/10 text-red-600 border-red-500/20",
  pagado: "bg-[hsl(168,72%,40%)]/10 text-[hsl(168,72%,32%)] border-[hsl(168,72%,40%)]/25",
  atrasado: "bg-red-500/10 text-red-600 border-red-500/20",
  activo: "bg-[hsl(168,72%,40%)]/10 text-[hsl(168,72%,32%)] border-[hsl(168,72%,40%)]/25",
};

const LABELS = {
  en_proceso: "En proceso",
  visita_agendada: "Visita agendada",
  en_negociacion: "En negociación",
  documentos_enviados: "Docs enviados",
  en_revision: "En revisión",
};

export default function StatusBadge({ status, className }) {
  const key = status?.toLowerCase?.() || "";
  return (
    <span className={cn("inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize", STYLES[key] || STYLES.nuevo, className)}>
      {LABELS[key] || status?.replace?.(/_/g, " ") || status}
    </span>
  );
}

export function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-border/40 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          <p className="text-2xl font-extrabold mt-1 tracking-tight">{value}</p>
          {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[hsl(265,75%,58%)]/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-[hsl(265,75%,50%)]" />
          </div>
        )}
      </div>
    </div>
  );
}
