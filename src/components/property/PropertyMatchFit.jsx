import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadPreferences } from "@/lib/matchPreferences";
import { buildPropertyMatchFit } from "@/lib/propertyMatchFit";

function MatchRow({ ok, label }) {
  return (
    <li className={cn("flex items-start gap-2 text-xs", ok ? "text-[hsl(var(--brand-verified-fg))]" : "text-muted-foreground")}>
      {ok ? (
        <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={2.5} />
      ) : (
        <X className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-50" strokeWidth={2.5} />
      )}
      <span className="leading-snug">{label}</span>
    </li>
  );
}

export default function PropertyMatchFit({ property, className }) {
  const [searchParams] = useSearchParams();
  const fit = useMemo(
    () => buildPropertyMatchFit(property, loadPreferences(), searchParams),
    [property, searchParams]
  );

  if (!fit?.hasCriteria || !fit.rows.length) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[hsl(var(--brand-verified-border))] bg-[hsl(var(--brand-verified-bg))] p-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 text-sm font-extrabold text-brand-violet tabular-nums">
          <Sparkles className="w-3.5 h-3.5" />
          {fit.score}% de encaje
        </span>
        <span className="text-[11px] font-semibold text-[hsl(var(--brand-verified-fg))]/80">
          con lo que buscas ({fit.matched}/{fit.total})
        </span>
      </div>
      <ul className="space-y-1.5">
        {fit.rows.map((row, i) => (
          <MatchRow key={`${i}-${row.label}`} ok={row.ok} label={row.label} />
        ))}
      </ul>
    </div>
  );
}
