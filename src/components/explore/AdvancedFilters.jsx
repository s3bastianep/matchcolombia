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

const NUMERIC_ESTRATO = ESTRATO_OPTIONS.filter((o) => !["comercial", "rural"].includes(o.value));
const TEXT_ESTRATO = ESTRATO_OPTIONS.filter((o) => ["comercial", "rural"].includes(o.value));

function FilterCircle({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "w-11 h-11 rounded-full border text-sm font-semibold flex items-center justify-center transition-all duration-200",
        active
          ? "bg-foreground border-foreground text-white shadow-[0_2px_8px_rgba(15,23,42,0.18)] scale-[1.02]"
          : "bg-white border-[hsl(0,0%,88%)] text-foreground hover:border-foreground/25 hover:shadow-sm"
      )}
    >
      {label}
    </button>
  );
}

function FilterTextPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-11 px-5 rounded-full border text-sm font-semibold transition-all duration-200 whitespace-nowrap",
        active
          ? "bg-foreground border-foreground text-white shadow-[0_2px_8px_rgba(15,23,42,0.18)]"
          : "bg-white border-[hsl(0,0%,88%)] text-foreground hover:border-foreground/25 hover:shadow-sm"
      )}
    >
      {label}
    </button>
  );
}

function FilterSection({ icon: Icon, title, children }) {
  return (
    <div className="py-5 border-b border-[hsl(0,0%,90%)] last:border-0">
      <div className="flex items-center gap-2.5 mb-4">
        <Icon className="w-5 h-5 text-foreground/75 shrink-0" strokeWidth={1.75} />
        <h3 className="font-bold text-[15px] text-foreground tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function NumericFilterRow({ options, value, onChange, formatLabel }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const optValue = typeof opt === "string" ? opt : opt.value;
        const optLabel = formatLabel ? formatLabel(opt) : typeof opt === "string" ? (opt === "5" ? "5+" : opt) : opt.label;
        const active = value === optValue;
        return (
          <FilterCircle
            key={optValue}
            label={optLabel}
            active={active}
            onClick={() => onChange(active ? "" : optValue)}
          />
        );
      })}
    </div>
  );
}

export default function AdvancedFilters({ filters, onChange, onClear, className }) {
  const activeCount = countAdvancedFilters(filters);
  const set = (key) => (val) => onChange({ ...filters, [key]: val });

  return (
    <div
      className={cn(
        "rounded-2xl bg-[hsl(0,0%,96%)] px-5 py-6 sm:px-6",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-extrabold text-xl text-foreground tracking-tight">Más filtros</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar
          </button>
        )}
      </div>

      <FilterSection icon={Bed} title="Habitaciones">
        <NumericFilterRow
          options={BEDROOM_OPTIONS}
          value={filters.bedrooms}
          onChange={set("bedrooms")}
          formatLabel={(v) => (v === "5" ? "5+" : v)}
        />
      </FilterSection>

      <FilterSection icon={Bath} title="Baños">
        <NumericFilterRow
          options={BATHROOM_OPTIONS}
          value={filters.bathrooms}
          onChange={set("bathrooms")}
          formatLabel={(v) => (v === "5" ? "5+" : v)}
        />
      </FilterSection>

      <FilterSection icon={Car} title="Parqueaderos">
        <NumericFilterRow
          options={PARKING_OPTIONS}
          value={filters.parkingSpots}
          onChange={set("parkingSpots")}
          formatLabel={(v) => (v === "5" ? "5+" : v)}
        />
      </FilterSection>

      <FilterSection icon={Building2} title="Estrato">
        <div className="flex flex-wrap gap-2.5">
          {NUMERIC_ESTRATO.map((opt) => {
            const active = filters.estrato === opt.value;
            return (
              <FilterCircle
                key={opt.value}
                label={opt.label}
                active={active}
                onClick={() => set("estrato")(active ? "" : opt.value)}
              />
            );
          })}
          {TEXT_ESTRATO.map((opt) => {
            const active = filters.estrato === opt.value;
            return (
              <FilterTextPill
                key={opt.value}
                label={opt.label}
                active={active}
                onClick={() => set("estrato")(active ? "" : opt.value)}
              />
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
}
