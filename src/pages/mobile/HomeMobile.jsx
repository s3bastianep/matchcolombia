import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, KeyRound, ShoppingBag, Building2, Sparkles, ArrowRight, Home } from "lucide-react";
import { api } from "@/api/apiClient";
import PropertyAppCard from "@/components/property/PropertyAppCard";
import PullToRefresh from "@/components/mobile/PullToRefresh";
import AppEmptyState from "@/components/mobile/AppEmptyState";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import { FEATURED_PROPERTIES_QUERY } from "@/lib/queryOptions";
import { getLatestPublishedProperties } from "@/lib/propertyListing";
import { CITIES } from "@/lib/colombia";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { to: "/explorar", icon: KeyRound, label: "Arrendar", iconClass: "text-brand-magenta" },
  { to: "/explorar?intent=compra", icon: ShoppingBag, label: "Comprar", iconClass: "text-brand-violet" },
  { to: "/anunciar", icon: Building2, label: "Publicar", iconClass: "text-foreground/70" },
];

export default function HomeMobile() {
  const navigate = useNavigate();

  const { data: properties = [], isLoading, refetch } = useQuery({
    queryKey: ["properties-featured"],
    queryFn: () => api.entities.Property.filter({ status: "disponible" }, "-listed_date", 40),
    ...FEATURED_PROPERTIES_QUERY,
  });

  const latest = getLatestPublishedProperties(properties, { limit: 6 });

  return (
    <PullToRefresh onRefresh={() => refetch()} className="flex-1 min-h-0 pb-mobile-nav native-scroll-y">
      <div className="native-screen">
      <section className="px-4 pt-safe-plus pb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-violet mb-1">Lumora Home</p>
        <h1 className="text-[1.75rem] font-extrabold leading-[1.12] tracking-tight text-foreground">
          Encuentra tu <span className="text-gradient">inmueble ideal</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Arriendos verificados en Bogotá y Barranquilla
        </p>
        <VerifiedBadge size="sm" className="mt-3" />
      </section>

      <section className="px-4 py-3">
        <button type="button" onClick={() => navigate("/explorar")} className="native-search-bar w-full">
          <Search className="w-4 h-4 text-brand-violet shrink-0" strokeWidth={2.25} />
          <span className="text-muted-foreground text-sm">Buscar por barrio o ciudad…</span>
        </button>
      </section>

      <section className="px-4 flex gap-2 overflow-x-auto native-scroll-x pb-1">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.to} to={action.to} className="native-quick-action shrink-0">
              <Icon className={cn("w-5 h-5", action.iconClass)} strokeWidth={2} />
              <span>{action.label}</span>
            </Link>
          );
        })}
      </section>

      <section className="px-4 pt-4">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
          className="app-btn-primary w-full flex items-center justify-between gap-3 px-5 py-4"
        >
          <div className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <p className="font-extrabold text-sm">Match inteligente</p>
              <p className="text-[11px] text-white/75 mt-0.5 font-medium">Inmuebles que encajan contigo</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 shrink-0 opacity-75" />
        </button>
      </section>

      <section className="px-4 pt-7 pb-2 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Recién publicados</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Verificados · {CITIES[0]?.name || "Bogotá"}</p>
        </div>
        <Link to="/explorar" className="text-xs font-bold text-brand-violet mb-0.5">
          Ver todos
        </Link>
      </section>

      <section className="px-4 pb-6 grid grid-cols-1 min-[400px]:grid-cols-2 gap-4">
        {isLoading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl shimmer" />
            ))
          : latest.map((p, i) => <PropertyAppCard key={p.id} property={p} index={i} />)}
        {!isLoading && latest.length === 0 && (
          <div className="col-span-2">
            <AppEmptyState
              icon={Home}
              title="Sin inmuebles por ahora"
              description="Estamos agregando nuevos apartamentos verificados. Mientras tanto, configura tu match."
              action={
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
                  className="app-btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Match inteligente
                </button>
              }
              secondaryAction={
                <Link to="/explorar" className="app-btn-secondary w-full py-3.5 text-sm text-center">
                  Explorar inmuebles
                </Link>
              }
            />
          </div>
        )}
      </section>
      </div>
    </PullToRefresh>
  );
}
