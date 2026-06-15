import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import StatusBadge from "@/components/panels/StatusBadge";
import {
  formatTicketCost,
  formatTicketDate,
  canOwnerApprove,
  appendTimeline,
  OWNER_APPROVAL_LABELS,
} from "@/lib/ticketUtils";
import { cn } from "@/lib/utils";
import { Check, X, Clock, Wrench, ImageIcon, Banknote, User } from "lucide-react";

function Timeline({ events = [] }) {
  if (!events.length) return null;
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Qué ha pasado</p>
      <ol className="space-y-2 border-l-2 border-brand-violet/15 pl-3 ml-1">
        {events.map((ev, i) => (
          <li key={`${ev.at}-${i}`} className="relative">
            <span className="absolute -left-[0.95rem] top-1.5 w-2 h-2 rounded-full bg-brand-violet/40" />
            <p className="text-xs text-foreground leading-relaxed">{ev.text}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {formatTicketDate(ev.at)}
              {ev.by ? ` · ${ev.by}` : ""}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PhotoGrid({ images = [] }) {
  if (!images?.length) return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
        <ImageIcon className="w-3 h-3" /> Fotos del reporte
      </p>
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <a
            key={url + i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-border/50 hover:ring-2 hover:ring-brand-violet/30 transition-shadow"
          >
            <img src={url} alt={`Evidencia ${i + 1}`} className="w-full h-full object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function MaintenanceTicketCard({ ticket, propertyTitle, showOwnerActions = false }) {
  const qc = useQueryClient();

  const update = useMutation({
    mutationFn: (patch) => api.entities.Ticket.update(ticket.id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tickets"] });
      qc.invalidateQueries({ queryKey: ["owner-tickets"] });
    },
  });

  const approve = () => {
    update.mutate({
      status: "en_proceso",
      owner_approval: "aprobado",
      owner_decided_at: new Date().toISOString(),
      timeline: appendTimeline(ticket, "Propietario aprobó la reparación y el costo.", "propietario"),
    });
  };

  const reject = () => {
    update.mutate({
      status: "rechazado",
      owner_approval: "rechazado",
      owner_decided_at: new Date().toISOString(),
      timeline: appendTimeline(ticket, "Propietario rechazó la reparación o el costo.", "propietario"),
    });
  };

  const pending = showOwnerActions && canOwnerApprove(ticket);
  const borderStyle = {
    pendiente_aprobacion: "border-l-amber-400 bg-amber-50/25",
    en_proceso: "border-l-brand-violet bg-brand-violet/[0.04]",
    resuelto: "border-l-emerald-500 bg-emerald-50/25",
    rechazado: "border-l-red-400 bg-red-50/25",
    abierto: "border-l-brand-magenta bg-brand-magenta/[0.03]",
  };

  return (
    <article
      className={cn(
        "bg-white rounded-2xl border border-border/40 border-l-4 p-4 sm:p-5 shadow-sm",
        borderStyle[ticket.status] || "border-l-border"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-extrabold text-base">{ticket.title}</h3>
            <StatusBadge status={ticket.status} />
          </div>
          {propertyTitle && (
            <p className="text-xs text-muted-foreground">{propertyTitle}</p>
          )}
        </div>
        {ticket.priority && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
            Prioridad: {ticket.priority}
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{ticket.description}</p>

      {ticket.repair_summary && (
        <div className="mb-4 p-3 rounded-xl bg-[hsl(0,0%,98%)] border border-border/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-violet mb-1 flex items-center gap-1">
            <Wrench className="w-3 h-3" /> Diagnóstico
          </p>
          <p className="text-sm text-foreground leading-relaxed">{ticket.repair_summary}</p>
          {ticket.provider_name && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <User className="w-3 h-3" /> Proveedor: {ticket.provider_name}
            </p>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <PhotoGrid images={ticket.images} />
        <div className={cn(!ticket.images?.length && "sm:col-span-2")}>
          {(ticket.estimated_cost != null && ticket.estimated_cost > 0) && (
            <div className="p-4 rounded-xl border border-brand-violet/20 bg-brand-violet/[0.04]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Banknote className="w-3 h-3" /> Costo estimado de la reparación
              </p>
              <p className="text-xl font-extrabold text-brand-violet mt-1 tabular-nums">
                {formatTicketCost(ticket.estimated_cost)}
              </p>
              {ticket.owner_approval && ticket.owner_approval !== "pendiente" && (
                <p className="text-xs text-muted-foreground mt-2">
                  {OWNER_APPROVAL_LABELS[ticket.owner_approval]}
                  {ticket.owner_decided_at && ` · ${formatTicketDate(ticket.owner_decided_at)}`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Timeline events={ticket.timeline} />

      {ticket.status === "resuelto" && ticket.resolved_at && (
        <p className="mt-4 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          Reparación finalizada el {formatTicketDate(ticket.resolved_at)}
        </p>
      )}

      {ticket.status === "en_proceso" && (
        <p className="mt-4 text-xs font-semibold text-brand-violet flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          El arreglo está en curso. Te avisamos cuando finalice.
        </p>
      )}

      {pending && (
        <div className="mt-5 pt-4 border-t border-border/40 flex flex-col sm:flex-row gap-3">
          <p className="text-sm font-semibold text-amber-800 sm:flex-1 sm:self-center">
            ¿Apruebas esta reparación por {formatTicketCost(ticket.estimated_cost)}?
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={approve}
              disabled={update.isPending}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white gradient-cta hover:opacity-95 disabled:opacity-60"
            >
              <Check className="w-4 h-4" /> Aprobar
            </button>
            <button
              type="button"
              onClick={reject}
              disabled={update.isPending}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-border hover:bg-secondary disabled:opacity-60"
            >
              <X className="w-4 h-4" /> Rechazar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
