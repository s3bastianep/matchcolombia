import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const localities = [
  "Usaquén", "Chapinero", "Santa Fe", "San Cristóbal", "Usme", "Tunjuelito", "Bosa",
  "Kennedy", "Fontibón", "Engativá", "Suba", "Barrios Unidos", "Teusaquillo",
  "Los Mártires", "Antonio Nariño", "Puente Aranda", "La Candelaria",
  "Rafael Uribe Uribe", "Ciudad Bolívar",
];

const propertyTypes = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "estudio", label: "Estudio" },
  { value: "habitacion", label: "Habitación" },
  { value: "penthouse", label: "Penthouse" },
  { value: "duplex", label: "Dúplex" },
];

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

export default function SearchFilters({ filters, setFilters, showMobileFilters, setShowMobileFilters }) {
  const activeCount = [
    filters.locality && filters.locality !== "all" ? 1 : 0,
    filters.propertyType && filters.propertyType !== "all" ? 1 : 0,
    filters.bedrooms && filters.bedrooms !== "all" ? 1 : 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearFilters = () =>
    setFilters({ search: filters.search, locality: "", propertyType: "", bedrooms: "", priceRange: [0, 10000000] });

  const content = (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Barrio, zona..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-10 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Locality */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Localidad</label>
        <Select value={filters.locality || "all"} onValueChange={(v) => setFilters({ ...filters, locality: v })}>
          <SelectTrigger className="bg-secondary border-0 focus:ring-1 focus:ring-primary/50">
            <SelectValue placeholder="Todas las localidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {localities.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Type */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Tipo</label>
        <Select value={filters.propertyType || "all"} onValueChange={(v) => setFilters({ ...filters, propertyType: v })}>
          <SelectTrigger className="bg-secondary border-0">
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {propertyTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Habitaciones</label>
        <div className="grid grid-cols-5 gap-1.5">
          {["all", "1", "2", "3", "4"].map((v) => (
            <button
              key={v}
              onClick={() => setFilters({ ...filters, bedrooms: v })}
              className={cn(
                "py-2 rounded-xl text-sm font-medium transition-all",
                filters.bedrooms === v || (!filters.bedrooms && v === "all")
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:bg-muted"
              )}
            >
              {v === "all" ? "Todas" : v === "4" ? "4+" : v}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio mensual</label>
        </div>
        <Slider
          value={filters.priceRange}
          onValueChange={(v) => setFilters({ ...filters, priceRange: v })}
          max={10000000}
          min={0}
          step={100000}
          className="mb-4"
        />
        <div className="flex justify-between">
          <div className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium">
            {formatCOP(filters.priceRange[0])}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium">
            {formatCOP(filters.priceRange[1])}
          </div>
        </div>
      </div>

      {activeCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <X className="w-3.5 h-3.5" />
          Limpiar filtros ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-card rounded-2xl border border-border/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-lg">Filtros</h3>
            {activeCount > 0 && (
              <Badge className="rounded-full text-xs">{activeCount} activos</Badge>
            )}
          </div>
          {content}
        </div>
      </div>

      {/* Mobile toggle button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <Button
          onClick={() => setShowMobileFilters(true)}
          className="rounded-full shadow-xl shadow-primary/30 gap-2 px-6 font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {activeCount > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile sheet */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="relative w-full bg-background rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-semibold">Filtros</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-1.5 rounded-lg hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
            <Button className="w-full mt-6 rounded-xl font-medium" onClick={() => setShowMobileFilters(false)}>
              Ver resultados
            </Button>
          </div>
        </div>
      )}
    </>
  );
}