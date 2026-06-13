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
  "border-0 shadow-none focus:ring-0 p-0 h-7 gap-1.5 font-semibold text-sm text-foreground w-full [&>span]:line-clamp-none [&>svg]:opacity-40";

function MatchField({ label, value, onChange, options, className }) {
  return (
    <div className={cn("px-4 sm:px-5 py-3 min-w-0 w-full", className)}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-0.5">{label}</p>
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

function MatchButton({ onClick, compact = false, className }) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full gradient-cta text-white text-sm font-bold shadow-md shadow-primary/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 whitespace-nowrap",
          className
        )}
      >
        <Search className="w-4 h-4 shrink-0" strokeWidth={2.5} />
        Match
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 w-full h-11 gradient-cta text-white font-bold text-sm px-5 rounded-full shadow-md shadow-primary/15 hover:opacity-95 active:scale-[0.99] transition-all",
        className
      )}
    >
      <Search className="w-4 h-4 shrink-0" strokeWidth={2.5} />
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

  const barShell = "w-full max-w-full rounded-[1.25rem] bg-white/95 backdrop-blur-sm border border-border/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] overflow-hidden";

  if (variant === "hero") {
    return (
      <div className={barShell}>
        <div className="color-bar h-[2px] w-full opacity-90" />

        <div className="flex flex-col lg:hidden divide-y divide-border/50">
          {fields.map((field) => (
            <MatchField key={field.key} label={field.label} value={field.value} onChange={field.onChange} options={field.options} />
          ))}
          <div className="p-3 pt-2">
            <MatchButton onClick={handleMatch} />
          </div>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-1 lg:pr-2.5 lg:py-2">
          <div className="flex flex-1 min-w-0 divide-x divide-border/50">
            {fields.map((field) => (
              <MatchField
                key={field.key}
                label={field.label}
                value={field.value}
                onChange={field.onChange}
                options={field.options}
                className="flex-1 min-w-0 hover:bg-secondary/30 transition-colors rounded-sm"
              />
            ))}
          </div>
          <div className="shrink-0 pl-1 pr-0.5">
            <MatchButton onClick={handleMatch} compact />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(barShell, "shadow-lg")}>
      <div className="flex flex-col sm:hidden divide-y divide-border/50">
        {fields.map((field) => (
          <MatchField key={field.key} {...field} />
        ))}
        <div className="p-3 pt-2">
          <MatchButton onClick={handleMatch} />
        </div>
      </div>

      <div className="hidden sm:flex sm:items-center sm:gap-2 sm:pr-2 sm:py-2 divide-x divide-border/50">
        {fields.map((field) => (
          <MatchField key={field.key} {...field} className="flex-1 min-w-0" />
        ))}
        <div className="pl-2 pr-1 shrink-0">
          <MatchButton onClick={handleMatch} compact />
        </div>
      </div>
    </div>
  );
}
