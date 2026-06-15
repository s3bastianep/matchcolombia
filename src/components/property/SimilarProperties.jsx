import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import PropertyCard from "./PropertyCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SimilarProperties({ property }) {
  const { data: all = [] } = useQuery({
    queryKey: ["properties-similar"],
    queryFn: () => base44.entities.Property.filter({ status: "disponible" }, "-created_date", 100),
  });

  const similar = all
    .filter((p) => p.id !== property.id)
    .filter((p) => p.city === property.city || p.property_type === property.property_type)
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <section className="mt-12 pt-12 border-t border-border/40">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-violet mb-2">También te puede gustar</p>
          <h2 className="text-2xl font-extrabold">Inmuebles similares</h2>
        </div>
        <Link to={`/explorar?city=${encodeURIComponent(property.city)}`} className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-brand-violet hover:underline">
          Ver más <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {similar.map((p, i) => (
          <PropertyCard key={p.id} property={p} index={i} variant="grid" />
        ))}
      </div>
    </section>
  );
}
