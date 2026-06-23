import React, { useState, useEffect, memo } from "react";
import { Heart, Bed, Bath, Maximize, Sparkles, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePropertyPanelActions } from "@/lib/PropertyPanelContext";
import SmartImage from "@/components/ui/SmartImage";
import { INTERIORS, FALLBACK_IMAGE } from "@/lib/colombiaImages";
import { isInShortlist, toggleShortlist } from "@/lib/shortlist";
import { toast } from "sonner";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import { isPropertyVerified } from "@/lib/propertyTrust";
import { getPropertyPricing } from "@/lib/propertyPricing";
import { hapticLight } from "@/lib/haptics";
import PropertyLocationBadge from "@/components/property/PropertyLocationBadge";
import { hasPropertyVideo } from "@/lib/propertyVideo";

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

function PropertyAppCard({ property, matchScore, showMatch, layout = "vertical" }) {
  const { openProperty } = usePropertyPanelActions();
  const [liked, setLiked] = useState(() => isInShortlist(property.id));
  const image = property.images?.[0] || INTERIORS.sala;
  const showVideo = hasPropertyVideo(property);

  useEffect(() => {
    const handler = (e) => {
      const changedId = e.detail?.propertyId;
      if (changedId && changedId !== property.id) return;
      setLiked(isInShortlist(property.id));
    };
    window.addEventListener("shortlist-updated", handler);
    return () => window.removeEventListener("shortlist-updated", handler);
  }, [property.id]);

  const toggleLike = (e) => {
    e.stopPropagation();
    hapticLight();
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

  if (layout === "horizontal") {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
        className="native-card native-card-perf w-full flex gap-3 p-3 text-left cursor-pointer"
      >
        <div className="relative w-[88px] h-[88px] shrink-0 rounded-2xl overflow-hidden bg-muted">
          <SmartImage
            src={image}
            alt={property.title}
            fallback={FALLBACK_IMAGE}
            variant="card"
            className="absolute inset-0"
            imgClassName="object-cover"
          />
          {isPropertyVerified(property) && (
            <div className="absolute top-1 left-1">
              <VerifiedBadge property={property} size="xs" />
            </div>
          )}
        </div>
        <CardBody property={property} liked={liked} toggleLike={toggleLike} showMatch={showMatch} matchScore={matchScore} compact />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
      className="native-card native-card-perf w-full overflow-hidden text-left cursor-pointer"
    >
      <div className="relative aspect-[4/3] w-full bg-muted">
        <SmartImage
          src={image}
          alt={property.title}
          fallback={FALLBACK_IMAGE}
          variant="card"
          className="absolute inset-0"
          imgClassName="object-cover"
        />
        <div className="absolute top-2.5 left-2.5">
          <VerifiedBadge property={property} size="xs" />
        </div>
        <button
          type="button"
          onClick={toggleLike}
          className={cn(
            "absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90",
            liked ? "bg-white text-brand-magenta" : "bg-white text-foreground/55"
          )}
          aria-label="Guardar"
        >
          <Heart className={cn("w-4 h-4", liked && "fill-current")} strokeWidth={2} />
        </button>
        {showVideo && (
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/65 text-[10px] font-bold text-white">
            <Play className="w-3 h-3 fill-current" strokeWidth={0} />
            Video
          </span>
        )}
        {showMatch && matchScore > 0 && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/65 text-[10px] font-bold text-white">
            <Sparkles className="w-3 h-3" />
            {matchScore}% encaje
          </span>
        )}
      </div>
      <CardBody property={property} liked={liked} toggleLike={toggleLike} showMatch={showMatch} matchScore={matchScore} />
    </div>
  );
}

function CardBody({ property, liked, toggleLike, showMatch, matchScore, compact }) {
  const { rent, admin, totalMonthly, isSale, salePrice } = getPropertyPricing(property);

  return (
    <div className={cn("flex flex-col", compact ? "flex-1 min-w-0 py-0.5" : "p-3.5 pt-3")}>
      <div className={cn("flex items-start justify-between gap-2", compact && "relative")}>
        <div className="min-w-0 flex-1">
          <p className="price-trust text-[15px] leading-none">
            {formatCOP(isSale ? salePrice : totalMonthly || rent)}
            {!isSale && <span className="text-[11px] font-medium text-muted-foreground ml-0.5">/mes</span>}
          </p>
          {!isSale && admin > 0 && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Arriendo {formatCOP(rent)} + admin {formatCOP(admin)}
            </p>
          )}
          <PropertyLocationBadge property={property} className="mt-2" compact={compact} />
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

export default memo(PropertyAppCard);
