import { LayoutDashboard, Building2, Users, Calendar, UserCheck, BarChart3 } from "lucide-react";
import PanelLayout from "@/components/panels/PanelLayout";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/propiedades", label: "Propiedades", icon: Building2 },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/visitas", label: "Visitas", icon: Calendar },
  { to: "/admin/inquilinos", label: "Inquilinos", icon: UserCheck },
  { to: "/admin/reportes", label: "Reportes", icon: BarChart3 },
];

export default function AdminLayout() {
  return <PanelLayout title="Admin" subtitle="MatchColombia" navItems={nav} accent="purple" />;
}
