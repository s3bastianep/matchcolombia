import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { savePreferences, buildExploreUrl } from "@/lib/matchPreferences";
import { CITIES } from "@/lib/colombia";
import { cn } from "@/lib/utils";

const BEDS = [
  { value: "all", label: "Cualquiera" },
  { value: "1", label: "1 hab." },
  { value: "2", label: "2 hab." },
  { value: "3", label: "3 hab." },
  { value: "4", label: "4+ hab." },
];

const BUDGETS = [
  { value: "all", label: "Sin límite", max: 10000000 },
  { value: "1000000", label: "Hasta $1M", max: 1000000 },
  { value: "2000000", label: "Hasta $2M", max: 2000000 },
  { value: "3000000", label: "Hasta $3M", max: 3000000 },
  { value: "5000000", label: "Hasta $5M", max: 5000000 },
];

const CITY_OPTIONS = [
  { value: "all", label: "Ambas ciudades" },
  ...CITIES.map((c) => ({ value: c.name, label: c.name })),
];

const triggerClass =
  "border-0 shadow-none focus:ring-0 p-0 h-8 gap-2 font-semibold text-sm text-foreground w-full [&>span]:line-clamp-none";

function MatchField({ label, value, onChange, options, className }) {
  return (
    <div className={cn("px-4 sm:px-5 py-3.5 min-w-0 w-full", className)}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={triggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function MatchButton({ onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 w-full gradient-cta text-white font-bold text-sm px-6 py-4 rounded-xl hover:opacity-95 transition-opacity",
        className
      )}
    >
      <Search className="w-4 h-4 shrink-0" />
      <span>Empieza tu match</span>
    </button>
  );
}

export default function InlineMatchBar({ variant = "hero" }) {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [beds, setBeds] = useState("all");
  const [budget, setBudget] = useState("all");

  const handleMatch = () => {
    const budgetOpt = BUDGETS.find((b) => b.value === budget);
    const prefs = {
      city,
      zone: "",
      type: "apartamento",
      beds,
      maxPrice: budgetOpt?.max || 10000000,
      parking: false,
      pets: false,
      furnished: false,
    };
    savePreferences(prefs);
    navigate(buildExploreUrl(prefs));
  };

  const fields = [
    {
      key: "city",
      label: "Ciudad",
      value: city || "all",
      onChange: (v) => setCity(v === "all" ? "" : v),
      options: CITY_OPTIONS,
    },
    {
      key: "beds",
      label: "Habitaciones",
      value: beds,
      onChange: setBeds,
      options: BEDS,
    },
    {
      key: "budget",
      label: "Presupuesto",
      value: budget,
      onChange: setBudget,
      options: BUDGETS.map((b) => ({ value: b.value, label: b.label })),
    },
  ];

  if (variant === "hero") {
    return (
      <div className="w-full max-w-full rounded-2xl bg-white border border-border/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="color-bar h-[3px] w-full" />

        {/* Móvil + tablet: campos apilados */}
        <div className="flex flex-col lg:hidden divide-y divide-border/60">
          {fields.map((field) => (
            <MatchField
              key={field.key}
              label={field.label}
              value={field.value}
              onChange={field.onChange}
              options={field.options}
            />
          ))}
          <div className="p-3">
            <MatchButton onClick={handleMatch} />
          </div>
        </div>

        {/* Desktop: fila horizontal */}
        <div className="hidden lg:flex lg:items-stretch">
          <div className="flex flex-1 min-w-0 divide-x divide-border/60">
            {fields.map((field) => (
              <MatchField
                key={field.key}
                label={field.label}
                value={field.value}
                onChange={field.onChange}
                options={field.options}
                className="flex-1 min-w-[160px] hover:bg-secondary/40 transition-colors"
              />
            ))}
          </div>
          <div className="p-2 shrink-0 flex items-center">
            <MatchButton
              onClick={handleMatch}
              className="w-auto h-full min-h-[72px] px-7 py-0 rounded-xl whitespace-nowrap"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full rounded-2xl bg-white border border-border/70 shadow-lg overflow-hidden">
      <div className="flex flex-col sm:hidden divide-y divide-border/60">
        {fields.map((field) => (
          <MatchField key={field.key} {...field} />
        ))}
        <div className="p-3">
          <button
            type="button"
            onClick={handleMatch}
            className="flex items-center justify-center gap-2 w-full bg-[hsl(265,75%,50%)] hover:bg-[hsl(265,75%,45%)] text-white font-bold text-sm px-6 py-4 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4 shrink-0" />
            Empieza tu match
          </button>
        </div>
      </div>

      <div className="hidden sm:flex sm:items-stretch divide-x divide-border/60">
        {fields.map((field) => (
          <MatchField key={field.key} {...field} className="flex-1 min-w-0" />
        ))}
        <button
          type="button"
          onClick={handleMatch}
          className="m-2 bg-[hsl(265,75%,50%)] hover:bg-[hsl(265,75%,45%)] text-white font-bold text-sm px-5 py-3.5 rounded-xl transition-colors shrink-0 self-center"
        >
          Empieza tu match
        </button>
      </div>
    </div>
  );
}
