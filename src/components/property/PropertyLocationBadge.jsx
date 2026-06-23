import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function getPropertyLocationLines(property) {
  const neighborhood = property.neighborhood || property.locality || null;
  const city = property.city || null;
  const primary = neighborhood || city || "Ubicación por confirmar";
  const floor =
    property.floor != null && property.floor !== "" ? `Piso ${property.floor}` : null;
  const secondaryParts = [];
  if (neighborhood && city && neighborhood !== city) secondaryParts.push(city);
  if (floor) secondaryParts.push(floor);
  const secondary = secondaryParts.length ? secondaryParts.join(" · ") : null;
  return { primary, secondary };
}

export default function PropertyLocationBadge({ property, className, compact = false }) {
  const { primary, secondary } = getPropertyLocationLines(property);

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 min-w-0 rounded-xl border border-brand-violet/15",
        "bg-gradient-to-r from-brand-violet/[0.07] via-brand-violet/[0.04] to-brand-magenta/[0.06]",
        compact ? "px-2 py-1.5" : "px-2.5 py-2",
        className
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-brand-violet/10",
          compact ? "h-7 w-7" : "h-8 w-8"
        )}
        aria-hidden
      >
        <MapPin
          className={cn("text-brand-magenta", compact ? "h-3.5 w-3.5" : "h-4 w-4")}
          strokeWidth={2.25}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-extrabold text-foreground leading-tight truncate",
            compact ? "text-xs" : "text-[13px] sm:text-sm"
          )}
        >
          {primary}
        </p>
        {secondary && (
          <p
            className={cn(
              "font-medium text-muted-foreground leading-tight truncate",
              compact ? "text-[10px] mt-0.5" : "text-[11px] mt-0.5"
            )}
          >
            {secondary}
          </p>
        )}
      </div>
    </div>
  );
}
