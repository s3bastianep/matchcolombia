import { Home, FileText, CreditCard, Wrench, MessageSquare } from "lucide-react";
import PanelLayout from "@/components/panels/PanelLayout";

const nav = [
  { to: "/inquilino", label: "Inicio", icon: Home },
  { to: "/inquilino/contrato", label: "Contrato", icon: FileText },
  { to: "/inquilino/pagos", label: "Pagos", icon: CreditCard },
  { to: "/inquilino/tickets", label: "Soporte", icon: Wrench },
  { to: "/inquilino/mensajes", label: "Chat", icon: MessageSquare },
];

export default function TenantLayout() {
  return <PanelLayout title="Mi arriendo" subtitle="Inquilino activo" navItems={nav} accent="violet" />;
}
