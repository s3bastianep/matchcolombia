import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { KeyRound, Building2, Home, Sparkles, ArrowRight } from "lucide-react";
import { api } from "@/api/apiClient";
import PropertyAppCard from "@/components/property/PropertyAppCard";
import PullToRefresh from "@/components/mobile/PullToRefresh";
import AppEmptyState from "@/components/mobile/AppEmptyState";
import HomeSearchBar from "@/components/search/HomeSearchBar";
import HumanSupportBanner from "@/components/brand/HumanSupportBanner";
import { FEATURED_PROPERTIES_QUERY } from "@/lib/queryOptions";
import { getLatestPublishedProperties } from "@/lib/propertyListing";
import { loadPreferences, scoreProperty } from "@/lib/matchPreferences";
import { CITIES } from "@/lib/colombia";
import { cn } from "@/lib/utils";

const openQuiz = () => window.dispatchEvent(new CustomEvent("open-habibar-quiz"));

function ActionCard({
  as: Component = "button",
  to,
  onClick,
  icon: Icon,
  title,
  subtitle,
  iconClassName,
  className,
  ...props
}) {
  const content = (
    <>
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
          iconClassName
        )}
      >
        <Icon className="size-[18px]" strokeWidth={2.25} />
      </span>
      <span className="flex-1 min-w-0 text-left">
        <span className="block text-sm font-extrabold text-foreground leading-tight">{title}</span>
        {subtitle && (
          <span className="block text-xs font-medium text-muted-foreground mt-0.5 leading-snug">
            {subtitle}
          </span>
        )}
      </span>
      <ArrowRight className="size-4 text-brand-violet shrink-0" strokeWidth={2.5} />
    </>
  );

  const cardClass = cn(
    "native-card w-full flex items-center gap-3 p-4 active:scale-[0.99] transition-transform",
    className
  );

  if (Component === Link) {
    return (
      <Link to={to} className={cardClass} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cardClass} {...props}>
      {content}
    </button>
  );
}

export default function HomeMobile() {
  const prefs = useMemo(() => loadPreferences(), []);

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

        <section className="relative px-5 pt-4 pb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-violet mb-2">
            Inmuebles verificados en Bogotá
          </p>
          <h1 className="text-[1.5rem] font-extrabold leading-[1.2] tracking-tight text-foreground mb-4">
            Encuentra tu inmueble{" "}
            <span className="text-gradient">o arriéndalo sin estrés.</span>
          </h1>
          <HomeSearchBar compact />
        </section>

        <section className="px-5 pb-3">
          <HumanSupportBanner />
        </section>

        <section className="px-5 pb-2 flex flex-col gap-2.5">
          <ActionCard
            as={Link}
            to="/explorar"
            icon={KeyRound}
            title="Arrendar"
            subtitle="Apartamentos y casas en Bogotá"
            iconClassName="bg-brand-violet/10 text-brand-violet"
            className="border border-border/70 bg-white"
          />
          <ActionCard
            as={Link}
            to="/explorar?intent=compra"
            icon={Home}
            title="Comprar"
            subtitle="Inmuebles en venta"
            iconClassName="bg-brand-violet/10 text-brand-violet"
            className="border border-brand-violet/20 bg-brand-violet/[0.04]"
          />
          <ActionCard
            as={Link}
            to="/anunciar"
            icon={Building2}
            title="Anunciar inmueble"
            subtitle="Publica gratis con nuestro equipo"
            iconClassName="bg-brand-magenta/10 text-brand-magenta"
            className="border border-brand-magenta/20 bg-brand-magenta/[0.04]"
          />
          <ActionCard
            icon={Sparkles}
            title="Cuestionario Habibar"
            subtitle="Te recomendamos inmuebles a tu medida"
            iconClassName="gradient-cta text-white shadow-sm"
            className="border border-brand-violet/15 bg-gradient-to-r from-brand-violet/[0.07] to-brand-magenta/[0.05]"
            onClick={openQuiz}
          />
        </section>

        <div className="mx-5 border-t border-border/40" />

        <section className="px-5 pt-6 pb-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold tracking-tight">Recién publicados</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Nuevas opciones en {CITIES[0]?.name || "Bogotá"}
            </p>
          </div>
          <Link to="/explorar" className="text-xs font-bold text-brand-violet shrink-0 mb-0.5">
            Ver todos
          </Link>
        </section>

        <section className="px-5 pb-8 grid grid-cols-1 min-[400px]:grid-cols-2 gap-4">
          {isLoading
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-2xl shimmer" />
              ))
            : latest.map((p, i) => {
                const matchScore = prefs ? scoreProperty(p, prefs) : 0;
                return (
                  <PropertyAppCard
                    key={p.id}
                    property={p}
                    index={i}
                    showMatch={Boolean(prefs && matchScore >= 40)}
                    matchScore={matchScore}
                  />
                );
              })}
          {!isLoading && latest.length === 0 && (
            <div className="col-span-2">
              <AppEmptyState
                icon={Building2}
                title="Sin inmuebles por ahora"
                description="Estamos agregando nuevos apartamentos verificados. Mientras tanto, puedes iniciar el cuestionario Habibar."
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
