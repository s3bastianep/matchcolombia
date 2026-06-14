import { Home, FileText, MessageSquare, Calendar, Heart } from "lucide-react";
import PanelLayout from "@/components/panels/PanelLayout";

const nav = [
  { to: "/portal", label: "Inicio", icon: Home },
  { to: "/explorar", label: "Explorar", icon: Heart },
  { to: "/portal/aplicaciones", label: "Mis procesos", icon: FileText },
  { to: "/portal/mensajes", label: "Mensajes", icon: MessageSquare },
  { to: "/portal/visitas", label: "Visitas", icon: Calendar },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
];

export default function SeekerLayout() {
  return <PanelLayout title="Mi cuenta" subtitle="Buscar arriendo o compra" navItems={nav} accent="violet" />;
}
