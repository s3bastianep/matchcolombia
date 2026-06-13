import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PropertyCard from "../components/property/PropertyCard";
import SearchBar from "../components/search/SearchBar";
import AdvancedFilters from "../components/explore/AdvancedFilters";
import ExploreMap from "../components/explore/ExploreMap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, MapPin, Sparkles, Search, LayoutGrid, Map, Columns2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatEstratoFilterLabel } from "@/lib/propertyLabels";
import { loadPreferences, scoreProperty } from "@/lib/matchPreferences";
import {
  DEFAULT_ADVANCED_FILTERS,
  parseAdvancedFiltersFromUrl,
  applyAdvancedFilters,
  countAdvancedFilters,
} from "@/lib/propertyFilters";

const QUICK_FILTERS = [
  { key: "apartamento", label: "Apartamento", color: "border-[hsl(340,82%,52%)]/35 text-[hsl(340,82%,45%)] bg-[hsl(340,82%,52%)]/10" },
  { key: "casa", label: "Casa", color: "border-[hsl(168,72%,40%)]/35 text-[hsl(168,72%,35%)] bg-[hsl(168,72%,40%)]/10" },
  { key: "estudio", label: "Estudio", color: "border-[hsl(265,75%,58%)]/35 text-[hsl(265,75%,50%)] bg-[hsl(265,75%,58%)]/10" },
  { key: "pets", label: "Mascotas 🐾", color: "border-[hsl(32,95%,54%)]/35 text-[hsl(32,95%,40%)] bg-[hsl(32,95%,54%)]/10" },
  { key: "parking", label: "Parqueadero", color: "border-[hsl(200,90%,50%)]/35 text-[hsl(200,90%,40%)] bg-[hsl(200,90%,50%)]/10" },
];

function ExploreSkeleton() {
  return (
    <div className="rounded-[1.35rem] bg-white border border-border/30 overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className="aspect-[16/10] shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded-lg shimmer" />
        <div className="h-3 w-1/2 rounded-lg shimmer" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-16 rounded-md shimmer" />
          <div className="h-6 w-14 rounded-md shimmer" />
        </div>
      </div>
    </div>
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
  const exploreHeading = intent === "compra" ? "Comprar en" : "Arriendos en";
  const prefs = loadPreferences();

  const [sortBy, setSortBy] = useState(isMatched ? "match" : "newest");
  const [activeQuick, setActiveQuick] = useState([]);
  const [priceMax, setPriceMax] = useState(initialMax ? parseInt(initialMax) : (prefs?.maxPrice || 10000000));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("split");
  const [highlightedId, setHighlightedId] = useState(null);

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

  const cityLabel = initialCity || prefs?.city || "Bogotá y Barranquilla";
  const advancedCount = countAdvancedFilters(advancedFilters);
  const totalFilterCount = advancedCount + activeQuick.length;

  return (
    <div className="min-h-screen bg-[hsl(240,40%,98%)]">
      <div className="bg-white border-b border-border/40 sticky top-[62px] z-30">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-5">
          {isMatched && prefs && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[hsl(265,75%,58%)]/8 via-[hsl(340,82%,52%)]/6 to-[hsl(168,72%,40%)]/8 border border-[hsl(265,75%,58%)]/20 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-sm text-foreground">
                  Tus matches{cityLabel !== "Bogotá y Barranquilla" ? ` en ${cityLabel}` : ""}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {prefs.zone && `${prefs.zone} · `}
                  {prefs.type !== "all" && `${prefs.type} · `}
                  {prefs.beds !== "all" && `${prefs.beds} hab. · `}
                  ordenados por compatibilidad
                </p>
              </div>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
                className="ml-auto text-xs font-bold text-[hsl(265,75%,50%)] hover:underline shrink-0"
              >
                Editar
              </button>
            </motion.div>
          )}

          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-[1.75rem] font-extrabold tracking-tight">
                {isMatched ? "Tus matches" : exploreHeading}{" "}
                <span className="text-gradient">{cityLabel}</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[hsl(340,82%,52%)]" />
                {isLoading ? "Cargando..." : `${filtered.length} inmueble${filtered.length !== 1 ? "s" : ""}`}
                {initialQ && <span className="font-semibold text-foreground"> en «{initialQ}»</span>}
              </p>
            </div>
            {!isMatched && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
                className="hidden sm:flex items-center gap-1.5 gradient-cta text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 shadow-md hover:opacity-95 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Hacer quiz
              </button>
            )}
          </div>

          <SearchBar variant="compact" className="shadow-[0_8px_30px_rgba(15,23,42,0.06)] rounded-[1.25rem] border-border/30" />
        </div>
      </div>

      <div className="border-b border-[hsl(0,0%,92%)] bg-[hsl(0,0%,98%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-3 flex items-center gap-2.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className={cn(
              "lg:hidden shrink-0 flex items-center gap-1.5 h-10 px-4 rounded-full text-xs font-bold border transition-all",
              advancedCount > 0
                ? "border-foreground/20 bg-foreground text-white"
                : "bg-white border-[hsl(0,0%,88%)] text-foreground hover:border-foreground/20"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Más filtros
            {advancedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center">
                {advancedCount}
              </span>
            )}
          </button>

          <span className="hidden lg:inline text-xs font-bold text-muted-foreground shrink-0">Filtros:</span>
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() =>
                setActiveQuick((prev) =>
                  prev.includes(f.key) ? prev.filter((k) => k !== f.key) : [...prev, f.key]
                )
              }
              className={cn(
                "shrink-0 h-10 px-4 rounded-full text-xs font-semibold border transition-all",
                activeQuick.includes(f.key)
                  ? "bg-foreground border-foreground text-white shadow-sm"
                  : "bg-white border-[hsl(0,0%,88%)] text-foreground/80 hover:border-foreground/20"
              )}
            >
              {f.label}
            </button>
          ))}
          {totalFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="shrink-0 text-xs font-semibold text-muted-foreground flex items-center gap-1 hover:text-foreground"
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
          <div className="ml-auto shrink-0 flex items-center gap-2">
            <div className="flex p-1 rounded-xl bg-secondary/60 border border-border/30">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={cn(
                  "hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  viewMode === "split" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
                )}
              >
                <Columns2 className="w-3.5 h-3.5" />
                Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  viewMode === "list" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lista</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  viewMode === "map" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
                )}
              >
                <Map className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mapa</span>
              </button>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 bg-secondary/80 border-0 text-xs font-semibold rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {isMatched && <SelectItem value="match">Mejor match</SelectItem>}
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="price_asc">Menor precio</SelectItem>
                <SelectItem value="price_desc">Mayor precio</SelectItem>
                <SelectItem value="area">Mayor área</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-6 sm:py-8">
        <div className="flex gap-6 xl:gap-8 items-start">
          <aside className="hidden lg:block w-[272px] xl:w-[288px] shrink-0 sticky top-[188px]">
            <AdvancedFilters
              filters={advancedFilters}
              onChange={updateAdvancedFilters}
              onClear={clearAdvancedFilters}
            />
          </aside>

          <div className="flex-1 min-w-0">
            {totalFilterCount > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {advancedFilters.bedrooms && (
                  <span className="px-3 py-1 rounded-lg bg-white border border-border/40 text-xs font-semibold">
                    {advancedFilters.bedrooms === "5" ? "5+ hab." : `${advancedFilters.bedrooms} hab.`}
                  </span>
                )}
                {advancedFilters.bathrooms && (
                  <span className="px-3 py-1 rounded-lg bg-white border border-border/40 text-xs font-semibold">
                    {advancedFilters.bathrooms === "5" ? "5+ baños" : `${advancedFilters.bathrooms} baño${advancedFilters.bathrooms !== "1" ? "s" : ""}`}
                  </span>
                )}
                {advancedFilters.parkingSpots && (
                  <span className="px-3 py-1 rounded-lg bg-white border border-border/40 text-xs font-semibold">
                    {advancedFilters.parkingSpots === "5" ? "5+ parqueaderos" : `${advancedFilters.parkingSpots} parqueadero${advancedFilters.parkingSpots !== "1" ? "s" : ""}`}
                  </span>
                )}
                {advancedFilters.estrato && (
                  <span className="px-3 py-1 rounded-lg bg-[hsl(32,95%,54%)]/10 border border-[hsl(32,95%,54%)]/20 text-xs font-semibold text-[hsl(32,95%,38%)]">
                    {formatEstratoFilterLabel(advancedFilters.estrato)}
                  </span>
                )}
                {activeQuick.map((key) => {
                  const label = QUICK_FILTERS.find((f) => f.key === key)?.label;
                  return label ? (
                    <span key={key} className="px-3 py-1 rounded-lg bg-white border border-border/40 text-xs font-semibold">
                      {label}
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
                {Array(6).fill(0).map((_, i) => (
                  <ExploreSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length > 0 && viewMode === "map" ? (
              <ExploreMap properties={filtered} activeCity={initialCity || undefined} />
            ) : filtered.length > 0 && viewMode === "split" ? (
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(340px,42%)] gap-6 xl:gap-7 items-start">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5 sm:gap-6">
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
                        variant="explore"
                        highlighted={highlightedId === property.id}
                      />
                    </div>
                  ))}
                </div>
                <ExploreMap
                  properties={filtered}
                  activeCity={initialCity || undefined}
                  sticky
                  highlightedId={highlightedId}
                  onHighlight={setHighlightedId}
                  className="hidden xl:block"
                />
                <ExploreMap
                  properties={filtered}
                  activeCity={initialCity || undefined}
                  highlightedId={highlightedId}
                  onHighlight={setHighlightedId}
                  className="xl:hidden"
                />
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
                {filtered.map((property, i) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={i}
                    matchScore={property.matchScore}
                    showMatch={isMatched}
                    variant="explore"
                  />
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end">
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
              className="relative w-full bg-[hsl(0,0%,96%)] rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto"
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
