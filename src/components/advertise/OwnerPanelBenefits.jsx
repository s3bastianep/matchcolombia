import React from "react";
import { DollarSign, FileText, Wrench, Building2, Users, Smartphone, MessageCircleOff } from "lucide-react";
import { cn } from "@/lib/utils";

const RENT_BENEFITS = [
  { icon: DollarSign, title: "Pagos recibidos", desc: "Sabes cuándo entró el canon y el estado de cada periodo." },
  { icon: FileText, title: "Contratos activos", desc: "Fechas de inicio, fin y renovación siempre a la vista." },
  { icon: Wrench, title: "Tickets abiertos", desc: "Mantenimiento y solicitudes con seguimiento claro." },
  { icon: Building2, title: "Estado del inmueble", desc: "Disponible, en proceso o arrendado — sin llamar a nadie." },
  { icon: Users, title: "Leads e interesados", desc: "Quién preguntó, en qué etapa va y qué propiedad le interesa." },
  { icon: Smartphone, title: "Desde cualquier dispositivo", desc: "Consulta tu arriendo en tiempo real, donde estés." },
  { icon: MessageCircleOff, title: "Sin depender del WhatsApp", desc: "Resúmenes organizados, no cientos de chats sueltos." },
];

const SELL_BENEFITS = [
  { icon: Users, title: "Interesados activos", desc: "Compradores filtrados y en qué etapa va cada uno." },
  { icon: Building2, title: "Estado del inmueble", desc: "En venta, en negociación o cerrado — todo centralizado." },
  { icon: FileText, title: "Visitas y ofertas", desc: "Agenda confirmada y seguimiento hasta el cierre." },
  { icon: Wrench, title: "Tickets y trámites", desc: "Documentación y pendientes con seguimiento claro." },
  { icon: Smartphone, title: "Desde cualquier dispositivo", desc: "Tu venta visible en tiempo real, donde estés." },
  { icon: MessageCircleOff, title: "Sin depender del WhatsApp", desc: "Te informamos; tú no atiendes cada mensaje." },
];

export default function OwnerPanelBenefits({ mode = "rent", className }) {
  const items = mode === "sell" ? SELL_BENEFITS : RENT_BENEFITS;

  return (
    <div className={cn("grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4", className)}>
      {items.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="flex gap-3.5 p-4 sm:p-5 rounded-2xl bg-[hsl(0,0%,98%)] border border-border/40"
        >
          <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-sm sm:text-base">{title}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
