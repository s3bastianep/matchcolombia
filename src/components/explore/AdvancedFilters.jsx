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
        "min-w-[3rem] px-4 py-2.5 rounded-full border text-sm font-semibold transition-all",
        active
          ? "border-foreground bg-foreground text-white shadow-sm"
          : "border-border/80 bg-white text-foreground hover:border-foreground/25 hover:bg-secondary/50"
      )}
    >
      {label}
    </button>
  );
}

function FilterSection({ icon: Icon, title, options, value, onChange, formatLabel }) {
  return (
    <div className="py-5 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2.5 mb-4">
        <Icon className="w-5 h-5 text-foreground/80 shrink-0" strokeWidth={1.75} />
        <h3 className="font-extrabold text-base text-foreground">{title}</h3>
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
    <div className={cn("bg-[hsl(240,25%,96%)] rounded-2xl border border-border/40 p-5 sm:p-6", className)}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-extrabold text-lg text-foreground">Más filtros</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Limpiar ({activeCount})
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
