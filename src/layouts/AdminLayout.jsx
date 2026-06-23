import {
  LayoutDashboard, Building2, Users, Calendar, UserCheck, BarChart3,
  Shield, FileText, Settings, Bell, MessageSquare,
} from "lucide-react";
import PanelLayout from "@/components/panels/PanelLayout";
import { useAdminBadges } from "@/lib/useAdminBadges";
import { BRAND } from "@/lib/brand";

export default function AdminLayout() {
  const badges = useAdminBadges();

  const nav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/propiedades", label: "Propiedades", icon: Building2, badge: badges.properties, badgeTone: "amber" },
    { to: "/admin/propietarios", label: "Propietarios", icon: Shield, badge: badges.owners, badgeTone: "amber" },
    { to: "/admin/leads", label: "Leads", icon: Users, badge: badges.leads },
    { to: "/admin/mensajes", label: "Chats", icon: MessageSquare, badge: badges.messages, badgeTone: "amber" },
    { to: "/admin/visitas", label: "Visitas", icon: Calendar, badge: badges.visits, badgeTone: "amber" },
    { to: "/admin/aplicaciones", label: "Aplicaciones", icon: FileText, badge: badges.applications },
    { to: "/admin/inquilinos", label: "Inquilinos", icon: UserCheck, badge: badges.tickets },
    { to: "/admin/reportes", label: "Reportes", icon: BarChart3 },
    { to: "/admin/configuracion", label: "Configuración", icon: Settings },
    { to: "/admin/notificaciones", label: "Notificaciones", icon: Bell, badge: badges.notifications },
  ];

  return <PanelLayout title="Admin" subtitle={BRAND.name} navItems={nav} accent="purple" />;
}
