import React from "react";
import { ShieldCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Badge exclusivo mint/turquesa — solo para confianza / verificado.
 * No reutilizar este color para otros estados o decoración.
 */
export default function VerifiedBadge({ score, className, size = "sm", showTooltip = true }) {
  const useShield = size === "card" || size === "md";
  const Icon = useShield ? ShieldCheck : Check;

  return (
    <span
      title={showTooltip ? "Propietario verificado por MatchColombia — inmueble revisado por nuestro equipo" : undefined}
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
