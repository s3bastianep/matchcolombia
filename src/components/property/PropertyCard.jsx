import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Bed, Bath, Maximize, MapPin, Sparkles, Car, PawPrint, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import SmartImage from "@/components/ui/SmartImage";
import { INTERIORS, FALLBACK_IMAGE } from "@/lib/colombiaImages";
import { isInShortlist, toggleShortlist } from "@/lib/shortlist";
import { getEstratoLabel, getEstratoChipStyle } from "@/lib/propertyLabels";
import { getParkingSpots } from "@/lib/propertyFilters";

const formatCOP = (value) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);

const formatCompactCOP = (value) => {
  if (!value) return "";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1).replace(".0", "")}M`;
  return formatCOP(value);
};

const typeColors = {
  apartamento: "bg-[hsl(340,82%,52%)]",
  casa: "bg-[hsl(168,72%,40%)]",
  estudio: "bg-[hsl(265,75%,58%)]",
  habitacion: "bg-[hsl(200,90%,50%)]",
  penthouse: "bg-[hsl(32,95%,54%)]",
  duplex: "bg-[hsl(340,82%,52%)]",
  comercial: "bg-[hsl(32,95%,54%)]",
};

const typeLabel = {
  apartamento: "Apto",
  casa: "Casa",
  estudio: "Estudio",
  habitacion: "Hab.",
  penthouse: "PH",
  duplex: "Dúplex",
  comercial: "Comercial",
};

function FeatureChip({ icon: Icon, children, className }) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border", className)}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}

export default function PropertyCard({ property, index = 0, matchScore, showMatch, variant = "default", highlighted = false }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(isInShortlist(property.id));
  const image = property.images?.[0] || INTERIORS.sala;
  const typeColor = typeColors[property.property_type] || "bg-primary";
  const isExplore = variant === "explore";
  const estratoLabel = getEstratoLabel(property.estrato);
  const parkingSpots = getParkingSpots(property);
  const pricePerSqm = property.area_sqm ? Math.round((property.monthly_rent || 0) / property.area_sqm) : null;

  useEffect(() => {
    const handler = () => setLiked(isInShortlist(property.id));
    window.addEventListener("shortlist-updated", handler);
    return () => window.removeEventListener("shortlist-updated", handler);
  }, [property.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className={cn("card-hover", highlighted && "ring-2 ring-[hsl(265,75%,58%)]/40 rounded-[1.35rem]")}
    >
      <Link to={`/propiedad/${property.id}`} className="group block">
        <article
          className={cn(
            "rounded-[1.35rem] bg-white overflow-hidden transition-all duration-300",
            isExplore
              ? "border border-[hsl(0,0%,92%)] shadow-[0_4px_24px_rgba(15,23,42,0.05)] group-hover:shadow-[0_12px_36px_rgba(15,23,42,0.09)] group-hover:-translate-y-0.5"
              : "border border-border/40 shadow-sm group-hover:shadow-xl group-hover:border-[hsl(265,75%,58%)]/25"
          )}
        >
          <div className={cn("relative overflow-hidden bg-muted", isExplore ? "aspect-[16/10]" : "aspect-[4/3]")}>
            <SmartImage
              src={image}
              alt={property.title}
              fallback={FALLBACK_IMAGE}
              className="absolute inset-0"
              imgClassName="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isAuthenticated) {
                  navigate("/login", { state: { from: window.location.pathname } });
                  return;
                }
                setLiked(toggleShortlist(property.id));
              }}
              className={cn(
                "absolute top-3.5 right-3.5 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all",
                liked ? "bg-primary text-white shadow-lg" : "bg-white/95 text-gray-400 hover:text-primary shadow-sm"
              )}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-current")} />
            </button>

            <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
              <span className={cn("px-2.5 py-1 rounded-full text-white text-[10px] font-bold shadow-sm", typeColor)}>
                {typeLabel[property.property_type] || property.property_type}
              </span>
              {showMatch && matchScore > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-extrabold text-[hsl(265,75%,50%)] shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {matchScore}% match
                </span>
              )}
            </div>

            <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex items-end justify-between gap-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold max-w-[58%] truncate">
                <MapPin className="w-3 h-3 shrink-0" />
                {property.neighborhood || property.city}
              </span>
              <div className="text-right shrink-0">
                <p className="font-extrabold text-xl text-white drop-shadow-md leading-none">{formatCOP(property.monthly_rent)}</p>
                {isExplore && property.admin_fee > 0 && (
                  <p className="text-[10px] text-white/80 font-semibold mt-0.5">+ {formatCompactCOP(property.admin_fee)} adm.</p>
                )}
              </div>
            </div>
          </div>

          <div className={cn(isExplore ? "p-4 sm:p-5" : "p-5")}>
            <h3
              className={cn(
                "font-bold text-foreground line-clamp-1 group-hover:text-[hsl(265,75%,50%)] transition-colors",
                isExplore ? "text-base" : "text-sm"
              )}
            >
              {property.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {property.city}
              {property.locality ? ` · ${property.locality}` : ""}
            </p>

            {isExplore && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {estratoLabel && (
                  <FeatureChip icon={Building2} className={getEstratoChipStyle(property.estrato)}>
                    {estratoLabel}
                  </FeatureChip>
                )}
                {parkingSpots > 0 && (
                  <FeatureChip icon={Car} className="bg-secondary text-foreground/70 border-border/50">
                    {parkingSpots} parq.
                  </FeatureChip>
                )}
                {property.pets_allowed && (
                  <FeatureChip icon={PawPrint} className="bg-[hsl(168,72%,40%)]/10 text-[hsl(168,72%,32%)] border-[hsl(168,72%,40%)]/20">
                    Mascotas
                  </FeatureChip>
                )}
                {pricePerSqm && (
                  <FeatureChip className="bg-[hsl(265,75%,58%)]/8 text-[hsl(265,75%,45%)] border-[hsl(265,75%,58%)]/15">
                    {formatCOP(pricePerSqm)}/m²
                  </FeatureChip>
                )}
              </div>
            )}

            <div
              className={cn(
                "flex items-center gap-4 text-xs text-muted-foreground",
                isExplore ? "mt-3.5 pt-3.5 border-t border-border/20" : "mt-4 pt-4 border-t border-border/30"
              )}
            >
              <span className="flex items-center gap-1.5 font-semibold text-foreground/80">
                <Bed className="w-3.5 h-3.5 text-[hsl(265,75%,58%)]" />
                {property.bedrooms} hab.
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-foreground/80">
                <Bath className="w-3.5 h-3.5 text-[hsl(200,90%,50%)]" />
                {property.bathrooms} baño{property.bathrooms !== 1 ? "s" : ""}
              </span>
              {property.area_sqm && (
                <span className="flex items-center gap-1.5 font-semibold text-foreground/80">
                  <Maximize className="w-3.5 h-3.5 text-[hsl(168,72%,40%)]" />
                  {property.area_sqm} m²
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
