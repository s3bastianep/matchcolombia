import { Home, Building2, Users, Wrench, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { ticketNeedsOwnerAction } from "@/lib/ticketUtils";
import PanelLayout from "@/components/panels/PanelLayout";

function useOwnerNavBadges() {
  const { data: tickets = [] } = useQuery({
    queryKey: ["owner-nav-tickets"],
    queryFn: () => api.entities.Ticket.filter({}, "-created_date", 200),
  });
  const pending = tickets.filter(ticketNeedsOwnerAction).length;
  return { tickets: pending };
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
  ];

  return <PanelLayout title="Propietario" subtitle="Tu activo en tiempo real" navItems={nav} accent="magenta" />;
}
