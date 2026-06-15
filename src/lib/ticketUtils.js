/** Estados y utilidades para tickets de mantenimiento */

export const TICKET_STATUS_LABELS = {
  abierto: "Abierto",
  pendiente_aprobacion: "Pendiente de tu aprobación",
  en_proceso: "Reparación en proceso",
  resuelto: "Finalizado",
  rechazado: "Rechazado",
};

export const TICKET_STATUS_ORDER = ["pendiente_aprobacion", "abierto", "en_proceso", "resuelto", "rechazado"];

export const OWNER_APPROVAL_LABELS = {
  pendiente: "Esperando tu decisión",
  aprobado: "Aprobaste el gasto",
  rechazado: "Rechazaste el gasto",
};

export function formatTicketCost(amount) {
  if (amount == null || amount === "" || Number(amount) === 0) return "Sin costo estimado";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function formatTicketDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function canOwnerApprove(ticket) {
  return (
    ticket.owner_approval === "pendiente" ||
    ticket.status === "pendiente_aprobacion"
  );
}

export function ticketNeedsOwnerAction(ticket) {
  return canOwnerApprove(ticket);
}

export function appendTimeline(ticket, text, by = "propietario") {
  const entry = { at: new Date().toISOString(), text, by };
  return [...(ticket.timeline || []), entry];
}
