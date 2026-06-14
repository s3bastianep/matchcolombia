import { LEAD_PIPELINE } from "./adminConstants";

const DAY = 86400000;

export function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isToday(iso) {
  if (!iso) return false;
  return startOfDay(new Date(iso)).getTime() === startOfDay().getTime();
}

export function isThisWeek(iso) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  const weekStart = startOfDay(now);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return d >= weekStart && d < weekEnd;
}

export function daysSince(iso) {
  if (!iso) return Infinity;
  return Math.floor((Date.now() - new Date(iso).getTime()) / DAY);
}

export function computeDashboardMetrics({ properties, inquiries, visits, messages, leases, payments, tickets, owners }) {
  const activeProps = properties.filter((p) => (p.publication_status || p.status) === "publicada" || p.status === "disponible");
  const newLeads = inquiries.filter((i) => (i.pipeline_stage || i.status) === "nuevo" || i.status === "nueva");
  const unansweredLeads = inquiries.filter((i) => i.needs_reply || (i.pipeline_stage === "nuevo" && !i.last_reply_at));
  const visitsToday = visits.filter((v) => isToday(v.scheduled_at));
  const visitsWeek = visits.filter((v) => isThisWeek(v.scheduled_at));
  const staleProperties = properties.filter((p) => {
    const propInquiries = inquiries.filter((i) => i.property_id === p.id);
    const lastActivity = propInquiries[0]?.created_date || p.updated_date || p.created_date;
    return daysSince(lastActivity) > 14 && (p.publication_status === "publicada" || p.status === "disponible");
  });

  const closedLeads = inquiries.filter((i) => ["cerrado", "aprobado"].includes(i.pipeline_stage));
  const withVisits = inquiries.filter((i) => ["visita_agendada", "visitado", "aplicacion_enviada", "revision_documentos", "aprobado", "cerrado"].includes(i.pipeline_stage));
  const conversionLeadsToVisits = inquiries.length ? Math.round((withVisits.length / inquiries.length) * 100) : 0;
  const conversionToClose = inquiries.length ? Math.round((closedLeads.length / inquiries.length) * 100) : 0;

  const rented = properties.filter((p) => p.publication_status === "arrendada" || p.status === "arrendado");
  const avgDaysToRent = rented.length
    ? Math.round(
        rented.reduce((sum, p) => sum + Math.min(daysSince(p.created_date), 90), 0) / rented.length
      )
    : null;

  const projectedIncome = leases
    .filter((l) => l.status === "activo")
    .reduce((sum, l) => sum + (l.monthly_rent || 0) * 0.1, 0);

  const overduePayments = payments.filter((p) => p.status === "atrasado" || (p.status === "pendiente" && new Date(p.due_date) < new Date()));
  const contractsRenewing = leases.filter((l) => {
    if (!l.end_date) return false;
    const days = Math.ceil((new Date(l.end_date) - Date.now()) / DAY);
    return days > 0 && days <= 60;
  });

  const pendingVerifications = owners.filter((o) => o.verification_status === "pendiente" || o.verification_status === "en_revision");
  const unreadMessages = messages.filter((m) => m.sender_role === "user" && !m.read);

  return {
    activeProps: activeProps.length,
    newLeads: newLeads.length,
    unansweredLeads: unansweredLeads.length,
    visitsToday: visitsToday.length,
    visitsWeek: visitsWeek.length,
    staleProperties,
    conversionLeadsToVisits,
    conversionToClose,
    avgDaysToRent,
    projectedIncome,
    overduePayments: overduePayments.length,
    contractsRenewing,
    pendingVerifications: pendingVerifications.length,
    openTickets: tickets.filter((t) => t.status !== "resuelto").length,
    unreadMessages: unreadMessages.length,
  };
}

export function computeReportMetrics({ properties, inquiries, leases, payments }) {
  const byWorkflow = PROPERTY_WORKFLOW_COUNTS(properties);
  const pipeline = LEAD_PIPELINE.map((stage) => ({
    ...stage,
    count: inquiries.filter((i) => i.pipeline_stage === stage.key).length,
  }));
  const stagnant = properties
    .filter((p) => {
      const leads = inquiries.filter((i) => i.property_id === p.id).length;
      return (p.publication_status === "publicada" || p.status === "disponible") && leads === 0 && daysSince(p.created_date) > 7;
    })
    .map((p) => ({ id: p.id, title: p.title, days: daysSince(p.created_date) }));

  const realIncome = payments.filter((p) => p.status === "pagado").reduce((s, p) => s + (p.amount || 0) * 0.1, 0);
  const projected = leases.filter((l) => l.status === "activo").reduce((s, l) => s + (l.monthly_rent || 0) * 0.1, 0);

  return { byWorkflow, pipeline, stagnant, realIncome, projected };
}

const PROPERTY_WORKFLOW_COUNTS = (properties) => {
  const keys = ["borrador", "en_revision", "publicada", "en_proceso", "arrendada", "archivada"];
  return keys.map((key) => ({
    key,
    count: properties.filter((p) => (p.publication_status || p.status) === key || (key === "publicada" && p.status === "disponible")).length,
  }));
};

