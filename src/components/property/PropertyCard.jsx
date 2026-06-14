import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Bed, Bath, Maximize, MapPin, Sparkles, Car, PawPrint, Building2, ChevronLeft, ChevronRight, Calendar, Sofa, CalendarCheck, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import SmartImage from "@/components/ui/SmartImage";
import { INTERIORS, FALLBACK_IMAGE } from "@/lib/colombiaImages";
import { isInShortlist, toggleShortlist } from "@/lib/shortlist";
import { getEstratoLabel, getEstratoChipStyle } from "@/lib/propertyLabels";
import { getParkingSpots, hasElevator } from "@/lib/propertyFilters";
import {
  getTotalMonthly,
  getFurnishedLabel,
  formatAvailableFrom,
} from "@/lib/propertyCardUtils";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import ElevatorIcon from "@/components/icons/ElevatorIcon";

const formatCOP = (value) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);

const formatCompactCOP = (value) => {
  if (!value) return "";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1).replace(".0", "")}M`;
  return formatCOP(value);
};

const typeColors = {
  apartamento: "bg-brand-magenta",
  casa: "bg-brand-violet",
  estudio: "bg-brand-violet",
  habitacion: "bg-brand-magenta",
  penthouse: "bg-brand-violet",
  duplex: "bg-brand-magenta",
  comercial: "bg-brand-violet",
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

function ParkingIcon({ muted }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] text-[8px] font-extrabold leading-none shrink-0",
        muted ? "bg-foreground/12 text-foreground/40" : "bg-brand-violet text-white"
      )}
      aria-hidden
    >
      P
    </span>
  );
}

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
  const elevator = hasElevator(property);
  const pricePerSqm = property.area_sqm ? Math.round((property.monthly_rent || 0) / property.area_sqm) : null;
  const totalMonthly = getTotalMonthly(property);
  const furnishedLabel = getFurnishedLabel(property.furnished);
  const availableFrom = formatAvailableFrom(property.available_from);

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
        highlighted && "ring-2 ring-brand-violet ring-offset-2",
        isGrid ? "rounded-xl" : "rounded-[1.35rem]"
      )}
    >
      <Link to={`/propiedad/${property.id}`} className="group block">
        <article
          className={cn(
            "bg-white overflow-hidden transition-all duration-300",
            isGrid
              ? "rounded-xl border border-[hsl(0,0%,92%)] group-hover:border-brand-violet/25 group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
              : "rounded-[1.35rem]",
            !isGrid && isExplore
              ? "border border-[hsl(0,0%,92%)] shadow-[0_4px_24px_rgba(15,23,42,0.05)] group-hover:shadow-[0_12px_36px_rgba(15,23,42,0.09)] group-hover:-translate-y-0.5"
              : !isGrid && "border border-border/40 shadow-sm group-hover:shadow-xl group-hover:border-brand-violet/25"
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
                  "absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all",
                  "ring-2 ring-black/20 shadow-[0_2px_8px_rgba(0,0,0,0.25)] backdrop-blur-sm",
                  liked ? "bg-primary text-white ring-primary/30" : "bg-white/95 text-gray-700 hover:text-primary hover:bg-white"
                )}
                aria-label="Guardar en favoritos"
              >
                <Heart className={cn("w-4 h-4", liked && "fill-current")} strokeWidth={2.25} />
              </button>
            )}

            {isGrid && images.length > 1 && (
              <span className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold tabular-nums">
                {photoIdx + 1}/{images.length}
              </span>
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
                <span className="px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-extrabold text-brand-violet shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {matchScore}%
                </span>
              )}
              </div>
            )}

            {isGrid && (
              <div className="absolute top-2.5 left-2.5 z-10">
                <VerifiedBadge size="card" score={showMatch && matchScore > 0 ? matchScore : undefined} />
              </div>
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
                <p className="font-extrabold text-lg sm:text-xl text-foreground leading-tight tracking-tight">
                  {formatCOP(totalMonthly)}
                  <span className="text-xs font-semibold text-muted-foreground"> / mes total</span>
                </p>
                {property.admin_fee > 0 ? (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Administración {formatCOP(property.admin_fee)}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground mt-0.5">sin administración adicional</p>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-foreground/70 mt-2.5 font-semibold">
                  {property.area_sqm && (
                    <span className="flex items-center gap-1">
                      <Maximize className="w-3 h-3 text-brand-violet" />
                      {property.area_sqm} m²
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3 text-brand-violet" />
                    {property.bedrooms} hab.
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3 h-3 text-brand-magenta" />
                    {property.bathrooms} baño{property.bathrooms !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 px-2.5 py-1.5 rounded-lg bg-[hsl(0,0%,97%)] text-[10px] font-semibold text-foreground/60">
                  <span className="flex items-center gap-1" title="Parqueadero">
                    <ParkingIcon muted={parkingSpots <= 0} />
                    {parkingSpots > 0 ? parkingSpots : "No"}
                  </span>
                  <span className="w-px h-3 bg-border/60" aria-hidden />
                  <span className="flex items-center gap-1" title="Ascensor">
                    <ElevatorIcon muted={!elevator} />
                    {elevator ? "Sí" : "No"}
                  </span>
                  <span className="w-px h-3 bg-border/60" aria-hidden />
                  <span className="flex items-center gap-1" title="Mascotas">
                    <PawPrint className="w-3.5 h-3.5 shrink-0 text-brand-magenta" strokeWidth={2.25} />
                    {property.pets_allowed ? "Sí" : "No"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {property.floor != null && property.floor !== "" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(0,0%,96%)] text-[10px] font-semibold text-foreground/70 border border-[hsl(0,0%,90%)]">
                      <Layers className="w-3 h-3 text-brand-violet shrink-0" strokeWidth={2.25} />
                      Piso {property.floor}
                    </span>
                  )}
                  {availableFrom && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(0,0%,96%)] text-[10px] font-semibold text-foreground/70 border border-[hsl(0,0%,90%)]">
                      <Calendar className="w-3 h-3 text-brand-violet shrink-0" strokeWidth={2.25} />
                      Disponible desde {availableFrom}
                    </span>
                  )}
                  {furnishedLabel && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(0,0%,96%)] text-[10px] font-semibold text-foreground/70 border border-[hsl(0,0%,90%)]">
                      <Sofa className="w-3 h-3 text-brand-violet shrink-0" strokeWidth={2.25} />
                      {furnishedLabel}
                    </span>
                  )}
                </div>

                <div className="mt-2.5">
                  <p className="text-sm sm:text-base font-bold text-foreground line-clamp-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-magenta" />
                    {property.neighborhood || property.locality || "Zona"}
                  </p>
                  {property.city && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 pl-5">{property.city}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/propiedad/${property.id}?visita=1`);
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 gradient-cta text-white text-xs font-bold py-2.5 rounded-lg hover:opacity-95 transition-opacity"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Agendar visita
                </button>
              </>
            )}
            <h3
              className={cn(
                "font-bold text-foreground line-clamp-1 group-hover:text-brand-violet transition-colors",
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
                  <FeatureChip icon={PawPrint} className="bg-brand-magenta/10 text-brand-magenta border-brand-magenta/20">
                    Mascotas
                  </FeatureChip>
                )}
                {pricePerSqm && (
                  <FeatureChip className="bg-brand-violet/8 text-brand-violet border-brand-violet/15">
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
                <Bed className="w-3.5 h-3.5 text-brand-violet" />
                {property.bedrooms} hab.
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-foreground/80">
                <Bath className="w-3.5 h-3.5 text-brand-magenta" />
                {property.bathrooms} baño{property.bathrooms !== 1 ? "s" : ""}
              </span>
              {property.area_sqm && (
                <span className="flex items-center gap-1.5 font-semibold text-foreground/80">
                  <Maximize className="w-3.5 h-3.5 text-brand-violet" />
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
