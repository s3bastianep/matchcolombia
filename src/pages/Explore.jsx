import React, { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/api/apiClient";
import PropertyCard from "../components/property/PropertyCard";
import ExploreOwnerPromoCard from "../components/explore/ExploreOwnerPromoCard";
import AdvancedFilters from "../components/explore/AdvancedFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Sparkles, Search, Map, Check, ArrowUpDown, MousePointer2, ShieldCheck, LayoutGrid, Columns2, Home, LayoutList, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import VerifiedBadge from "../components/brand/VerifiedBadge";
import { loadPreferences, scoreProperty } from "@/lib/matchPreferences";
import { CITIES } from "@/lib/colombia";
import { usePropertyPanel } from "@/lib/PropertyPanelContext";
import { PROPERTY_LIST_QUERY } from "@/lib/queryOptions";
import {
  EXPLORE_TRUST_BANNER,
  EXPLORE_MORE_FILTERS,
  EXPLORE_DEFAULT_CITY,
  EXPLORE_TYPE_LABELS,
  EXPLORE_SORT_LABELS,
  listingsCountLabel,
  matchBannerTitle,
  viewListingsLabel,
  EXPLORE_EMPTY_NO_LISTINGS_TITLE,
  EXPLORE_EMPTY_NO_LISTINGS_DESC,
  EXPLORE_EMPTY_FILTERED_TITLE,
  EXPLORE_EMPTY_FILTERED_DESC,
  exploreResultsQuerySuffix,
  bathroomFilterChipLabel,
} from "@/lib/siteCopy";
import {
  DEFAULT_ADVANCED_FILTERS,
  parseAdvancedFiltersFromUrl,
  applyAdvancedFilters,
  countAdvancedFilters,
  advancedFiltersToUrlParams,
} from "@/lib/propertyFilters";
import { shouldInsertOwnerPromo, EXPLORE_SPLIT_LAYOUT, EXPLORE_GUTTER, EXPLORE_CONTENT_PAD } from "@/lib/exploreUtils";

import ExploreMap from "../components/explore/ExploreMap";
import ExploreAppBar from "../components/explore/ExploreAppBar";
import ExploreFiltersDrawer from "../components/explore/ExploreFiltersDrawer";
import PropertyAppCard from "../components/property/PropertyAppCard";
import PullToRefresh from "../components/mobile/PullToRefresh";
import AppEmptyState from "../components/mobile/AppEmptyState";

function MapPaneFallback({ className }) {
  return <div className={cn("shimmer bg-muted/20", className)} aria-hidden />;
}

const TYPES_LABEL = EXPLORE_TYPE_LABELS;

const SORT_LABELS = EXPLORE_SORT_LABELS;

const QUICK_FILTERS = [
  { key: "apartamento", label: "Apartamento", color: "border-brand-magenta/30 text-brand-magenta bg-brand-magenta/10" },
  { key: "casa", label: "Casa", color: "border-brand-violet/30 text-brand-violet bg-brand-violet/10" },
  { key: "estudio", label: "Estudio", color: "border-brand-violet/25 text-brand-violet bg-brand-violet/8" },
  { key: "pets", label: "Mascotas", color: "border-brand-magenta/25 text-brand-magenta bg-brand-magenta/8" },
  { key: "parking", label: "Parqueadero", color: "border-brand-violet/25 text-brand-violet bg-brand-violet/8" },
];

function ExploreSkeleton() {
  return (
    <div className="native-card overflow-hidden">
      <div className="w-full aspect-[4/3] shimmer" />
      <div className="p-3.5 space-y-2">
        <div className="h-4 w-1/2 rounded shimmer" />
        <div className="h-3 w-2/3 rounded shimmer" />
        <div className="h-3 w-1/3 rounded shimmer" />
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
          "h-9 min-w-[6.5rem] bg-white border border-brand-violet/12 rounded-full px-3.5 text-xs font-bold gap-1.5 shadow-sm shrink-0",
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
    <p className="text-xs text-muted-foreground mt-1 leading-normal">
      <span className="font-extrabold text-foreground tabular-nums">{count}</span>{" "}
      {listingsCountLabel(count)}
      {query && exploreResultsQuerySuffix(query)}
    </p>
  );
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialCity = searchParams.get("city") || "";
  const initialTypeRaw = searchParams.get("type") || "";
  const initialTypes = useMemo(
    () => (initialTypeRaw ? initialTypeRaw.split(",").map((s) => s.trim()).filter(Boolean) : []),
    [initialTypeRaw]
  );
  const initialZones = useMemo(() => {
    const zonesParam = searchParams.get("zones");
    if (zonesParam) return zonesParam.split(",").map((s) => s.trim()).filter(Boolean);
    return initialQ ? [initialQ] : [];
  }, [searchParams, initialQ]);
  const isMatched = searchParams.get("matched") === "1";
  const intent = searchParams.get("intent");
  const prefs = useMemo(() => loadPreferences(), []);

  const [sortBy, setSortBy] = useState(isMatched ? "match" : "newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("split");
  const [highlightedId, setHighlightedId] = useState(null);
  const [locality, setLocality] = useState(initialQ);

  const activeQuick = useMemo(() => {
    const raw = searchParams.get("quick");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);
  const { openProperty, property: openPanelProperty } = usePropertyPanel();
  const inmuebleId = searchParams.get("inmueble");
  const visitaFromUrl = searchParams.get("visita") === "1";

  useEffect(() => {
    if (window.innerWidth < 1024) setViewMode("list");
  }, []);

  useEffect(() => {
    void import("../components/property/PropertyDetailView");
  }, []);

  const applyZoneSearch = useCallback((zone) => {
    setLocality(zone);
    const next = new URLSearchParams(searchParams);
    next.set("q", zone);
    if (!next.get("city")) next.set("city", EXPLORE_DEFAULT_CITY);
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const applyLocalitySearch = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    if (locality.trim()) next.set("q", locality.trim());
    else next.delete("q");
    setSearchParams(next, { replace: true });
  }, [locality, searchParams, setSearchParams]);

  useEffect(() => {
    setLocality(initialQ);
  }, [initialQ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = locality.trim();
      if (trimmed === (initialQ || "")) return;
      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      setSearchParams(next, { replace: true });
    }, 450);
    return () => clearTimeout(timer);
  }, [locality, initialQ, searchParams, setSearchParams]);

  const advancedFilters = useMemo(
    () => parseAdvancedFiltersFromUrl(searchParams),
    [searchParams]
  );

  const { data: properties = [], isLoading, refetch } = useQuery({
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
    const next = syncFiltersToUrl(searchParams, DEFAULT_ADVANCED_FILTERS);
    next.delete("quick");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    let result = properties.map((p) => ({
      ...p,
      matchScore: scoreProperty(p, prefs),
    }));

    if (initialCity) {
      const c = initialCity.toLowerCase();
      result = result.filter((p) => p.city?.toLowerCase() === c);
    }

    if (initialZones.length === 1) {
      const q = initialZones[0].toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.neighborhood?.toLowerCase().includes(q) ||
          p.locality?.toLowerCase().includes(q)
      );
    } else if (initialZones.length > 1) {
      result = result.filter((p) =>
        initialZones.some((zone) => {
          const q = zone.toLowerCase();
          return (
            p.title?.toLowerCase().includes(q) ||
            p.neighborhood?.toLowerCase().includes(q) ||
            p.locality?.toLowerCase().includes(q)
          );
        })
      );
    }

    if (initialTypes.length) {
      result = result.filter((p) => initialTypes.includes(p.property_type));
    }

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
  }, [properties, initialZones, initialCity, initialTypes, advancedFilters, activeQuick, sortBy, isMatched, prefs]);

  const cityLabel = initialCity || prefs?.city || EXPLORE_DEFAULT_CITY;
  const advancedCount = countAdvancedFilters(advancedFilters);
  const totalFilterCount = advancedCount + activeQuick.length;
  const resultsTitle =
    intent === "compra"
      ? `Inmuebles en venta en ${cityLabel}`
      : `Apartamentos en arriendo en ${cityLabel}`;

  const removeQuickFilter = useCallback((key) => {
    const current = activeQuick.filter((k) => k !== key);
    const next = new URLSearchParams(searchParams);
    if (current.length) next.set("quick", current.join(","));
    else next.delete("quick");
    setSearchParams(next, { replace: true });
  }, [activeQuick, searchParams, setSearchParams]);

  const toggleQuickFilter = useCallback((key) => {
    const current = activeQuick;
    const updated = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    const next = new URLSearchParams(searchParams);
    if (updated.length) next.set("quick", updated.join(","));
    else next.delete("quick");
    setSearchParams(next, { replace: true });
  }, [activeQuick, searchParams, setSearchParams]);

  const setCityFilter = useCallback((city) => {
    const next = new URLSearchParams(searchParams);
    if (city) next.set("city", city);
    else next.delete("city");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const sortSelect = (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="h-9 min-w-[8.5rem] bg-white border border-brand-violet/12 text-xs font-bold rounded-full gap-1.5 px-3.5 shadow-sm">
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <SelectValue placeholder="Ordenar" />
      </SelectTrigger>
      <SelectContent>
        {isMatched && <SelectItem value="match">Recomendados</SelectItem>}
        <SelectItem value="newest">{EXPLORE_SORT_LABELS.newest}</SelectItem>
        <SelectItem value="price_asc">{EXPLORE_SORT_LABELS.price_asc}</SelectItem>
        <SelectItem value="price_desc">{EXPLORE_SORT_LABELS.price_desc}</SelectItem>
        <SelectItem value="area">{EXPLORE_SORT_LABELS.area}</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="h-full min-h-0 bg-white flex flex-col">
      <ExploreAppBar
        locality={locality}
        onLocalityChange={setLocality}
        onSearch={applyLocalitySearch}
        initialCity={initialCity}
        onCityChange={setCityFilter}
        onOpenFilters={() => setMobileFiltersOpen(true)}
        filterCount={totalFilterCount}
        viewMode={viewMode}
        onToggleView={() => setViewMode((m) => (m === "map" ? "list" : "map"))}
        activeQuick={activeQuick}
        onToggleQuick={toggleQuickFilter}
        onZoneSelect={applyZoneSearch}
        resultsCount={isLoading ? null : filtered.length}
      />

      <div className={cn("hidden lg:block bg-white border-b border-[hsl(0,0%,90%)] sticky top-[58px] z-30 shrink-0", EXPLORE_GUTTER)}>
        {isMatched && prefs && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-brand-violet/8 to-brand-magenta/6 border border-brand-violet/15 flex items-center gap-2.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-violet shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-foreground truncate">{matchBannerTitle(cityLabel)}</p>
            </div>
            <VerifiedBadge size="xs" className="shrink-0" />
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-habibar-quiz"))}
              className="text-[10px] font-bold text-brand-violet hover:underline shrink-0"
            >
              Editar
            </button>
          </motion.div>
        )}

        <div className="my-1.5 rounded-2xl border border-brand-violet/12 bg-gradient-to-br from-brand-violet/[0.05] via-[hsl(0,0%,99%)] to-brand-magenta/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.04)] px-3 py-2.5 space-y-2">
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px] lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-violet/50 pointer-events-none" />
              <input
                type="search"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyLocalitySearch()}
                onBlur={applyLocalitySearch}
                placeholder="Buscar por localidad o barrio"
                aria-label="Buscar por localidad"
                className="w-full h-9 pl-9 pr-3 rounded-full bg-white border border-brand-violet/15 text-sm font-medium placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet/35"
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
              "flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-bold border transition-all shrink-0 shadow-sm",
              advancedCount > 0
                ? "border-brand-violet/30 bg-brand-violet/10 text-brand-violet"
                : "bg-white border-brand-violet/12 text-foreground hover:border-brand-violet/25"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {EXPLORE_MORE_FILTERS}
            {advancedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-violet text-white text-[10px] font-bold flex items-center justify-center">
                {advancedCount}
              </span>
            )}
          </button>

          <div className="hidden lg:block shrink-0">{sortSelect}</div>

          <div className="hidden lg:flex items-center gap-1 p-0.5 rounded-full bg-white/80 border border-brand-violet/10 shadow-sm shrink-0">
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

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[hsl(var(--brand-violet)/0.08)] border border-brand-violet/15 shrink-0 ml-auto max-w-[280px]">
            <UserRound className="w-3.5 h-3.5 shrink-0 text-brand-violet" strokeWidth={2.25} />
            <p className="text-[10px] font-semibold text-foreground/80 truncate">
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

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5 border-t border-brand-violet/8">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-brand-violet/70">Tipo</span>
          {QUICK_FILTERS.map((f) => {
            const active = activeQuick.includes(f.key);
            return (
              <button
                key={f.key}
                onClick={() => toggleQuickFilter(f.key)}
                className={cn(
                  "shrink-0 h-7 px-3 rounded-full text-[11px] font-semibold border transition-all inline-flex items-center gap-1 shadow-sm",
                  active
                    ? "chip-brand-active shadow-sm"
                    : "bg-white/90 border-brand-violet/12 text-foreground/80 hover:border-brand-violet/25 hover:bg-white"
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

        <div className="pb-1.5 lg:hidden">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[hsl(var(--brand-violet)/0.08)] border border-brand-violet/15">
            <UserRound className="w-3.5 h-3.5 shrink-0 text-brand-violet" strokeWidth={2.25} />
            <p className="text-[10px] font-semibold text-foreground/80 leading-snug">
              {EXPLORE_TRUST_BANNER}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <>
          <div className={cn("hidden lg:grid lg:flex-1 lg:min-h-0 min-w-0 gap-4 lg:gap-5", EXPLORE_CONTENT_PAD, EXPLORE_SPLIT_LAYOUT)}>
            <div className="border-r-0 shimmer min-h-[400px] rounded-xl" />
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 items-stretch">
              {Array(9).fill(0).map((_, i) => (
                <ExploreSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="lg:hidden px-5 lg:px-8 py-5 grid grid-cols-1 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <ExploreSkeleton key={i} />
            ))}
          </div>
        </>
      ) : filtered.length > 0 && viewMode === "map" ? (
        <div className="lg:hidden flex-1 min-h-0 relative pb-mobile-nav">
          <Suspense fallback={<MapPaneFallback className="h-full" />}>
            <ExploreMap properties={filtered} activeCity={initialCity || undefined} pane className="h-full border-0" />
          </Suspense>
          <div className="absolute bottom-[4.5rem] left-0 right-0 z-[4] px-3 pointer-events-none">
            <div className="flex gap-3 overflow-x-auto native-scroll-x snap-x snap-mandatory pb-1 pointer-events-auto">
              {filtered.slice(0, 10).map((p, i) => (
                <div key={p.id} className="snap-start shrink-0 w-[min(88vw,300px)]">
                  <PropertyAppCard
                    property={p}
                    layout="horizontal"
                    index={i}
                    showMatch={isMatched}
                    matchScore={p.matchScore}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-white text-sm font-bold shadow-xl active:scale-[0.98] transition-transform"
          >
            <LayoutList className="w-4 h-4" />
            Ver {filtered.length} inmuebles
          </button>
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className={cn(
            "hidden lg:grid lg:flex-1 lg:min-h-0 min-w-0 gap-4 lg:gap-5",
            EXPLORE_CONTENT_PAD,
            viewMode === "list" ? "grid-cols-1" : EXPLORE_SPLIT_LAYOUT
          )}>
            {viewMode === "split" && (
            <div className="flex flex-col bg-[hsl(0,0%,98%)] min-h-0 min-w-0 overflow-hidden rounded-xl border border-[hsl(0,0%,90%)] shadow-sm">
              <div className="flex-1 min-h-0">
                <Suspense fallback={<MapPaneFallback className="h-full rounded-xl" />}>
                  <ExploreMap
                    properties={filtered}
                    activeCity={initialCity || undefined}
                    pane
                    highlightedId={highlightedId}
                    onHighlight={setHighlightedId}
                    className="h-full rounded-xl"
                  />
                </Suspense>
              </div>
            </div>
            )}

            <div className="overflow-y-auto overflow-x-hidden bg-[hsl(0,0%,99%)] min-w-0 min-h-0 pt-1 pb-20">
              <div className="sticky top-0 z-10 bg-[hsl(0,0%,99%)] pt-2 pb-3 mb-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h1 className="text-base lg:text-lg font-extrabold tracking-tight text-foreground leading-snug">
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
                  {initialTypes.length > 0 && (
                    <ActiveFilterChip
                      label={
                        initialTypes.length === 1
                          ? TYPES_LABEL[initialTypes[0]] || initialTypes[0]
                          : initialTypes.map((t) => TYPES_LABEL[t] || t).join(" · ")
                      }
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
                      label={
                        advancedFilters.bedrooms.includes(",")
                          ? `${advancedFilters.bedrooms.split(",").join(" y ")} hab.`
                          : advancedFilters.bedrooms === "5"
                            ? "5+ hab."
                            : `${advancedFilters.bedrooms} hab.`
                      }
                      onRemove={() => updateAdvancedFilters({ ...advancedFilters, bedrooms: "" })}
                    />
                  )}
                  {advancedFilters.bathrooms && (
                    <ActiveFilterChip
                      label={bathroomFilterChipLabel(advancedFilters.bathrooms)}
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
              </div>

              <div className={cn(
                "grid items-stretch gap-x-3 gap-y-4 min-w-0 pt-1",
                viewMode === "list"
                  ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-2 xl:grid-cols-3"
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

          <PullToRefresh
            onRefresh={() => refetch()}
            className={cn("lg:hidden flex-1 min-h-0 pb-mobile-nav native-scroll-y", viewMode === "map" && "hidden")}
          >
            {isMatched && prefs && (
              <div className="mx-4 mt-3 mb-1 px-3 py-2.5 rounded-2xl bg-brand-violet/8 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-violet shrink-0" />
                <p className="text-xs font-semibold text-foreground flex-1 truncate">{matchBannerTitle(cityLabel)}</p>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-habibar-quiz"))}
                  className="text-xs font-bold text-brand-violet shrink-0"
                >
                  Editar
                </button>
              </div>
            )}
            <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-extrabold text-foreground tabular-nums">{filtered.length}</span>{" "}
                {listingsCountLabel(filtered.length)}
              </p>
              <div className="shrink-0">{sortSelect}</div>
            </div>
            {totalFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {activeQuick.map((key) => {
                  const label = QUICK_FILTERS.find((f) => f.key === key)?.label;
                  return label ? (
                    <ActiveFilterChip key={key} label={label} onRemove={() => removeQuickFilter(key)} />
                  ) : null;
                })}
              </div>
            )}
            <div className="px-4 pb-4 grid grid-cols-1 gap-4">
              {filtered.flatMap((property, i) => {
                const items = [
                  <PropertyAppCard
                    key={property.id}
                    property={property}
                    index={i}
                    matchScore={property.matchScore}
                    showMatch={isMatched}
                  />,
                ];
                if (shouldInsertOwnerPromo(i)) {
                  items.push(<ExploreOwnerPromoCard key={`owner-promo-mobile-${i}`} />);
                }
                return items;
              })}
            </div>
          </PullToRefresh>
        </>
      ) : (
        <>
          <div className="lg:hidden flex-1 min-h-0 pb-mobile-nav">
            <AppEmptyState
              icon={properties.length === 0 ? Home : Search}
              title={properties.length === 0 ? EXPLORE_EMPTY_NO_LISTINGS_TITLE : EXPLORE_EMPTY_FILTERED_TITLE}
              description={properties.length === 0 ? EXPLORE_EMPTY_NO_LISTINGS_DESC : EXPLORE_EMPTY_FILTERED_DESC}
              action={
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-habibar-quiz"))}
                  className="app-btn-primary w-full py-3.5 text-sm"
                >
                  {properties.length === 0 ? "Configurar cuestionario" : "Refinar cuestionario"}
                </button>
              }
              secondaryAction={
                properties.length === 0 ? (
                  <Link to="/" className="app-btn-secondary w-full py-3.5 text-sm text-center">
                    Volver al inicio
                  </Link>
                ) : (
                  <button type="button" onClick={clearAllFilters} className="app-btn-secondary w-full py-3.5 text-sm">
                    Limpiar filtros
                  </button>
                )
              }
            />
          </div>
          <div className="hidden lg:block max-w-[1440px] mx-auto px-5 sm:px-8 py-6 sm:py-8">
            <div className="text-center py-20 sm:py-24 rounded-3xl bg-white border border-border/50 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-brand-violet/10 flex items-center justify-center mx-auto mb-5">
              {properties.length === 0 ? (
                <Home className="w-8 h-8 text-brand-violet" />
              ) : (
                <Search className="w-8 h-8 text-brand-violet" />
              )}
            </div>
            <h3 className="font-extrabold text-xl mb-2">
              {properties.length === 0 ? EXPLORE_EMPTY_NO_LISTINGS_TITLE : EXPLORE_EMPTY_FILTERED_TITLE}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto leading-relaxed">
              {properties.length === 0 ? EXPLORE_EMPTY_NO_LISTINGS_DESC : EXPLORE_EMPTY_FILTERED_DESC}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-habibar-quiz"))}
                className="gradient-cta text-white font-bold px-6 py-3 rounded-xl shadow-md hover:opacity-95 transition-opacity"
              >
                {properties.length === 0 ? "Configurar cuestionario" : "Refinar cuestionario"}
              </button>
              {properties.length === 0 ? (
                <Link
                  to="/"
                  className="font-semibold px-6 py-3 rounded-xl border-2 border-border text-foreground hover:bg-secondary transition-colors inline-flex items-center justify-center"
                >
                  Volver al inicio
                </Link>
              ) : (
                <button
                  onClick={clearAllFilters}
                  className="font-semibold px-6 py-3 rounded-xl border-2 border-border text-foreground hover:bg-secondary transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
            </div>
          </div>
        </>
      )}

      <ExploreFiltersDrawer
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        filters={advancedFilters}
        onChange={updateAdvancedFilters}
        onClear={clearAdvancedFilters}
        resultCount={filtered.length}
      />
    </div>
  );
}
