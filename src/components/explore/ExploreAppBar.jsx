import React from "react";
import { Search, SlidersHorizontal, Map, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { CITIES, getZonesForCity } from "@/lib/colombia";
import { EXPLORE_DEFAULT_CITY, listingsCountLabel } from "@/lib/siteCopy";

const QUICK_TYPES = [
  { key: "apartamento", label: "Apartamento" },
  { key: "casa", label: "Casa" },
  { key: "estudio", label: "Estudio" },
  { key: "pets", label: "Mascotas" },
  { key: "parking", label: "Parqueadero" },
];

const POPULAR_ZONES = getZonesForCity(EXPLORE_DEFAULT_CITY).slice(0, 4);

export default function ExploreAppBar({
  locality,
  onLocalityChange,
  onSearch,
  initialCity,
  onCityChange,
  onOpenFilters,
  filterCount,
  viewMode,
  onToggleView,
  activeQuick = [],
  onToggleQuick,
  resultsCount,
  onZoneSelect,
}) {
  return (
    <header className="lg:hidden shrink-0 native-header px-4 pt-safe pb-3 space-y-3">
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Explorar</h1>
          {typeof resultsCount === "number" && (
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="font-bold text-foreground tabular-nums">{resultsCount}</span>{" "}
              {listingsCountLabel(resultsCount)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleView}
          className={cn("native-icon-btn", viewMode === "map" && "bg-brand-violet/10 text-brand-violet")}
          aria-label={viewMode === "map" ? "Ver lista" : "Ver mapa"}
        >
          {viewMode === "map" ? <LayoutList className="w-5 h-5" /> : <Map className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={locality}
          onChange={(e) => onLocalityChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Barrio, localidad o ciudad"
          className="native-search-input w-full h-12 pl-11 pr-4"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto native-scroll-x pb-0.5">
        {POPULAR_ZONES.map((zone) => (
          <button
            key={zone}
            type="button"
            onClick={() => onZoneSelect?.(zone)}
            className={cn("native-chip shrink-0", locality === zone && "native-chip-active")}
          >
            {zone}
          </button>
        ))}
        {CITIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onCityChange(initialCity === c.name ? "" : c.name)}
            className={cn("native-chip shrink-0", initialCity === c.name && "native-chip-active")}
          >
            {c.name}
          </button>
        ))}
        {QUICK_TYPES.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onToggleQuick?.(f.key)}
            className={cn("native-chip shrink-0", activeQuick.includes(f.key) && "native-chip-active")}
          >
            {f.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onOpenFilters}
          className={cn(
            "native-chip shrink-0 flex items-center gap-1.5",
            filterCount > 0 && "native-chip-active"
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Más filtros
          {filterCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-brand-violet text-white text-[10px] font-bold flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
