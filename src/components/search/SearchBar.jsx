import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Bed, Building2, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CITIES } from "@/lib/colombia";
import { cn } from "@/lib/utils";

const TYPES = [
  { value: "all", label: "Cualquier tipo" },
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "estudio", label: "Estudio" },
  { value: "habitacion", label: "Habitación" },
];

const BEDS = [
  { value: "all", label: "Cualquiera" },
  { value: "1", label: "1 hab." },
  { value: "2", label: "2 hab." },
  { value: "3", label: "3 hab." },
  { value: "4", label: "4 hab." },
  { value: "5", label: "5+ hab." },
];

const BUDGETS = [
  { value: "all", label: "Cualquier precio" },
  { value: "1000000", label: "Hasta $1M" },
  { value: "2000000", label: "Hasta $2M" },
  { value: "3000000", label: "Hasta $3M" },
  { value: "5000000", label: "Hasta $5M" },
];

const FILTER_STYLES = [
  { bg: "bg-[hsl(340,82%,52%)]/10", color: "text-[hsl(340,82%,52%)]" },
  { bg: "bg-[hsl(265,75%,58%)]/10", color: "text-[hsl(265,75%,58%)]" },
  { bg: "bg-[hsl(168,72%,40%)]/10", color: "text-[hsl(168,72%,40%)]" },
  { bg: "bg-[hsl(32,95%,54%)]/10", color: "text-[hsl(32,95%,54%)]" },
];

export default function SearchBar({ variant = "hero", className }) {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [type, setType] = useState("all");
  const [beds, setBeds] = useState("all");
  const [budget, setBudget] = useState("all");

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (type !== "all") params.set("type", type);
    if (beds !== "all") params.set("beds", beds);
    if (budget !== "all") params.set("max", budget);
    navigate(`/explorar?${params}`);
  };

  const isHero = variant === "hero";
  const icons = [MapPin, Building2, Bed, DollarSign];
  const fields = [
    { label: "Ciudad", value: city || "all", onChange: (v) => setCity(v === "all" ? "" : v), options: [{ value: "all", label: "Ambas ciudades" }, ...CITIES.map((c) => ({ value: c.name, label: c.name }))] },
    { label: "Tipo", value: type, onChange: setType, options: TYPES },
    { label: "Habitaciones", value: beds, onChange: setBeds, options: BEDS },
    { label: "Presupuesto", value: budget, onChange: setBudget, options: BUDGETS },
  ];

  return (
    <form onSubmit={handleSearch} className={cn("w-full bg-white rounded-2xl border border-border/50 overflow-hidden", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field, i) => {
          const Icon = icons[i];
          const style = FILTER_STYLES[i];
          return (
            <div key={field.label} className="flex items-center gap-2.5 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-border/40 last:border-0">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", style.bg)}>
                <Icon className={cn("w-3.5 h-3.5", style.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{field.label}</label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="border-0 p-0 h-auto shadow-none focus:ring-0 font-semibold text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        className={cn(
          "w-full flex items-center justify-center gap-2 font-bold text-white gradient-cta hover:opacity-95 transition-opacity",
          isHero ? "py-4 text-base" : "py-3 text-sm"
        )}
      >
        <Search className="w-4 h-4" />
        Buscar arriendos
      </button>
    </form>
  );
}
