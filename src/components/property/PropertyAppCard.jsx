import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Bed, Bath, Maximize, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { usePropertyPanel } from "@/lib/PropertyPanelContext";
import SmartImage from "@/components/ui/SmartImage";
import { INTERIORS, FALLBACK_IMAGE } from "@/lib/colombiaImages";
import { isInShortlist, toggleShortlist } from "@/lib/shortlist";
import { toast } from "sonner";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import { hapticLight } from "@/lib/haptics";

const formatCOP = (value) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);

function SpecItem({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-foreground/70 font-medium">
      <Icon className="w-3.5 h-3.5 shrink-0 text-foreground/45" strokeWidth={2} />
      {children}
    </span>
  );
}

export default function PropertyAppCard({ property, matchScore, showMatch, layout = "vertical", index = 0 }) {
  const navigate = useNavigate();
  const { openProperty } = usePropertyPanel();
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(isInShortlist(property.id));
  const image = property.images?.[0] || INTERIORS.sala;

  useEffect(() => {
    const handler = () => setLiked(isInShortlist(property.id));
    window.addEventListener("shortlist-updated", handler);
    return () => window.removeEventListener("shortlist-updated", handler);
  }, [property.id]);

  const toggleLike = (e) => {
    e.stopPropagation();
    hapticLight();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    const nowLiked = toggleShortlist(property.id);
    setLiked(nowLiked);
    toast.success(nowLiked ? "Guardado en tus favoritos" : "Eliminado de favoritos", {
      duration: 2000,
    });
  };

  const open = () => {
    hapticLight();
    openProperty(property);
  };

  const enterTransition = {
    duration: 0.28,
    delay: Math.min(index * 0.05, 0.25),
    ease: [0.22, 1, 0.36, 1],
  };

  if (layout === "horizontal") {
    return (
      <motion.button
        type="button"
        onClick={open}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={enterTransition}
        className="native-card w-full flex gap-3 p-3 text-left"
      >
        <div className="relative w-[88px] h-[88px] shrink-0 rounded-2xl overflow-hidden bg-muted">
          <SmartImage src={image} alt={property.title} fallback={FALLBACK_IMAGE} className="absolute inset-0" imgClassName="object-cover" />
          <div className="absolute top-1 left-1"><VerifiedBadge size="xs" /></div>
        </div>
        <CardBody property={property} liked={liked} toggleLike={toggleLike} showMatch={showMatch} matchScore={matchScore} compact />
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={open}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={enterTransition}
      className="native-card w-full overflow-hidden text-left"
    >
      <div className="relative aspect-[4/3] w-full bg-muted">
        <SmartImage src={image} alt={property.title} fallback={FALLBACK_IMAGE} className="absolute inset-0" imgClassName="object-cover" />
        <div className="absolute top-2.5 left-2.5">
          <VerifiedBadge size="xs" />
        </div>
        <button
          type="button"
          onClick={toggleLike}
          className={cn(
            "absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90",
            liked ? "bg-white text-brand-magenta" : "bg-white/95 text-foreground/55"
          )}
          aria-label="Guardar"
        >
          <Heart className={cn("w-4 h-4", liked && "fill-current")} strokeWidth={2} />
        </button>
        {showMatch && matchScore > 0 && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm text-[10px] font-bold text-white">
            <Sparkles className="w-3 h-3" />
            {matchScore}% encaje
          </span>
        )}
      </div>
      <CardBody property={property} liked={liked} toggleLike={toggleLike} showMatch={showMatch} matchScore={matchScore} />
    </motion.button>
  );
}

function CardBody({ property, liked, toggleLike, showMatch, matchScore, compact }) {
  return (
    <div className={cn("flex flex-col", compact ? "flex-1 min-w-0 py-0.5" : "p-3.5 pt-3")}>
      <div className={cn("flex items-start justify-between gap-2", compact && "relative")}>
        <div className="min-w-0 flex-1">
          <p className="price-trust text-[15px] leading-none">
            {formatCOP(property.monthly_rent)}
            {!compact && <span className="text-[11px] font-medium text-muted-foreground ml-0.5">/mes</span>}
          </p>
          <p className="text-xs font-semibold text-foreground/75 mt-1.5 flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-foreground/45" strokeWidth={2} />
            {property.neighborhood || property.city}
          </p>
        </div>
        {compact && (
          <button
            type="button"
            onClick={toggleLike}
            className={cn(
              "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              liked ? "text-brand-magenta" : "text-muted-foreground"
            )}
            aria-label="Guardar"
          >
            <Heart className={cn("w-4 h-4", liked && "fill-current")} />
          </button>
        )}
      </div>

      <p className="text-[13px] text-foreground font-medium line-clamp-1 mt-1.5 leading-snug">{property.title}</p>

      <div className="flex items-center gap-2 mt-2">
        {property.bedrooms != null && <SpecItem icon={Bed}>{property.bedrooms} hab.</SpecItem>}
        {property.bathrooms != null && (
          <>
            <span className="w-px h-3.5 bg-border shrink-0" aria-hidden />
            <SpecItem icon={Bath}>{property.bathrooms} baños</SpecItem>
          </>
        )}
        {property.area_sqm > 0 && (
          <>
            <span className="w-px h-3.5 bg-border shrink-0" aria-hidden />
            <SpecItem icon={Maximize}>{property.area_sqm} m²</SpecItem>
          </>
        )}
      </div>
    </div>
  );
}
