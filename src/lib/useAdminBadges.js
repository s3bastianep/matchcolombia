import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { getUnreadAdminCount } from "./adminNotifications";

export function useAdminBadges() {
  const { data: inquiries = [] } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => base44.entities.Inquiry.filter({}, "-created_date", 200),
  });
  const { data: visits = [] } = useQuery({
    queryKey: ["admin-visits"],
    queryFn: () => base44.entities.Visit.filter({}, "scheduled_at", 200),
  });
  const { data: owners = [] } = useQuery({
    queryKey: ["admin-owners"],
    queryFn: () => base44.entities.Owner.filter({}, "-created_date", 100),
  });
  const { data: applications = [] } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => base44.entities.Application.filter({}, "-created_date", 100),
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: () => base44.entities.Ticket.filter({}, "-created_date", 100),
  });

  const newLeads = inquiries.filter((i) => (i.pipeline_stage || i.status) === "nuevo" || i.status === "nueva").length;
  const unanswered = inquiries.filter((i) => i.needs_reply).length;
  const pendingVisits = visits.filter((v) => v.status === "pendiente").length;
  const pendingOwners = owners.filter((o) => ["pendiente", "en_revision"].includes(o.verification_status)).length;
  const pendingApps = applications.filter((a) => ["documentos_enviados", "en_revision"].includes(a.status)).length;
  const openTickets = tickets.filter((t) => t.status !== "resuelto").length;
  const notifications = getUnreadAdminCount();

  return {
    leads: unanswered || newLeads,
    visits: pendingVisits,
    owners: pendingOwners,
    applications: pendingApps,
    tickets: openTickets,
    notifications,
  };
}
