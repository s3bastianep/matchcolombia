import React from "react";
import { motion } from "framer-motion";
import { MapPin, X, ChevronRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { FALLBACK_IMAGE } from "@/lib/colombiaImages";
import { getTotalMonthly } from "@/lib/propertyFilters";
import { cn } from "@/lib/utils";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function MapPropertyPreview({ property, onOpen, onClose, className }) {
  if (!property) return null;
  const total = getTotalMonthly(property);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ type: "spring", damping: 28, stiffness: 320 }}
      className={cn(
        "flex gap-3 p-3 rounded-2xl bg-white shadow-[0_8px_32px_rgba(15,23,42,0.14)] border border-border/40",
        className
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 min-w-0 gap-3 text-left active:opacity-80 transition-opacity"
      >
        <div className="relative w-[88px] h-[72px] shrink-0 rounded-xl overflow-hidden bg-muted">
          <SmartImage
            src={property.images?.[0]}
            alt={property.title}
            fallback={FALLBACK_IMAGE}
            className="absolute inset-0"
            imgClassName="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
          <p className="font-extrabold text-base leading-none tabular-nums text-foreground">
            {formatCOP(total || property.monthly_rent)}
            <span className="text-xs font-medium text-muted-foreground ml-0.5">/mes</span>
          </p>
          <p className="text-xs font-medium text-foreground/80 mt-1 line-clamp-1">{property.title}</p>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            {property.neighborhood} · {property.city}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 self-center" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shrink-0 self-start"
        aria-label="Cerrar"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
