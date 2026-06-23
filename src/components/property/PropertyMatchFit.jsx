import React from "react";
import { Sparkles, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  loadPreferences,
  scoreProperty,
  asSelectionList,
  propertyMatchesBedSelection,
  propertyMatchesBathSelection,
  propertyMatchesTypeSelection,
} from "@/lib/matchPreferences";
import { getTotalMonthly } from "@/lib/propertyCardUtils";
import { hasElevator } from "@/lib/propertyFilters";

function MatchRow({ ok, label }) {
  return (
    <li className={cn("flex items-center gap-2 text-xs", ok ? "text-[hsl(var(--brand-verified-fg))]" : "text-muted-foreground")}>
      {ok ? <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> : <X className="w-3.5 h-3.5 shrink-0 opacity-50" strokeWidth={2.5} />}
      <span>{label}</span>
    </li>
  );
}

export default function PropertyMatchFit({ property, className }) {
  const prefs = loadPreferences();
  if (!property || !prefs) return null;

  const score = scoreProperty(property, prefs);
  const hasQuiz =
    prefs.city ||
    asSelectionList(prefs.beds).length ||
    asSelectionList(prefs.types?.length ? prefs.types : prefs.type).length ||
    (prefs.maxPrice && prefs.maxPrice < 10000000);

  if (!hasQuiz) return null;

  const total = getTotalMonthly(property);
  const withinBudget = !property.monthly_rent || property.monthly_rent <= (prefs.maxPrice || 10000000);
  const types = asSelectionList(prefs.types?.length ? prefs.types : prefs.type);
  const typeOk = !types.length || propertyMatchesTypeSelection(property.property_type, types);
  const bedsOk = !asSelectionList(prefs.beds).length || propertyMatchesBedSelection(property.bedrooms, prefs.beds);
  const bathsOk = !asSelectionList(prefs.bathrooms).length || propertyMatchesBathSelection(property.bathrooms, prefs.bathrooms);
  const petsPref = prefs.pets === "si" || prefs.pets === true;
  const petsOk = !petsPref || property.pets_allowed;
  const elevatorOk =
    !prefs.elevator ||
    (prefs.elevator === "si" && hasElevator(property)) ||
    (prefs.elevator === "no" && !hasElevator(property));

  return (
    <div
      className={cn(
        "rounded-2xl border border-[hsl(var(--brand-verified-border))] bg-[hsl(var(--brand-verified-bg))] p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 text-sm font-extrabold text-brand-violet tabular-nums">
          <Sparkles className="w-3.5 h-3.5" />
          {score}% compatible
        </span>
        <span className="text-[11px] font-semibold text-[hsl(var(--brand-verified-fg))]/80">con tu perfil Habibar</span>
      </div>
      <ul className="space-y-1.5">
        <MatchRow ok={withinBudget} label={withinBudget ? `Cabe en tu presupuesto (total ~${total.toLocaleString("es-CO")}/mes)` : "Por encima de tu presupuesto"} />
        {types.length > 0 && <MatchRow ok={typeOk} label="Tipo de inmueble" />}
        {asSelectionList(prefs.beds).length > 0 && <MatchRow ok={bedsOk} label="Habitaciones" />}
        {asSelectionList(prefs.bathrooms).length > 0 && <MatchRow ok={bathsOk} label="Baños" />}
        {petsPref && <MatchRow ok={petsOk} label="Acepta mascotas" />}
        {prefs.elevator && <MatchRow ok={elevatorOk} label="Ascensor" />}
      </ul>
    </div>
  );
}
