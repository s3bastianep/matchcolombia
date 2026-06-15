import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/api/apiClient";
import PropertyCard from "../property/PropertyCard";
import { BRAND } from "@/lib/brand";
import VerifiedBadge from "../brand/VerifiedBadge";
import SectionHeader from "../ui/SectionHeader";
import { cn } from "@/lib/utils";
import { FEATURED_PROPERTIES_QUERY } from "@/lib/queryOptions";
import { getLatestPublishedProperties } from "@/lib/propertyListing";

const TABS = [
  { id: "all", label: "Todos" },
  { id: "apartamento", label: "Apartamento" },
  { id: "casa", label: "Casa" },
  { id: "estudio", label: "Estudio" },
];

const FEATURED_POOL_SIZE = 60;
const FEATURED_VISIBLE = 8;

export default function FeaturedProperties() {
  const [tab, setTab] = useState("all");
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties-featured"],
    queryFn: () =>
      api.entities.Property.filter({ status: "disponible" }, "-listed_date", FEATURED_POOL_SIZE),
    ...FEATURED_PROPERTIES_QUERY,
  });

  useEffect(() => {
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["properties-featured"] });
    };
    window.addEventListener("properties-updated", refresh);
    return () => window.removeEventListener("properties-updated", refresh);
  }, [queryClient]);

  const latest = useMemo(
    () => getLatestPublishedProperties(properties, { type: tab, limit: FEATURED_VISIBLE }),
    [properties, tab]
  );

  const scroll = (dir) => {
    const el = document.getElementById("featured-carousel");
    if (el) el.scrollBy({ left: dir * 336, behavior: "smooth" });
  };

  return (
    <section id="featured" className="section-pad bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <SectionHeader
              eyebrow="Nuevas publicaciones"
              title="Inmuebles verificados"
              subtitle={`Las últimas publicaciones revisadas por ${BRAND.name}. Sin estafas, sin sustos.`}
            />
            <VerifiedBadge size="sm" className="w-fit" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-1.5 p-1 rounded-full bg-white border border-border/50 w-full sm:w-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex-1 sm:flex-none px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                    tab === t.id ? "bg-foreground text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex gap-1 shrink-0">
              <button type="button" onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-border/60 bg-white flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Anterior">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => scroll(1)} className="w-9 h-9 rounded-full border border-border/60 bg-white flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Siguiente">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-5 overflow-hidden">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="shrink-0 w-[min(300px,88vw)] sm:w-[320px] rounded-xl overflow-hidden border border-[hsl(0,0%,92%)] bg-white">
                <div className="p-3">
                  <div className="aspect-[5/4] shimmer rounded-lg" />
                </div>
                <div className="px-3 pb-3 space-y-2">
                  <div className="h-5 shimmer rounded w-1/2" />
                  <div className="h-16 shimmer rounded-lg w-full" />
                  <div className="h-4 shimmer rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            key={tab}
            id="featured-carousel"
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scroll-smooth animate-in fade-in duration-300 items-stretch"
          >
            {latest.map((p, i) => (
              <div key={p.id} className="snap-start shrink-0 w-[min(300px,88vw)] sm:w-[320px] self-stretch flex flex-col">
                <PropertyCard property={p} index={i} variant="grid" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && latest.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No hay inmuebles de este tipo por ahora.</p>
        )}

        <div className="mt-10 flex justify-center">
          <Link to="/explorar">
            <button className="group flex items-center gap-2.5 gradient-cta btn-glow text-white font-bold px-8 py-4 rounded-full hover:opacity-95 transition-opacity">
              Ver todos los arriendos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
