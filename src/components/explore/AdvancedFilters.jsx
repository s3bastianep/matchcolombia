import React from "react";
import { Bed, Bath, Car, Building2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  PARKING_OPTIONS,
  ESTRATO_OPTIONS,
  countAdvancedFilters,
} from "@/lib/propertyFilters";

function FilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-w-[2.75rem] px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all",
        active
          ? "border-[hsl(265,75%,58%)]/40 bg-[hsl(265,75%,58%)]/10 text-[hsl(265,75%,45%)]"
          : "border-border/60 bg-white text-foreground/80 hover:border-foreground/20 hover:bg-secondary/40"
      )}
    >
      {label}
    </button>
  );
}

function FilterSection({ icon: Icon, title, options, value, onChange, formatLabel }) {
  return (
    <div className="py-4 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={2} />
        <h3 className="font-bold text-sm text-foreground">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const optValue = typeof opt === "string" ? opt : opt.value;
          const optLabel = formatLabel ? formatLabel(opt) : (typeof opt === "string" ? (opt === "5" ? "5+" : opt) : opt.label);
          const active = value === optValue;
          return (
            <FilterPill
              key={optValue}
              label={optLabel}
              active={active}
              onClick={() => onChange(active ? "" : optValue)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function AdvancedFilters({ filters, onChange, onClear, className }) {
  const activeCount = countAdvancedFilters(filters);
  const set = (key) => (val) => onChange({ ...filters, [key]: val });

  return (
    <div className={cn("bg-white rounded-[1.25rem] border border-border/30 p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)]", className)}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-extrabold text-base text-foreground">Más filtros</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Refina por habitaciones, baños y más</p>
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      <FilterSection
        icon={Bed}
        title="Habitaciones"
        options={BEDROOM_OPTIONS}
        value={filters.bedrooms}
        onChange={set("bedrooms")}
        formatLabel={(v) => (v === "5" ? "5+" : v)}
      />
      <FilterSection
        icon={Bath}
        title="Baños"
        options={BATHROOM_OPTIONS}
        value={filters.bathrooms}
        onChange={set("bathrooms")}
        formatLabel={(v) => (v === "5" ? "5+" : v)}
      />
      <FilterSection
        icon={Car}
        title="Parqueaderos"
        options={PARKING_OPTIONS}
        value={filters.parkingSpots}
        onChange={set("parkingSpots")}
        formatLabel={(v) => (v === "5" ? "5+" : v)}
      />
      <FilterSection
        icon={Building2}
        title="Estrato"
        options={ESTRATO_OPTIONS}
        value={filters.estrato}
        onChange={set("estrato")}
      />
    </div>
  );
}
