import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { getUnreadAdminCount } from "./adminNotifications";

export function useAdminBadges() {
  const { data: inquiries = [] } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => api.entities.Inquiry.filter({}, "-created_date", 200),
  });
  const { data: visits = [] } = useQuery({
    queryKey: ["admin-visits"],
    queryFn: () => api.entities.Visit.filter({}, "scheduled_at", 200),
  });
  const { data: owners = [] } = useQuery({
    queryKey: ["admin-owners"],
    queryFn: () => api.entities.Owner.filter({}, "-created_date", 100),
  });
  const { data: applications = [] } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => api.entities.Application.filter({}, "-created_date", 100),
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: () => api.entities.Ticket.filter({}, "-created_date", 100),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });

  const newLeads = inquiries.filter((i) => (i.pipeline_stage || i.status) === "nuevo" || i.status === "nueva").length;
  const unanswered = inquiries.filter((i) => i.needs_reply).length;
  const pendingVisits = visits.filter((v) => v.status === "pendiente").length;
  const pendingOwners = owners.filter((o) => ["pendiente", "en_revision"].includes(o.verification_status)).length;
  const pendingReviewProps = properties.filter((p) => p.publication_status === "en_revision").length;
  const pendingApps = applications.filter((a) => ["documentos_enviados", "en_revision"].includes(a.status)).length;
  const openTickets = tickets.filter((t) => t.status !== "resuelto").length;
  const notifications = getUnreadAdminCount();

  return {
    leads: unanswered || newLeads,
    visits: pendingVisits,
    owners: pendingOwners,
    properties: pendingReviewProps,
    applications: pendingApps,
    tickets: openTickets,
    notifications,
  };
}
