import { Home, Building2, Users, Wrench, TrendingUp, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { ticketNeedsOwnerAction } from "@/lib/ticketUtils";
import { isStaffSender, isSupportThread } from "@/lib/supportChat";
import PanelLayout from "@/components/panels/PanelLayout";

function useOwnerNavBadges() {
  const { user } = useAuth();
  const { data: tickets = [] } = useQuery({
    queryKey: ["owner-nav-tickets"],
    queryFn: () => api.entities.Ticket.filter({}, "-created_date", 200),
  });
  const { data: messages = [] } = useQuery({
    queryKey: ["support-messages", user?.id],
    queryFn: () => api.entities.Message.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const pendingTickets = tickets.filter(ticketNeedsOwnerAction).length;
  const unreadChat = messages.filter(
    (m) => isSupportThread(m) && isStaffSender(m.sender_role) && !m.read
  ).length;

  return { tickets: pendingTickets, messages: unreadChat };
}

export default function OwnerLayout() {
  const badges = useOwnerNavBadges();

  const nav = [
    { to: "/propietario", label: "Dashboard", icon: Home },
    { to: "/propietario/rentabilidad", label: "Rentabilidad", icon: TrendingUp },
    { to: "/propietario/propiedades", label: "Propiedades", icon: Building2 },
    { to: "/propietario/leads", label: "Leads", icon: Users },
    {
      to: "/propietario/tickets",
      label: "Mantenimiento",
      icon: Wrench,
      badge: badges.tickets,
      badgeTone: "amber",
    },
    {
      to: "/propietario/mensajes",
      label: "Chat",
      icon: MessageSquare,
      badge: badges.messages,
      badgeTone: "amber",
    },
  ];

  return <PanelLayout title="Propietario" subtitle="Tu activo en tiempo real" navItems={nav} accent="magenta" />;
}
