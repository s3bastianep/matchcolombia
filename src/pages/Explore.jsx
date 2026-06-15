import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { api } from "@/api/apiClient";
import PropertyCard from "../components/property/PropertyCard";
import ExploreOwnerPromoCard from "../components/explore/ExploreOwnerPromoCard";
import AdvancedFilters from "../components/explore/AdvancedFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Sparkles, Search, Map, Check, ArrowUpDown, MousePointer2, ShieldCheck, LayoutGrid, Columns2 } from "lucide-react";
import { cn } from "@/lib/utils";
import VerifiedBadge from "../components/brand/VerifiedBadge";
import { loadPreferences, scoreProperty } from "@/lib/matchPreferences";
import { CITIES } from "@/lib/colombia";
import { usePropertyPanel } from "@/lib/PropertyPanelContext";
import { PROPERTY_LIST_QUERY } from "@/lib/queryOptions";
import {
  EXPLORE_TRUST_BANNER,
  listingsCountLabel,
  matchBannerTitle,
  viewListingsLabel,
} from "@/lib/siteCopy";
import {
  DEFAULT_ADVANCED_FILTERS,
  parseAdvancedFiltersFromUrl,
  applyAdvancedFilters,
  countAdvancedFilters,
  advancedFiltersToUrlParams,
} from "@/lib/propertyFilters";
import { shouldInsertOwnerPromo, EXPLORE_SPLIT_LAYOUT } from "@/lib/exploreUtils";

const ExploreMap = lazy(() => import("../components/explore/ExploreMap"));

function MapPaneFallback({ className }) {
  return <div className={cn("shimmer bg-muted/20", className)} aria-hidden />;
}

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
  { key: "apartamento", label: "Apartamento", color: "border-brand-magenta/30 text-brand-magenta bg-brand-magenta/10" },
  { key: "casa", label: "Casa", color: "border-brand-violet/30 text-brand-violet bg-brand-violet/10" },
  { key: "estudio", label: "Estudio", color: "border-brand-violet/25 text-brand-violet bg-brand-violet/8" },
  { key: "pets", label: "Mascotas", color: "border-brand-magenta/25 text-brand-magenta bg-brand-magenta/8" },
  { key: "parking", label: "Parqueadero", color: "border-brand-violet/25 text-brand-violet bg-brand-violet/8" },
];

function ExploreSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[hsl(0,0%,92%)] p-3 h-full flex flex-col">
      <div className="w-full aspect-[5/4] rounded-lg shimmer shrink-0" />
      <div className="pt-3 space-y-2 flex-1 flex flex-col">
        <div className="h-4 w-2/3 rounded shimmer" />
        <div className="h-3 w-1/2 rounded shimmer" />
        <div className="h-8 w-full rounded-lg shimmer mt-auto" />
      </div>
    </div>
  );
}

function ActiveFilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-2 rounded-full bg-white border border-brand-magenta/25 text-[11px] font-semibold text-brand-magenta">
      {label}
      <button type="button" onClick={onRemove} className="touch-target p-0 rounded-full hover:bg-brand-magenta/10">
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}

function CityFilterSelect({ initialCity, setCityFilter, className }) {
  return (
    <Select
      value={initialCity || "all"}
      onValueChange={(v) => setCityFilter(v === "all" ? "" : v)}
    >
      <SelectTrigger
        className={cn(
          "h-10 min-w-[6.5rem] bg-[hsl(0,0%,96%)] border border-[hsl(0,0%,90%)] rounded-full px-3.5 text-xs font-bold gap-1.5 shadow-sm shrink-0",
          initialCity && "border-brand-violet/30 text-brand-violet",
          className
        )}
      >
        <span>Ciudad</span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas</SelectItem>
        {CITIES.map((c) => (
          <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function syncFiltersToUrl(params, advancedFilters, extra = {}) {
  const next = advancedFiltersToUrlParams(advancedFilters, params);
  Object.entries(extra).forEach(([k, v]) => {
    if (v) next.set(k, v);
    else next.delete(k);
  });
  return next;
}

function ResultsCount({ count, query }) {
  return (
    <p className="text-xs text-muted-foreground mt-0.5">
      <span className="font-extrabold text-foreground tabular-nums">{count}</span>{" "}
      {listingsCountLabel(count)}
      {query && <> en «{query}»</>}
    </p>
  );
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialCity = searchParams.get("city") || "";
  const initialType = searchParams.get("type") || "";
  const isMatched = searchParams.get("matched") === "1";
  const intent = searchParams.get("intent");
  const prefs = loadPreferences();

  const [sortBy, setSortBy] = useState(isMatched ? "match" : "newest");
  const [activeQuick, setActiveQuick] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("split");
  const [highlightedId, setHighlightedId] = useState(null);
  const [locality, setLocality] = useState(initialQ);
  const { openProperty, property: openPanelProperty } = usePropertyPanel();
  const inmuebleId = searchParams.get("inmueble");
  const visitaFromUrl = searchParams.get("visita") === "1";

  useEffect(() => {
    if (window.innerWidth < 1024) setViewMode("list");
  }, []);

  useEffect(() => {
    void import("../components/property/PropertyDetailView");
  }, []);

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
    queryFn: () => api.entities.Property.filter({ status: "disponible" }, "-created_date", 100),
    ...PROPERTY_LIST_QUERY,
  });

  useEffect(() => {
    if (!inmuebleId || isLoading) return;
    if (openPanelProperty?.id === inmuebleId) return;
    const match = properties.find((p) => p.id === inmuebleId);
    if (match) openProperty(match, { focusBooking: visitaFromUrl, fromUrl: true });
  }, [inmuebleId, isLoading, properties, openPanelProperty?.id, visitaFromUrl, openProperty]);

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

    if (isMatched && prefs) {
      result = result.filter((p) => p.matchScore >= 40);
    }

    if (sortBy === "match") result.sort((a, b) => b.matchScore - a.matchScore);
    else if (sortBy === "price_asc") result.sort((a, b) => (a.monthly_rent || 0) - (b.monthly_rent || 0));
    else if (sortBy === "price_desc") result.sort((a, b) => (b.monthly_rent || 0) - (a.monthly_rent || 0));
    else if (sortBy === "area") result.sort((a, b) => (b.area_sqm || 0) - (a.area_sqm || 0));

    return result;
  }, [properties, initialQ, initialCity, initialType, advancedFilters, activeQuick, sortBy, isMatched, prefs]);

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
    <div className="h-full min-h-0 bg-white flex flex-col">
      <div className="bg-white border-b border-[hsl(0,0%,90%)] sticky top-[56px] z-30 shrink-0">
        {isMatched && prefs && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-3 lg:mx-4 mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-brand-violet/8 to-brand-magenta/6 border border-brand-violet/15 flex items-center gap-2.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-violet shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-foreground truncate">{matchBannerTitle(cityLabel)}</p>
            </div>
            <VerifiedBadge size="xs" className="shrink-0" />
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
              className="text-[10px] font-bold text-brand-violet hover:underline shrink-0"
            >
              Editar
            </button>
          </motion.div>
        )}

        <div className="px-3 lg:px-4 py-2 flex flex-wrap lg:flex-nowrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px] lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyLocalitySearch()}
              onBlur={applyLocalitySearch}
              placeholder="Buscar por localidad o barrio"
              aria-label="Buscar por localidad"
              className="w-full h-9 pl-9 pr-3 rounded-full bg-[hsl(0,0%,97%)] border border-[hsl(0,0%,88%)] text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet/30"
            />
          </div>

          <CityFilterSelect
            initialCity={initialCity}
            setCityFilter={setCityFilter}
            className="w-full sm:w-auto lg:w-[148px]"
          />

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className={cn(
              "flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-bold border transition-all shrink-0",
              advancedCount > 0
                ? "border-brand-violet/30 bg-brand-violet/10 text-brand-violet"
                : "bg-white border-[hsl(0,0%,88%)] text-foreground hover:border-foreground/20"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Más filtros
            {advancedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-violet text-white text-[10px] font-bold flex items-center justify-center">
                {advancedCount}
              </span>
            )}
          </button>

          <div className="hidden lg:block shrink-0">{sortSelect}</div>

          <div className="hidden lg:flex items-center gap-1 p-0.5 rounded-full bg-[hsl(0,0%,96%)] border border-[hsl(0,0%,90%)] shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("split")}
              title="Lista + mapa"
              className={cn(
                "h-7 px-2 rounded-full transition-all flex items-center",
                viewMode === "split" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Columns2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              title="Solo lista"
              className={cn(
                "h-7 px-2 rounded-full transition-all flex items-center",
                viewMode === "list" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[hsl(var(--brand-verified-bg))] border border-[hsl(var(--brand-verified-border))] shrink-0 ml-auto max-w-[240px]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[hsl(var(--brand-verified))]" strokeWidth={2.25} />
            <p className="text-[10px] font-semibold text-[hsl(var(--brand-verified-fg))] truncate">
              {EXPLORE_TRUST_BANNER}
            </p>
          </div>

          <div className="lg:hidden flex items-center gap-2 shrink-0 ml-auto">
            {sortSelect}
            <button
              type="button"
              onClick={() => setViewMode((m) => (m === "map" ? "list" : "map"))}
              className={cn(
                "flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-bold border transition-all",
                viewMode === "map"
                  ? "border-brand-violet/30 bg-brand-violet/10 text-brand-violet"
                  : "bg-white border-[hsl(0,0%,88%)] text-foreground"
              )}
            >
              <Map className="w-3.5 h-3.5" />
              Mapa
            </button>
          </div>
        </div>

        <div className="px-3 lg:px-4 pb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tipo</span>
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
                  "shrink-0 h-7 px-3 rounded-full text-[11px] font-semibold border transition-all inline-flex items-center gap-1",
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

        <div className="px-3 pb-2 lg:hidden">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[hsl(var(--brand-verified-bg))] border border-[hsl(var(--brand-verified-border))]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[hsl(var(--brand-verified))]" strokeWidth={2.25} />
            <p className="text-[10px] font-semibold text-[hsl(var(--brand-verified-fg))] leading-snug">
              {EXPLORE_TRUST_BANNER}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <>
          <div className={cn("hidden lg:grid lg:flex-1 lg:min-h-0 min-w-0", EXPLORE_SPLIT_LAYOUT)}>
            <div className="border-r border-[hsl(0,0%,90%)] shimmer min-h-[400px]" />
            <div className="px-6 py-5 grid grid-cols-2 xl:grid-cols-3 gap-3 items-stretch">
              {Array(9).fill(0).map((_, i) => (
                <ExploreSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="lg:hidden px-4 py-5 grid grid-cols-1 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <ExploreSkeleton key={i} />
            ))}
          </div>
        </>
      ) : filtered.length > 0 && viewMode === "map" ? (
        <div className="lg:hidden flex-1 min-h-0">
          <Suspense fallback={<MapPaneFallback className="h-full" />}>
            <ExploreMap properties={filtered} activeCity={initialCity || undefined} pane className="h-full" />
          </Suspense>
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className={cn(
            "hidden lg:grid lg:flex-1 lg:min-h-0 border-t border-[hsl(0,0%,90%)] min-w-0",
            viewMode === "list" ? "grid-cols-1" : EXPLORE_SPLIT_LAYOUT
          )}>
            {viewMode === "split" && (
            <div className="flex flex-col border-r border-[hsl(0,0%,90%)] bg-[hsl(0,0%,98%)] min-h-0 min-w-0 overflow-hidden">
              <div className="flex-1 min-h-0">
                <Suspense fallback={<MapPaneFallback className="h-full" />}>
                  <ExploreMap
                    properties={filtered}
                    activeCity={initialCity || undefined}
                    pane
                    highlightedId={highlightedId}
                    onHighlight={setHighlightedId}
                    className="h-full"
                  />
                </Suspense>
              </div>
            </div>
            )}

            <div className="overflow-y-auto overflow-x-hidden bg-[hsl(0,0%,99%)] px-4 py-3 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h1 className="text-base lg:text-lg font-extrabold tracking-tight text-foreground leading-tight">
                    {resultsTitle}
                  </h1>
                  <ResultsCount count={filtered.length} query={initialQ} />
                </div>
                {viewMode === "split" && (
                  <p className="hidden xl:flex items-center gap-1.5 text-[10px] text-muted-foreground shrink-0">
                    <MousePointer2 className="w-3 h-3" />
                    Toca un precio en el mapa
                  </p>
                )}
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
                      label={advancedFilters.bathrooms === "5" ? "5+ ba�os" : `${advancedFilters.bathrooms} ba�o${advancedFilters.bathrooms !== "1" ? "s" : ""}`}
                      onRemove={() => updateAdvancedFilters({ ...advancedFilters, bathrooms: "" })}
                    />
                  )}
                  {advancedFilters.parkingSpots && (
                    <ActiveFilterChip
                      label={`${advancedFilters.parkingSpots} parq.`}
                      onRemove={() => updateAdvancedFilters({ ...advancedFilters, parkingSpots: "" })}
                    />
                  )}
                  {advancedFilters.elevator && (
                    <ActiveFilterChip
                      label={advancedFilters.elevator === "si" ? "Con ascensor" : "Sin ascensor"}
                      onRemove={() => updateAdvancedFilters({ ...advancedFilters, elevator: "" })}
                    />
                  )}
                  {advancedFilters.pets === "si" && (
                    <ActiveFilterChip
                      label="Mascotas permitidas"
                      onRemove={() => updateAdvancedFilters({ ...advancedFilters, pets: "" })}
                    />
                  )}
                  {advancedFilters.floor && (
                    <ActiveFilterChip
                      label={advancedFilters.floor === "10" ? "Piso 10+" : `Piso ${advancedFilters.floor}`}
                      onRemove={() => updateAdvancedFilters({ ...advancedFilters, floor: "" })}
                    />
                  )}
                </div>
              )}

              <div className={cn(
                "grid items-stretch gap-x-3 gap-y-3 min-w-0",
                viewMode === "list"
                  ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 mt-4"
                  : "grid-cols-2 xl:grid-cols-3 mt-2"
              )}>
                {filtered.flatMap((property, i) => {
                  const items = [
                    <div
                      key={property.id}
                      className="min-w-0 h-full"
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
                    </div>,
                  ];
                  if (shouldInsertOwnerPromo(i)) {
                    items.push(<ExploreOwnerPromoCard key={`owner-promo-${i}`} />);
                  }
                  return items;
                })}
              </div>
            </div>
          </div>

          <div className={cn("lg:hidden flex-1 min-h-0 overflow-y-auto px-4 py-4 pb-safe space-y-4", viewMode === "map" && "hidden")}>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight leading-snug">{resultsTitle}</h1>
              <ResultsCount count={filtered.length} query={initialQ} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              {filtered.flatMap((property, i) => {
                const items = [
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={i}
                    matchScore={property.matchScore}
                    showMatch={isMatched}
                    variant="grid"
                  />,
                ];
                if (shouldInsertOwnerPromo(i)) {
                  items.push(<ExploreOwnerPromoCard key={`owner-promo-mobile-${i}`} />);
                }
                return items;
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-6 sm:py-8">
          <div className="text-center py-20 sm:py-24 rounded-3xl bg-white border border-border/50 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-brand-violet/10 flex items-center justify-center mx-auto mb-5">
              <Search className="w-8 h-8 text-brand-violet" />
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
                Refinar match
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
              className="relative w-full lg:max-w-md bg-[hsl(0,0%,96%)] rounded-t-3xl lg:rounded-2xl p-5 pb-safe max-h-[88dvh] overflow-y-auto"
            >
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg">Más filtros</h3>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="touch-target rounded-xl hover:bg-white"
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
                {viewListingsLabel(filtered.length)}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
