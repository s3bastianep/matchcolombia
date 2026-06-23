import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import PropertyCard from "./PropertyCard";
import PropertyAppCard from "./PropertyAppCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { exploreZonePath } from "@/lib/explorePaths";

export default function SimilarProperties({ property, compact = false }) {
  const { data: all = [] } = useQuery({
    queryKey: ["properties-similar"],
    queryFn: () => api.entities.Property.filter({ status: "disponible" }, "-created_date", 100),
  });

  const similar = all
    .filter((p) => p.id !== property.id)
    .filter((p) => p.city === property.city || p.property_type === property.property_type)
    .slice(0, compact ? 6 : 3);

  if (similar.length === 0) return null;

  const exploreHref = property.neighborhood
    ? exploreZonePath(property.neighborhood)
    : "/explorar";

  return (
    <section
      className={cn(
        "border-t border-border/40",
        compact ? "px-4 py-6" : "mt-12 pt-12 site-container"
      )}
    >
      <div className={cn("flex items-end justify-between gap-3", compact ? "mb-4" : "mb-8")}>
        <div className="min-w-0">
          <p
            className={cn(
              "text-brand-violet mb-1.5",
              compact
                ? "text-[11px] font-semibold uppercase tracking-[0.14em]"
                : "text-xs font-bold uppercase tracking-widest mb-2"
            )}
          >
            También te puede gustar
          </p>
          <h2
            className={cn(
              "text-foreground",
              compact ? "text-base font-bold tracking-tight" : "text-2xl font-extrabold"
            )}
          >
            Inmuebles similares
          </h2>
        </div>
        <Link
          to={exploreHref}
          className={cn(
            "inline-flex items-center gap-1 shrink-0 text-sm font-bold text-brand-violet hover:underline",
            compact ? "text-xs" : "hidden sm:inline-flex"
          )}
        >
          Ver más <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {compact ? (
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mx-4 px-4 scrollbar-none">
          {similar.map((p) => (
            <div key={p.id} className="snap-start shrink-0 w-[min(272px,78vw)]">
              <PropertyAppCard property={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {similar.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} variant="grid" />
          ))}
        </div>
      )}
    </section>
  );
}
