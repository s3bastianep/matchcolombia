import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PropertyCard from "../property/PropertyCard";
import SectionHeader from "../ui/SectionHeader";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "Todos" },
  { id: "apartamento", label: "Apartamento" },
  { id: "casa", label: "Casa" },
  { id: "estudio", label: "Estudio" },
];

export default function FeaturedProperties({ properties, isLoading }) {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? properties : properties.filter((p) => p.property_type === tab);

  return (
    <section id="featured" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <SectionHeader
            eyebrow="Destacados"
            title="Arriendos en Bogotá y Barranquilla"
            subtitle="Inmuebles seleccionados según tu perfil de match"
          />

          <div className="flex flex-wrap gap-1.5 p-1 rounded-full bg-[hsl(240,40%,96%)] w-full sm:w-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex-1 sm:flex-none px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                  tab === t.id ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden border border-border/40">
                <div className="aspect-[4/3] shimmer" />
                <div className="p-5 space-y-2"><div className="h-5 shimmer rounded w-1/3" /><div className="h-4 shimmer rounded w-2/3" /></div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.slice(0, 6).map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No hay inmuebles de este tipo por ahora.</p>
        )}

        <div className="mt-12 flex justify-center">
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
