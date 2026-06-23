import React from "react";
import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPropertyPricing } from "@/lib/propertyPricing";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function PropertyPriceBreakdown({ property, compact = false, className }) {
  const { rent, admin, totalMonthly, isSale, salePrice } = getPropertyPricing(property);
  if (!property) return null;

  if (isSale) {
    return (
      <div className={cn("rounded-xl border border-border/50 bg-secondary/20 p-4", className)}>
        <p className="text-2xl font-extrabold tabular-nums">{formatCOP(salePrice)}</p>
        <p className="text-xs text-muted-foreground mt-1">Precio de venta</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn("text-sm space-y-1", className)}>
        <p className="font-extrabold tabular-nums text-lg">
          {formatCOP(totalMonthly)}
          <span className="text-sm font-medium text-muted-foreground">/mes</span>
        </p>
        {admin > 0 && (
          <p className="text-[11px] text-muted-foreground">
            Arriendo {formatCOP(rent)} + admin {formatCOP(admin)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-[hsl(var(--brand-violet)/0.14)] overflow-hidden", className)}>
      <div className="px-4 py-3 flex items-center gap-2 border-b border-[hsl(var(--brand-violet)/0.1)] bg-[hsl(var(--brand-violet)/0.04)]">
        <Receipt className="w-4 h-4 text-brand-violet" strokeWidth={2} />
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-violet">Costos transparentes</p>
      </div>
      <div className="px-4 py-4 space-y-2 bg-white/80">
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Arriendo (canon)</span>
          <span className="font-semibold tabular-nums">{formatCOP(rent)}</span>
        </div>
        {admin > 0 && (
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Administración</span>
            <span className="font-semibold tabular-nums">{formatCOP(admin)}</span>
          </div>
        )}
        <div className="flex justify-between gap-3 pt-2 border-t border-border/40">
          <span className="font-bold text-foreground">Total mensual</span>
          <span className="text-xl font-extrabold tabular-nums">{formatCOP(totalMonthly)}</span>
        </div>
      </div>
    </div>
  );
}
