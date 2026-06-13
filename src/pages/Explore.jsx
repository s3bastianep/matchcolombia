import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PropertyCard from "../components/property/PropertyCard";
import AdvancedFilters from "../components/explore/AdvancedFilters";
import ExploreMap from "../components/explore/ExploreMap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Sparkles, Search, Map, Check, ArrowUpDown, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadPreferences, scoreProperty } from "@/lib/matchPreferences";
import { CITIES } from "@/lib/colombia";
import {
  DEFAULT_ADVANCED_FILTERS,
  parseAdvancedFiltersFromUrl,
  applyAdvancedFilters,
  countAdvancedFilters,
} from "@/lib/propertyFilters";

const TYPES_LABEL = {
  apartamento: "Apartamento",
  casa: "Casa",
  estudio: "Estudio",
  habitacion: "Habitación",
};

const SORT_LABELS = {
  match: "Mejor match",
  newest: "Más recientes",
  price_asc: "Menor precio",
  price_desc: "Mayor precio",
  area: "Mayor área",
};

const QUICK_FILTERS = [
  { key: "apartamento", label: "Apartamento", color: "border-[hsl(340,82%,52%)]/35 text-[hsl(340,82%,45%)] bg-[hsl(340,82%,52%)]/10" },
  { key: "casa", label: "Casa", color: "border-[hsl(168,72%,40%)]/35 text-[hsl(168,72%,35%)] bg-[hsl(168,72%,40%)]/10" },
  { key: "estudio", label: "Estudio", color: "border-[hsl(265,75%,58%)]/35 text-[hsl(265,75%,50%)] bg-[hsl(265,75%,58%)]/10" },
  { key: "pets", label: "Mascotas 🐾", color: "border-[hsl(32,95%,54%)]/35 text-[hsl(32,95%,40%)] bg-[hsl(32,95%,54%)]/10" },
  { key: "parking", label: "Parqueadero", color: "border-[hsl(200,90%,50%)]/35 text-[hsl(200,90%,40%)] bg-[hsl(200,90%,50%)]/10" },
];

function ExploreSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="aspect-[5/4] rounded-lg shimmer" />
      <div className="pt-3 space-y-2">
        <div className="h-4 w-2/3 rounded shimmer" />
        <div className="h-3 w-1/2 rounded shimmer" />
        <div className="h-3 w-3/4 rounded shimmer" />
      </div>
    </div>
  );
}

function ActiveFilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-white border border-[hsl(340,82%,52%)]/25 text-[11px] font-semibold text-[hsl(340,82%,42%)]">
      {label}
      <button type="button" onClick={onRemove} className="p-0.5 rounded-full hover:bg-[hsl(340,82%,52%)]/10">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function syncFiltersToUrl(params, advancedFilters, extra = {}) {
  const next = new URLSearchParams(params);
  const setOrDelete = (key, val) => {
    if (val) next.set(key, val);
    else next.delete(key);
  };
  setOrDelete("beds", advancedFilters.bedrooms);
  setOrDelete("baths", advancedFilters.bathrooms);
  setOrDelete("spots", advancedFilters.parkingSpots);
  setOrDelete("estrato", advancedFilters.estrato);
  Object.entries(extra).forEach(([k, v]) => setOrDelete(k, v));
  return next;
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialCity = searchParams.get("city") || "";
  const initialType = searchParams.get("type") || "";
  const initialMax = searchParams.get("max") || "";
  const isMatched = searchParams.get("matched") === "1";
  const intent = searchParams.get("intent");
  const prefs = loadPreferences();

  const [sortBy, setSortBy] = useState(isMatched ? "match" : "newest");
  const [activeQuick, setActiveQuick] = useState([]);
  const [priceMax, setPriceMax] = useState(initialMax ? parseInt(initialMax) : (prefs?.maxPrice || 10000000));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("split");
  const [highlightedId, setHighlightedId] = useState(null);
  const [locality, setLocality] = useState(initialQ);

  const applyLocalitySearch = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    if (locality.trim()) next.set("q", locality.trim());
    else next.delete("q");
    setSearchParams(next, { replace: true });
  }, [locality, searchParams, setSearchParams]);

  useEffect(() => {
    setLocality(initialQ);
  }, [initialQ]);

  const advancedFilters = useMemo(
    () => parseAdvancedFiltersFromUrl(searchParams),
    [searchParams]
  );

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties-all"],
    queryFn: () => base44.entities.Property.filter({ status: "disponible" }, "-created_date", 100),
  });

  const updateAdvancedFilters = useCallback((next) => {
    setSearchParams(syncFiltersToUrl(searchParams, next), { replace: true });
  }, [searchParams, setSearchParams]);

  const clearAdvancedFilters = useCallback(() => {
    setSearchParams(syncFiltersToUrl(searchParams, DEFAULT_ADVANCED_FILTERS), { replace: true });
  }, [searchParams, setSearchParams]);

  const clearAllFilters = useCallback(() => {
    setActiveQuick([]);
    clearAdvancedFilters();
  }, [clearAdvancedFilters]);

  const filtered = useMemo(() => {
    let result = properties.map((p) => ({
      ...p,
      matchScore: scoreProperty(p, prefs),
    }));

    if (initialCity) {
      const c = initialCity.toLowerCase();
      result = result.filter((p) => p.city?.toLowerCase() === c);
    }

    if (initialQ) {
      const q = initialQ.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.neighborhood?.toLowerCase().includes(q) ||
          p.locality?.toLowerCase().includes(q)
      );
    }

    if (initialType) result = result.filter((p) => p.property_type === initialType);

    result = applyAdvancedFilters(result, advancedFilters);

    if (activeQuick.includes("apartamento")) result = result.filter((p) => p.property_type === "apartamento");
    if (activeQuick.includes("casa")) result = result.filter((p) => p.property_type === "casa");
    if (activeQuick.includes("estudio")) result = result.filter((p) => p.property_type === "estudio");
    if (activeQuick.includes("pets")) result = result.filter((p) => p.pets_allowed);
    if (activeQuick.includes("parking")) result = result.filter((p) => p.parking);

    result = result.filter((p) => (p.monthly_rent || 0) <= priceMax);

    if (isMatched && prefs) {
      result = result.filter((p) => p.matchScore >= 40);
    }

    if (sortBy === "match") result.sort((a, b) => b.matchScore - a.matchScore);
    else if (sortBy === "price_asc") result.sort((a, b) => (a.monthly_rent || 0) - (b.monthly_rent || 0));
    else if (sortBy === "price_desc") result.sort((a, b) => (b.monthly_rent || 0) - (a.monthly_rent || 0));
    else if (sortBy === "area") result.sort((a, b) => (b.area_sqm || 0) - (a.area_sqm || 0));

    return result;
  }, [properties, initialQ, initialCity, initialType, advancedFilters, activeQuick, priceMax, sortBy, isMatched, prefs]);

  const cityLabel = initialCity || prefs?.city || "Bogotá";
  const advancedCount = countAdvancedFilters(advancedFilters);
  const totalFilterCount = advancedCount + activeQuick.length;
  const resultsTitle =
    intent === "compra"
      ? `Inmuebles en venta en ${cityLabel}`
      : `Apartamentos en arriendo en ${cityLabel}`;

  const removeQuickFilter = (key) => setActiveQuick((prev) => prev.filter((k) => k !== key));

  const setCityFilter = useCallback((city) => {
    const next = new URLSearchParams(searchParams);
    if (city) next.set("city", city);
    else next.delete("city");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const sortSelect = (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="h-10 min-w-[8.5rem] bg-white border border-[hsl(0,0%,88%)] text-xs font-bold rounded-full gap-1.5 px-3.5 shadow-sm">
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <SelectValue placeholder="Ordenar" />
      </SelectTrigger>
      <SelectContent>
        {isMatched && <SelectItem value="match">Mejor match</SelectItem>}
        <SelectItem value="newest">Más recientes</SelectItem>
        <SelectItem value="price_asc">Menor precio</SelectItem>
        <SelectItem value="price_desc">Mayor precio</SelectItem>
        <SelectItem value="area">Mayor área</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-[hsl(0,0%,90%)] sticky top-[62px] z-30">
        {isMatched && prefs && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 lg:mx-6 mt-3 p-3 rounded-xl bg-gradient-to-r from-[hsl(265,75%,58%)]/8 to-[hsl(340,82%,52%)]/6 border border-[hsl(265,75%,58%)]/15 flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4 text-[hsl(265,75%,50%)] shrink-0" />
            <p className="text-xs font-bold text-foreground min-w-0 truncate">
              Matches en {cityLabel}
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
              className="ml-auto text-[11px] font-bold text-[hsl(265,75%,50%)] hover:underline shrink-0"
            >
              Editar
            </button>
          </motion.div>
        )}

        <div className="px-4 lg:px-6 py-3 flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px] max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyLocalitySearch()}
              onBlur={applyLocalitySearch}
              placeholder="Buscar por localidad o barrio"
              aria-label="Buscar por localidad"
              className="w-full h-11 pl-11 pr-4 rounded-full bg-[hsl(0,0%,97%)] border border-[hsl(0,0%,88%)] text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(265,75%,58%)]/20 focus:border-[hsl(265,75%,58%)]/30"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-[hsl(0,0%,96%)] border border-[hsl(0,0%,90%)]">
            <button
              type="button"
              onClick={() => setCityFilter("")}
              className={cn(
                "h-8 px-3 rounded-full text-[11px] font-bold transition-all",
                !initialCity ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Todas
            </button>
            {CITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCityFilter(c.name)}
                className={cn(
                  "h-8 px-3 rounded-full text-[11px] font-bold transition-all",
                  initialCity === c.name ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className={cn(
              "flex items-center gap-1.5 h-10 px-4 rounded-full text-xs font-bold border transition-all shrink-0",
              advancedCount > 0
                ? "border-[hsl(265,75%,58%)]/30 bg-[hsl(265,75%,58%)]/10 text-[hsl(265,75%,45%)]"
                : "bg-white border-[hsl(0,0%,88%)] text-foreground hover:border-foreground/20"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Más filtros
            {advancedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[hsl(265,75%,58%)] text-white text-[10px] font-bold flex items-center justify-center">
                {advancedCount}
              </span>
            )}
          </button>

          <div className="hidden lg:block shrink-0">{sortSelect}</div>

          <div className="lg:hidden flex items-center gap-2 shrink-0 ml-auto">
            {sortSelect}
            <button
              type="button"
              onClick={() => setViewMode((m) => (m === "map" ? "split" : "map"))}
              className={cn(
                "flex items-center gap-1.5 h-10 px-3.5 rounded-full text-xs font-bold border transition-all",
                viewMode === "map"
                  ? "border-[hsl(265,75%,58%)]/30 bg-[hsl(265,75%,58%)]/10 text-[hsl(265,75%,45%)]"
                  : "bg-white border-[hsl(0,0%,88%)] text-foreground"
              )}
            >
              <Map className="w-3.5 h-3.5" />
              Mapa
            </button>
          </div>
        </div>

        <div className="px-4 lg:px-6 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-0.5">Tipo</span>
          {QUICK_FILTERS.map((f) => {
            const active = activeQuick.includes(f.key);
            return (
              <button
                key={f.key}
                onClick={() =>
                  setActiveQuick((prev) =>
                    prev.includes(f.key) ? prev.filter((k) => k !== f.key) : [...prev, f.key]
                  )
                }
                className={cn(
                  "shrink-0 h-8 px-3.5 rounded-full text-[11px] font-semibold border transition-all inline-flex items-center gap-1.5",
                  active
                    ? "bg-foreground border-foreground text-white shadow-sm"
                    : "bg-white border-[hsl(0,0%,88%)] text-foreground/80 hover:border-foreground/20"
                )}
              >
                {active && <Check className="w-3 h-3" />}
                {f.label}
              </button>
            );
          })}
          {totalFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="shrink-0 text-[11px] font-semibold text-muted-foreground flex items-center gap-1 hover:text-foreground px-2"
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <>
          <div className="hidden lg:grid lg:grid-cols-[7fr_3fr] lg:h-[calc(100vh-168px)]">
            <div className="px-6 py-5 grid grid-cols-2 xl:grid-cols-3 gap-5">
              {Array(9).fill(0).map((_, i) => (
                <ExploreSkeleton key={i} />
              ))}
            </div>
            <div className="border-l border-[hsl(0,0%,90%)] shimmer min-h-[400px]" />
          </div>
          <div className="lg:hidden px-4 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array(4).fill(0).map((_, i) => (
              <ExploreSkeleton key={i} />
            ))}
          </div>
        </>
      ) : filtered.length > 0 && viewMode === "map" ? (
        <div className="lg:hidden h-[calc(100vh-168px)]">
          <ExploreMap properties={filtered} activeCity={initialCity || undefined} pane className="h-full" />
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className="hidden lg:grid lg:grid-cols-[7fr_3fr] lg:h-[calc(100vh-168px)] border-t border-[hsl(0,0%,90%)]">
            <div className="overflow-y-auto bg-[hsl(0,0%,99%)] px-6 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                    {resultsTitle}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-bold text-foreground">{filtered.length}</span>{" "}
                    {filtered.length === 1 ? "resultado" : "resultados"}
                    {initialQ && <> en «{initialQ}»</>}
                    <span className="mx-2 text-border">·</span>
                    {SORT_LABELS[sortBy]}
                  </p>
                </div>
                <p className="hidden xl:flex items-center gap-1.5 text-[11px] text-muted-foreground bg-white border border-[hsl(0,0%,90%)] rounded-full px-3 py-1.5 shrink-0">
                  <MousePointer2 className="w-3 h-3" />
                  Pasa el cursor para ubicar en el mapa
                </p>
              </div>

              {totalFilterCount > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Activos</span>
                  {initialType && (
                    <ActiveFilterChip
                      label={TYPES_LABEL[initialType] || initialType}
                      onRemove={() => {
                        const next = new URLSearchParams(searchParams);
                        next.delete("type");
                        setSearchParams(next, { replace: true });
                      }}
                    />
                  )}
                  {activeQuick.map((key) => {
                    const label = QUICK_FILTERS.find((f) => f.key === key)?.label;
                    return label ? (
                      <ActiveFilterChip key={key} label={label} onRemove={() => removeQuickFilter(key)} />
                    ) : null;
                  })}
                  {advancedFilters.bedrooms && (
                    <ActiveFilterChip
                      label={advancedFilters.bedrooms === "5" ? "5+ hab." : `${advancedFilters.bedrooms} hab.`}
                      onRemove={() => updateAdvancedFilters({ ...advancedFilters, bedrooms: "" })}
                    />
                  )}
                  {advancedFilters.bathrooms && (
                    <ActiveFilterChip
                      label={advancedFilters.bathrooms === "5" ? "5+ baños" : `${advancedFilters.bathrooms} baño${advancedFilters.bathrooms !== "1" ? "s" : ""}`}
                      onRemove={() => updateAdvancedFilters({ ...advancedFilters, bathrooms: "" })}
                    />
                  )}
                  {advancedFilters.parkingSpots && (
                    <ActiveFilterChip
                      label={`${advancedFilters.parkingSpots} parq.`}
                      onRemove={() => updateAdvancedFilters({ ...advancedFilters, parkingSpots: "" })}
                    />
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-7 mt-5">
                {filtered.map((property, i) => (
                  <div
                    key={property.id}
                    onMouseEnter={() => setHighlightedId(property.id)}
                    onMouseLeave={() => setHighlightedId(null)}
                  >
                    <PropertyCard
                      property={property}
                      index={i}
                      matchScore={property.matchScore}
                      showMatch={isMatched}
                      variant="grid"
                      highlighted={highlightedId === property.id}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col border-l border-[hsl(0,0%,90%)] bg-[hsl(0,0%,98%)] min-h-0">
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[hsl(0,0%,90%)] shrink-0 bg-white">
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-foreground truncate">{cityLabel}</p>
                  <p className="text-[10px] text-muted-foreground">{filtered.length} en el mapa</p>
                </div>
                <p className="text-[10px] text-muted-foreground text-right leading-tight max-w-[9rem]">
                  Toca un precio para ver el inmueble
                </p>
              </div>
              <div className="flex-1 min-h-0">
                <ExploreMap
                  properties={filtered}
                  activeCity={initialCity || undefined}
                  pane
                  highlightedId={highlightedId}
                  onHighlight={setHighlightedId}
                  className="h-full"
                />
              </div>
            </div>
          </div>

          <div className={cn("lg:hidden px-4 py-5 space-y-5", viewMode === "map" && "hidden")}>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">{resultsTitle}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-bold text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "resultado" : "resultados"} · {SORT_LABELS[sortBy]}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filtered.map((property, i) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={i}
                  matchScore={property.matchScore}
                  showMatch={isMatched}
                  variant="grid"
                />
              ))}
            </div>
            <ExploreMap properties={filtered} activeCity={initialCity || undefined} />
          </div>
        </>
      ) : (
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-6 sm:py-8">
          <div className="text-center py-20 sm:py-24 rounded-3xl bg-white border border-border/50 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(265,75%,58%)]/10 flex items-center justify-center mx-auto mb-5">
              <Search className="w-8 h-8 text-[hsl(265,75%,50%)]" />
            </div>
            <h3 className="font-extrabold text-xl mb-2">Sin resultados por ahora</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Prueba ampliando ciudad, zona o ajustando habitaciones, baños, parqueaderos o estrato.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
                className="gradient-cta text-white font-bold px-6 py-3 rounded-xl shadow-md hover:opacity-95 transition-opacity"
              >
                Actualizar preferencias
              </button>
              <button
                onClick={clearAllFilters}
                className="font-semibold px-6 py-3 rounded-xl border-2 border-border text-foreground hover:bg-secondary transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full lg:max-w-md bg-[hsl(0,0%,96%)] rounded-t-3xl lg:rounded-2xl p-5 max-h-[88vh] overflow-y-auto"
            >
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg">Más filtros</h3>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-xl hover:bg-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <AdvancedFilters
                filters={advancedFilters}
                onChange={updateAdvancedFilters}
                onClear={clearAdvancedFilters}
              />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-4 gradient-cta text-white font-bold py-3.5 rounded-xl"
              >
                Ver {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
