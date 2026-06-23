import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { EXPLORE_DEFAULT_CITY } from "@/lib/siteCopy";
import { getZonesForCity } from "@/lib/colombia";
import { EXPLORE_COMPRA_PATH, exploreZonePath } from "@/lib/explorePaths";
import { cn } from "@/lib/utils";

const POPULAR_ZONES = getZonesForCity(EXPLORE_DEFAULT_CITY).slice(0, 3);
const MORE_ZONES = getZonesForCity(EXPLORE_DEFAULT_CITY).slice(3, 8);

/**
 * Barra de búsqueda estilo Zillow / QuintoAndar: ubicación + barrios populares.
 */
export default function HomeSearchBar({ className, intent, compact = false }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const zoneUrl = (zone) => (intent === "compra" ? EXPLORE_COMPRA_PATH : exploreZonePath(zone));

  const goExplore = (q = query) => {
    const params = new URLSearchParams();
    params.set("city", EXPLORE_DEFAULT_CITY);
    if (intent === "compra") params.set("intent", "compra");
    const trimmed = q.trim();
    if (trimmed) params.set("q", trimmed);
    navigate(`/explorar?${params}`);
  };

  const inputHeight = compact ? "h-11" : "h-12";

  return (
    <div className={cn(compact ? "space-y-3.5" : "space-y-3", className)}>
      <div className={cn("flex gap-2", compact ? "items-center" : "items-stretch")}>
        <div className="relative flex-1 min-w-0">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            strokeWidth={2}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goExplore()}
            placeholder={compact ? "Barrio o dirección" : "Barrio, localidad o dirección en Bogotá"}
            className={cn(
              "w-full rounded-2xl border border-border/70 bg-white font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand-violet/25 focus:border-brand-violet/40",
              inputHeight,
              compact ? "pl-10 pr-3 text-sm shadow-sm" : "pl-11 pr-4 text-[15px] shadow-sm"
            )}
            aria-label="Buscar inmuebles en Bogotá"
          />
        </div>
        <button
          type="button"
          onClick={() => goExplore()}
          aria-label="Buscar inmuebles"
          className={cn(
            "shrink-0 inline-flex items-center justify-center rounded-2xl gradient-cta text-white font-bold hover:opacity-95 active:scale-[0.98] transition-all",
            compact ? "h-11 min-w-[4.25rem] px-3.5 text-sm shadow-sm" : "h-12 px-5 text-sm shadow-md"
          )}
        >
          {compact ? <Search className="size-4" strokeWidth={2.5} /> : "Buscar"}
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto native-scroll-x pb-0.5 -mx-0.5 px-0.5">
        {POPULAR_ZONES.map((zone) => (
          <Link key={zone} to={zoneUrl(zone)} className="native-chip shrink-0 text-xs">
            {zone}
          </Link>
        ))}
        {MORE_ZONES.length > 0 && (
          <Link
            to={intent === "compra" ? EXPLORE_COMPRA_PATH : "/explorar"}
            className="native-chip shrink-0 text-xs text-brand-violet font-bold"
          >
            Más barrios
          </Link>
        )}
      </div>
    </div>
  );
}
