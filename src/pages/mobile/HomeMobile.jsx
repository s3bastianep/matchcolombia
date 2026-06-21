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
import { cn } from "@/lib/utils";

const openQuiz = () => window.dispatchEvent(new CustomEvent("open-habibar-quiz"));

function PathCard({ to, icon: Icon, title, cta, variant = "renter" }) {
  const isOwner = variant === "owner";

  return (
    <Link
      to={to}
      className={cn(
        "native-card flex items-center gap-3 p-4 min-h-[72px] transition-colors",
        isOwner
          ? "border border-brand-magenta/25 bg-brand-magenta/[0.04]"
          : "border border-border/70 bg-white"
      )}
    >
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
          isOwner ? "bg-brand-magenta/10 text-brand-magenta" : "bg-brand-violet/10 text-brand-violet"
        )}
      >
        <Icon className="size-[18px]" strokeWidth={2.25} />
      </span>
      <span className="font-bold text-sm flex-1 min-w-0">{title}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-bold shrink-0",
          isOwner ? "text-brand-magenta" : "text-brand-violet"
        )}
      >
        {cta}
        <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}

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
        <div className="absolute inset-x-0 top-0 h-36 gradient-hero opacity-20 pointer-events-none" />

        <section className="relative px-5 pt-4 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-violet mb-2.5">
            Arriendos verificados · Bogotá
          </p>
          <h1 className="text-[1.55rem] font-extrabold leading-[1.15] tracking-tight text-foreground">
            Encuentra tu inmueble.
            <br />
            <span className="text-gradient">O arriéndalo sin estrés.</span>
          </h1>
        </section>

        <section className="px-5 pt-4 pb-2">
          <div className="native-card overflow-hidden border border-border/60 bg-white/95">
            <div className="color-bar h-[2px] w-full" />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex size-10 items-center justify-center rounded-xl gradient-cta shrink-0">
                  <Sparkles className="size-[18px] text-white" strokeWidth={2.25} />
                </span>
                <div className="min-w-0">
                  <p className="font-extrabold text-base leading-tight">Cuestionario Habibar</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Inmuebles verificados según lo que buscas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openQuiz}
                className="app-btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="size-4" />
                Iniciar cuestionario
              </button>
              <Link to="/explorar" className="block text-center text-xs font-medium text-muted-foreground mt-4">
                o explorar todos los arriendos
              </Link>
            </div>
          </div>
        </section>

        <section className="px-5 pt-3 pb-2 flex flex-col gap-3">
          <PathCard to="/explorar" icon={Search} title="Busco inmueble" cta="Explorar" />
          <PathCard to="/anunciar" icon={Building2} title="Tengo inmueble" cta="Anunciar" variant="owner" />
        </section>

        <section className="px-5 py-5">
          <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-brand-verified shrink-0" strokeWidth={2.25} />
            Verificados · Contrato digital · Equipo en Bogotá
          </p>
        </section>

        <div className="mx-5 border-t border-border/40" />

        <section className="px-5 pt-6 pb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Recién publicados</h2>
            <p className="text-xs text-muted-foreground mt-1">Verificados · {CITIES[0]?.name || "Bogotá"}</p>
          </div>
          <Link to="/explorar" className="text-xs font-bold text-brand-violet mb-0.5">
            Ver todos
          </Link>
        </section>

        <section className="px-5 pb-8 grid grid-cols-1 min-[400px]:grid-cols-2 gap-4">
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
                description="Estamos agregando nuevos apartamentos verificados. Mientras tanto, inicia el cuestionario Habibar."
                action={
                  <button
                    type="button"
                    onClick={openQuiz}
                    className="app-btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="size-4" />
                    Iniciar cuestionario
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
