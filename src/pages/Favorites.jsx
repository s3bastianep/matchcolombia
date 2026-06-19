import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import PropertyCard from "../components/property/PropertyCard";
import PropertyAppCard from "../components/property/PropertyAppCard";
import PullToRefresh from "../components/mobile/PullToRefresh";
import AppEmptyState from "../components/mobile/AppEmptyState";
import CompareStrip from "../components/favorites/CompareStrip";
import { getShortlist } from "@/lib/shortlist";
import { FAVORITES_EMPTY_HINT, FAVORITES_EMPTY_TITLE } from "@/lib/siteCopy";

export default function Favorites() {
  const [ids, setIds] = useState(getShortlist());

  useEffect(() => {
    const refresh = () => setIds(getShortlist());
    window.addEventListener("shortlist-updated", refresh);
    return () => window.removeEventListener("shortlist-updated", refresh);
  }, []);

  const { data: allProperties = [], refetch } = useQuery({
    queryKey: ["properties-shortlist"],
    queryFn: () => api.entities.Property.filter({ status: "disponible" }, "-created_date", 100),
  });

  const saved = allProperties.filter((p) => ids.includes(p.id));

  return (
    <>
      <PullToRefresh onRefresh={() => refetch()} className="lg:hidden native-screen min-h-[calc(100dvh-8rem)] pb-mobile-nav native-scroll-y">
        {saved.length > 0 ? (
          <div className="px-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-extrabold text-foreground">{saved.length}</span>{" "}
              guardado{saved.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-4">
              {saved.map((p, i) => (
                <PropertyAppCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <AppEmptyState
            icon={Heart}
            title={FAVORITES_EMPTY_TITLE}
            description={FAVORITES_EMPTY_HINT}
            action={
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
                className="app-btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Match inteligente
              </button>
            }
            secondaryAction={
              <Link to="/explorar" className="app-btn-secondary w-full py-3.5 text-sm text-center flex items-center justify-center gap-1">
                Explorar inmuebles <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        )}
      </PullToRefresh>

      <div className="hidden lg:block min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-violet/10 text-brand-violet text-xs font-bold uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5" />
              Mis guardados
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Mis <span className="text-gradient">guardados</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {saved.length} inmueble{saved.length !== 1 ? "s" : ""}. Compara y nos escribes cuando quieras avanzar.
            </p>
          </div>

          {saved.length > 0 ? (
            <>
              <CompareStrip properties={saved} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {saved.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} variant="grid" />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-brand-violet/20 bg-white text-center">
              <Heart className="w-14 h-14 text-brand-violet/30 mb-4" />
              <h2 className="font-extrabold text-xl mb-2">{FAVORITES_EMPTY_TITLE}</h2>
              <p className="text-muted-foreground text-sm max-w-sm mb-6">{FAVORITES_EMPTY_HINT}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
                  className="rounded-xl gap-2 font-bold gradient-cta text-white px-6 py-3 flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4" />
                  Match inteligente
                </button>
                <Link to="/explorar" className="rounded-xl gap-2 font-semibold border-2 px-6 py-3 flex items-center justify-center">
                  Explorar <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
