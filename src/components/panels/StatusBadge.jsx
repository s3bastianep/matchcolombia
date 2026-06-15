import React from "react";
import { cn } from "@/lib/utils";

const A = "bg-amber-500/12 text-amber-800 border-amber-500/25";
const G = "bg-emerald-500/12 text-emerald-700 border-emerald-500/25";
const V = "bg-brand-violet/10 text-brand-violet border-brand-violet/25";
const M = "bg-brand-magenta/10 text-brand-magenta border-brand-magenta/25";
const N = "bg-foreground/10 text-foreground border-foreground/20";
const R = "bg-red-500/10 text-red-600 border-red-500/20";

const STYLES = {
  disponible: V,
  publicada: G,
  borrador: N,
  archivada: N,
  arrendada: V,
  en_proceso: M,
  reservado: V,
  arrendado: V,
  vendido: N,
  nueva: M,
  nuevo: M,
  contactado: M,
  visita_agendada: V,
  visitado: V,
  aplicacion_enviada: M,
  revision_documentos: M,
  aprobado: G,
  perdido: R,
  interesado: M,
  en_negociacion: M,
  cerrado: N,
  pendiente: A,
  verificado: G,
  rechazado: R,
  confirmada: G,
  reprogramada: V,
  completada: N,
  cancelada: R,
  presencial: V,
  virtual: M,
  abierto: M,
  resuelto: G,
  documentos_enviados: V,
  en_revision: A,
  pagado: G,
  atrasado: R,
  activo: G,
};

const LABELS = {
  en_proceso: "En proceso",
  visita_agendada: "Visita agendada",
  en_negociacion: "En negociación",
  documentos_enviados: "Docs enviados",
  en_revision: "En revisión",
  revision_documentos: "Revisión docs",
  aplicacion_enviada: "Aplicación enviada",
  publicada: "Publicada",
  borrador: "Borrador",
  archivada: "Archivada",
  arrendada: "Arrendada",
  verificado: "Verificado",
  presencial: "Presencial",
  virtual: "Virtual",
};

export default function StatusBadge({ status, className }) {
  const key = status?.toLowerCase?.() || "";
  return (
    <span className={cn("inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize", STYLES[key] || STYLES.nuevo, className)}>
      {LABELS[key] || status?.replace?.(/_/g, " ") || status}
    </span>
  );
}

export function StatCard({ label, value, hint, icon: Icon, tone = "violet" }) {
  const iconBg = tone === "amber" ? "bg-amber-500/12" : tone === "emerald" ? "bg-emerald-500/12" : "bg-brand-violet/10";
  const iconColor = tone === "amber" ? "text-amber-600" : tone === "emerald" ? "text-emerald-600" : "text-brand-violet";
  return (
    <div className="bg-white rounded-2xl border border-border/40 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          <p className="text-2xl font-extrabold mt-1 tracking-tight">{value}</p>
          {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
        </div>
        {Icon && (
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}
