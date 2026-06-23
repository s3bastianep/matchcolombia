import React from "react";
import { ShieldCheck, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { isPropertyVerified } from "@/lib/propertyTrust";

/**
 * Badge exclusivo mint/turquesa — solo para confianza / verificado.
 */
export default function VerifiedBadge({
  property,
  verified,
  score,
  className,
  size = "sm",
  showTooltip = true,
  matchOnly = false,
}) {
  const isVerified = verified ?? (property != null ? isPropertyVerified(property) : true);

  if (matchOnly || (score != null && score > 0 && !isVerified)) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/55 backdrop-blur-sm text-[10px] font-bold text-white",
          className
        )}
      >
        <Sparkles className="w-3 h-3" />
        {score}% encaje
      </span>
    );
  }

  if (!isVerified) return null;

  const useShield = size === "card" || size === "md";
  const Icon = useShield ? ShieldCheck : Check;

  return (
    <span
      title={showTooltip ? `Propietario verificado por ${BRAND.name}. Inmueble revisado por nuestro equipo` : undefined}
      aria-label="Inmueble verificado"
      className={cn(
        "badge-verified",
        size === "xs" && "text-[9px] px-2 py-0.5 gap-0.5",
        size === "sm" && "text-[10px] px-2.5 py-1 gap-1",
        size === "md" && "text-xs px-3 py-1.5 gap-1.5 font-extrabold shadow-sm",
        size === "card" && "badge-verified-card",
        className
      )}
    >
      <Icon className={cn("shrink-0", size === "card" || size === "md" ? "w-3.5 h-3.5" : "w-3 h-3")} strokeWidth={2.75} />
      <span>Verificado</span>
      {score != null && score > 0 && (
        <span className="font-semibold opacity-80 tabular-nums">{score}%</span>
      )}
    </span>
  );
}
