import { Home, Building2, Users, Wrench } from "lucide-react";
import PanelLayout from "@/components/panels/PanelLayout";

const nav = [
  { to: "/propietario", label: "Dashboard", icon: Home },
  { to: "/propietario/propiedades", label: "Propiedades", icon: Building2 },
  { to: "/propietario/leads", label: "Leads", icon: Users },
  { to: "/propietario/tickets", label: "Mantenimiento", icon: Wrench },
];

export default function OwnerLayout() {
  return <PanelLayout title="Propietario" subtitle="Tu activo en tiempo real" navItems={nav} accent="orange" />;
}
