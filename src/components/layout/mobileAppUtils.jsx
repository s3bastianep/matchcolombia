import React from "react";
import { useLocation } from "react-router-dom";
import { usePropertyPanel } from "@/lib/PropertyPanelContext";

const STEPS = [
  { path: "/publicar/nuevo", labels: ["Básico", "Detalles", "Precio", "Fotos"] },
];

export function MobileFormProgress({ step, total, labels }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-border/50 px-4 py-3">
      <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-2">
        <span>Paso {step + 1} de {total}</span>
        <span className="text-brand-violet">{labels[step]}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full gradient-cta transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function useHideAppChrome() {
  const { isOpen: propertyOpen } = usePropertyPanel();
  const { pathname } = useLocation();
  const isForm = pathname === "/publicar/nuevo";
  return propertyOpen || isForm;
}
