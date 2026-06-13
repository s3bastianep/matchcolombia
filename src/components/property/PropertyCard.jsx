import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Bed, Bath, Maximize, MapPin, Sparkles, Car, PawPrint, Building2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const images = property.images?.length ? property.images : [INTERIORS.sala];
  const [photoIdx, setPhotoIdx] = useState(0);
  const image = images[photoIdx] || INTERIORS.sala;
  const typeColor = typeColors[property.property_type] || "bg-primary";
  const isGrid = variant === "grid";
  const isExplore = variant === "explore" || isGrid;
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
      className={cn(
        "card-hover",
        highlighted && "ring-2 ring-[hsl(265,75%,58%)] ring-offset-2",
        isGrid ? "rounded-xl" : "rounded-[1.35rem]"
      )}
    >
      <Link to={`/propiedad/${property.id}`} className="group block">
        <article
          className={cn(
            "bg-white overflow-hidden transition-all duration-300",
            isGrid
              ? "rounded-xl border border-[hsl(0,0%,92%)] group-hover:border-[hsl(265,75%,58%)]/25 group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
              : "rounded-[1.35rem]",
            !isGrid && isExplore
              ? "border border-[hsl(0,0%,92%)] shadow-[0_4px_24px_rgba(15,23,42,0.05)] group-hover:shadow-[0_12px_36px_rgba(15,23,42,0.09)] group-hover:-translate-y-0.5"
              : !isGrid && "border border-border/40 shadow-sm group-hover:shadow-xl group-hover:border-[hsl(265,75%,58%)]/25"
          )}
        >
          <div className={cn("relative overflow-hidden bg-muted", isGrid ? "aspect-[5/4] rounded-t-xl" : isExplore ? "aspect-[16/10]" : "aspect-[4/3]")}>
            <SmartImage
              src={image}
              alt={property.title}
              fallback={FALLBACK_IMAGE}
              className="absolute inset-0"
              imgClassName="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
            {!isGrid && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />}

            {!isGrid && (
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
            )}

            {isGrid && (
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
                  "absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all shadow-sm",
                  liked ? "bg-primary text-white" : "bg-white/95 text-gray-400 hover:text-primary"
                )}
                aria-label="Guardar en favoritos"
              >
                <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} />
              </button>
            )}

            {isGrid && images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPhotoIdx((i) => (i - 1 + images.length) % images.length);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground/70" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPhotoIdx((i) => (i + 1) % images.length);
                  }}
                  className="absolute right-10 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="w-4 h-4 text-foreground/70" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
                  {images.slice(0, 5).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        i === photoIdx ? "bg-white scale-110" : "bg-white/50"
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            {!isGrid && (
              <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
                <span className={cn("px-2.5 py-1 rounded-full text-white text-[10px] font-bold shadow-sm", typeColor)}>
                  {typeLabel[property.property_type] || property.property_type}
                </span>
                {showMatch && matchScore > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-extrabold text-[hsl(265,75%,50%)] shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {matchScore}% · verificado
                  </span>
                )}
              </div>
            )}

            {isGrid && showMatch && matchScore > 0 && (
              <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-extrabold text-[hsl(265,75%,50%)] shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {matchScore}%
              </span>
            )}

            {!isGrid && (
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
            )}
          </div>

          <div className={cn(isGrid ? "px-3 pt-3 pb-3.5" : isExplore ? "p-4 sm:p-5" : "p-5")}>
            {isGrid && (
              <>
                <p className="font-extrabold text-base text-foreground leading-tight tracking-tight">
                  {formatCOP(property.monthly_rent)}
                  <span className="text-xs font-semibold text-muted-foreground"> / mes</span>
                </p>
                {property.admin_fee > 0 && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatCOP(property.admin_fee)} administración aprox.
                  </p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-foreground/70 mt-2.5 font-semibold">
                  {property.area_sqm && (
                    <span className="flex items-center gap-1">
                      <Maximize className="w-3 h-3 text-[hsl(168,72%,40%)]" />
                      {property.area_sqm} m²
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3 text-[hsl(265,75%,58%)]" />
                    {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3 h-3 text-[hsl(200,90%,50%)]" />
                    {property.bathrooms}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0 text-[hsl(340,82%,52%)]" />
                  <span>
                    {typeLabel[property.property_type] || "Inmueble"}
                    {property.neighborhood ? ` ${property.neighborhood}` : ""}
                    {property.city ? `, ${property.city}` : ""}
                  </span>
                </p>
              </>
            )}
            <h3
              className={cn(
                "font-bold text-foreground line-clamp-1 group-hover:text-[hsl(265,75%,50%)] transition-colors",
                isGrid ? "hidden" : isExplore ? "text-base" : "text-sm"
              )}
            >
              {property.title}
            </h3>
            {!isGrid && (
              <p className="text-xs text-muted-foreground mt-1">
                {property.city}
                {property.locality ? ` · ${property.locality}` : ""}
              </p>
            )}

            {isExplore && !isGrid && (
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
                isGrid && "hidden",
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
