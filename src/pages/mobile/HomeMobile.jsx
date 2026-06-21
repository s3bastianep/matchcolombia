import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Building2, Sparkles, ArrowRight, Home, ShieldCheck } from "lucide-react";
import { api } from "@/api/apiClient";
import PropertyAppCard from "@/components/property/PropertyAppCard";
import PullToRefresh from "@/components/mobile/PullToRefresh";
import AppEmptyState from "@/components/mobile/AppEmptyState";
import { FEATURED_PROPERTIES_QUERY } from "@/lib/queryOptions";
import { getLatestPublishedProperties } from "@/lib/propertyListing";
import { CITIES } from "@/lib/colombia";

const openQuiz = () => window.dispatchEvent(new CustomEvent("open-match-quiz"));

export default function HomeMobile() {
  const { data: properties = [], isLoading, refetch } = useQuery({
    queryKey: ["properties-featured"],
    queryFn: () => api.entities.Property.filter({ status: "disponible" }, "-listed_date", 40),
    ...FEATURED_PROPERTIES_QUERY,
  });

  const latest = getLatestPublishedProperties(properties, { limit: 6 });

  return (
    <PullToRefresh onRefresh={() => refetch()} className="flex-1 min-h-0 pb-mobile-nav native-scroll-y">
      <div className="native-screen relative">
        <div className="absolute inset-x-0 top-0 h-48 gradient-hero opacity-50 pointer-events-none" />

        <section className="relative px-4 pt-safe-plus pb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-violet mb-1">
            Arriendos verificados · Bogotá
          </p>
          <h1 className="text-[1.65rem] font-extrabold leading-[1.12] tracking-tight text-foreground">
            Encuentra tu inmueble.
            <br />
            <span className="text-gradient">O arriéndalo sin estrés.</span>
          </h1>
        </section>

        <section className="px-4 pb-3">
          <div className="native-card overflow-hidden border border-brand-violet/15">
            <div className="color-bar h-[2px] w-full" />
            <div className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-cta shrink-0">
                  <Sparkles className="w-5 h-5 text-white" strokeWidth={2.25} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-violet">Lo nuestro</p>
                  <p className="font-extrabold text-base leading-tight mt-0.5">Match inteligente</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Cuestionario personalizado · inmuebles verificados
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openQuiz}
                className="app-btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Iniciar match inteligente
              </button>
              <Link to="/explorar" className="block text-center text-xs font-semibold text-muted-foreground mt-3">
                o explorar todos los arriendos
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 grid grid-cols-2 gap-2.5 pb-2">
          <Link
            to="/explorar"
            className="native-card flex flex-col p-3.5 min-h-[100px] border-2 border-brand-violet/35 shadow-md shadow-brand-violet/10"
          >
            <Search className="w-5 h-5 text-brand-violet mb-2" strokeWidth={2.25} />
            <span className="font-extrabold text-sm leading-tight">Busco inmueble</span>
            <span className="text-[11px] text-brand-violet font-bold mt-auto pt-2 inline-flex items-center gap-1">
              Explorar <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
          <Link
            to="/anunciar"
            className="flex flex-col p-3.5 min-h-[100px] rounded-2xl gradient-cta text-white shadow-md"
          >
            <Building2 className="w-5 h-5 mb-2 opacity-90" strokeWidth={2.25} />
            <span className="font-extrabold text-sm leading-tight">Tengo inmueble</span>
            <span className="text-[11px] text-white/80 font-bold mt-auto pt-2 inline-flex items-center gap-1">
              Anunciar <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </section>

        <section className="px-4 pb-4">
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-verified shrink-0" strokeWidth={2.25} />
            Verificados · Contrato digital · Equipo en Bogotá
          </p>
        </section>

        <section className="px-4 pt-4 pb-2 flex items-end justify-between">
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
                description="Estamos agregando nuevos apartamentos verificados. Mientras tanto, inicia tu match."
                action={
                  <button
                    type="button"
                    onClick={openQuiz}
                    className="app-btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Iniciar match inteligente
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
