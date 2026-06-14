import React from "react";
import { Link } from "react-router-dom";
import {
  Building2, DollarSign, FileText, Wrench, ArrowRight,
  LayoutDashboard, Home, Users, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

const CONFIG = {
  rent: {
    subtitle: "Todo tu arriendo en un solo lugar",
    footer: "Así ves pagos, contratos, tickets y el estado de cada inmueble — sin depender del WhatsApp.",
    kpis: [
      { label: "Pagos recibidos", value: formatCOP(3120000), hint: "Jun 2026 · pagado", icon: DollarSign, tone: "violet" },
      { label: "Contratos activos", value: "1", hint: "Vigente hasta jun 2026", icon: FileText, tone: "magenta" },
      { label: "Tickets abiertos", value: "2", hint: "1 en proceso", icon: Wrench, tone: "violet" },
      { label: "Estado del inmueble", value: "Arrendado", hint: "Apartamento Chapinero", icon: Building2, tone: "magenta" },
    ],
    properties: [
      { title: "Apartamento Quinta Camacho", zone: "Chapinero, Bogotá", status: "Arrendado", price: 2800000, priceLabel: "/mes", leads: 4 },
      { title: "Apartamento Riomar", zone: "Barranquilla", status: "Disponible", price: 1950000, priceLabel: "/mes", leads: 2 },
    ],
    rentedStatus: "Arrendado",
  },
  sell: {
    subtitle: "Todo tu proceso de venta en un solo lugar",
    footer: "Así ves interesados, visitas, ofertas y el estado de cada inmueble — sin depender del WhatsApp.",
    kpis: [
      { label: "Interesados activos", value: "8", hint: "3 con visita agendada", icon: Users, tone: "violet" },
      { label: "Visitas esta semana", value: "3", hint: "2 confirmadas", icon: Calendar, tone: "magenta" },
      { label: "Tickets abiertos", value: "1", hint: "Documentación", icon: Wrench, tone: "violet" },
      { label: "Estado del inmueble", value: "En venta", hint: "Casa en Riomar", icon: Building2, tone: "magenta" },
    ],
    properties: [
      { title: "Casa en Riomar", zone: "Barranquilla", status: "En venta", price: 520000000, priceLabel: "", leads: 8 },
      { title: "Apartamento Quinta Camacho", zone: "Chapinero, Bogotá", status: "En negociación", price: 380000000, priceLabel: "", leads: 5 },
    ],
    rentedStatus: "En negociación",
  },
};

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Propiedades", icon: Home },
  { label: "Leads", icon: Users },
  { label: "Mantenimiento", icon: Wrench },
];

function KpiCard({ label, value, hint, icon: Icon, tone }) {
  return (
    <div className="bg-white rounded-xl border border-border/40 p-3 sm:p-4 shadow-sm min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground truncate">{label}</p>
          <p className="text-base sm:text-lg font-extrabold mt-0.5 tracking-tight truncate">{value}</p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 truncate">{hint}</p>
        </div>
        <div
          className={cn(
            "w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0",
            tone === "magenta" ? "bg-brand-magenta/10" : "bg-brand-violet/10"
          )}
        >
          <Icon className={cn("w-4 h-4", tone === "magenta" ? "text-brand-magenta" : "text-brand-violet")} />
        </div>
      </div>
    </div>
  );
}

export default function OwnerDashboardPreview({ className, mode = "rent" }) {
  const cfg = CONFIG[mode] || CONFIG.rent;

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-2xl border border-border/50 bg-[hsl(0,0%,97%)] shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden">
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border-b border-border/40">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex-1 mx-2 sm:mx-4 h-6 rounded-md bg-secondary/80 flex items-center px-3">
            <span className="text-[10px] text-muted-foreground font-mono truncate">matchcolombia.co/propietario</span>
          </div>
          <span className="hidden sm:inline text-[10px] font-bold text-brand-violet uppercase tracking-wider">Demo</span>
        </div>

        <div className="flex flex-col md:flex-row min-h-0">
          <aside className="hidden sm:flex md:w-44 lg:w-48 shrink-0 flex-col border-r border-border/30 bg-white p-3 gap-0.5">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-2">Propietario</p>
            {NAV.map(({ label, icon: Icon, active }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold",
                  active ? "bg-brand-violet/10 text-brand-violet" : "text-foreground/60"
                )}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </div>
            ))}
          </aside>

          <div className="flex-1 p-3 sm:p-4 lg:p-5 min-w-0 bg-[hsl(0,0%,98%)]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">Panel propietario</h3>
                <p className="text-[11px] text-muted-foreground">{cfg.subtitle}</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-magenta/10 text-brand-magenta border border-brand-magenta/20">
                En vivo
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {cfg.kpis.map((k) => (
                <KpiCard key={k.label} {...k} />
              ))}
            </div>

            <div className="mt-3 sm:mt-4 bg-white rounded-xl border border-border/40 overflow-hidden">
              <div className="px-3 sm:px-4 py-2.5 border-b border-border/30 flex items-center justify-between gap-2">
                <p className="text-xs font-extrabold">Mis propiedades</p>
                <span className="text-[10px] text-muted-foreground">Actualizado hoy</span>
              </div>
              <div className="divide-y divide-border/20">
                {cfg.properties.map((p) => (
                  <div key={p.title} className="px-3 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold truncate">{p.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {p.zone} · {formatCOP(p.price)}{p.priceLabel}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-muted-foreground">{p.leads} leads</span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                          p.status === cfg.rentedStatus
                            ? "bg-brand-violet/10 text-brand-violet border-brand-violet/25"
                            : "bg-brand-magenta/10 text-brand-magenta border-brand-magenta/25"
                        )}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
        {cfg.footer}
      </p>
      <div className="flex justify-center mt-3">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-violet hover:text-brand-magenta transition-colors"
        >
          Ver panel en {BRAND.name}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
