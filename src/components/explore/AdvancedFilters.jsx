import React from "react";

import { Bed, Bath, Car, Building2, X, DollarSign, Home, Clock, Layers } from "lucide-react";
import ElevatorIcon from "@/components/icons/ElevatorIcon";
import { cn } from "@/lib/utils";
import { EXPLORE_MORE_FILTERS } from "@/lib/siteCopy";
import { Slider } from "@/components/ui/slider";
import {
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  PARKING_OPTIONS,
  FLOOR_OPTIONS,
  ESTRATO_OPTIONS,
  LISTING_TYPE_OPTIONS,
  BUILDING_AGE_OPTIONS,
  ELEVATOR_OPTIONS,
  PRICE_SLIDER_MAX,
  PRICE_SLIDER_STEP,
  countAdvancedFilters,
} from "@/lib/propertyFilters";



const NUMERIC_ESTRATO = ESTRATO_OPTIONS.filter((o) => !["comercial", "rural"].includes(o.value));

const TEXT_ESTRATO = ESTRATO_OPTIONS.filter((o) => ["comercial", "rural"].includes(o.value));



const formatCOP = (value) =>

  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);



function FilterCircle({ label, active, onClick }) {

  return (

    <button

      type="button"

      onClick={onClick}

      aria-pressed={active}

      className={cn(

        "w-11 h-11 rounded-full border text-sm font-semibold flex items-center justify-center transition-all duration-200",

        active

          ? "bg-foreground border-foreground text-white shadow-[0_2px_8px_rgba(15,23,42,0.18)] scale-[1.02]"

          : "bg-white border-[hsl(0,0%,88%)] text-foreground hover:border-foreground/25 hover:shadow-sm"

      )}

    >

      {label}

    </button>

  );

}



function FilterTextPill({ label, active, onClick }) {

  return (

    <button

      type="button"

      onClick={onClick}

      aria-pressed={active}

      className={cn(

        "h-11 px-5 rounded-full border text-sm font-semibold transition-all duration-200 whitespace-nowrap",

        active

          ? "bg-foreground border-foreground text-white shadow-[0_2px_8px_rgba(15,23,42,0.18)]"

          : "bg-white border-[hsl(0,0%,88%)] text-foreground hover:border-foreground/25 hover:shadow-sm"

      )}

    >

      {label}

    </button>

  );

}



function FilterSection({ icon: Icon, title, children }) {

  return (

    <div className="py-5 border-b border-[hsl(0,0%,90%)] last:border-0">

      <div className="flex items-center gap-2.5 mb-4">

        <Icon className="w-5 h-5 text-foreground/75 shrink-0" strokeWidth={1.75} />

        <h3 className="font-bold text-[15px] text-foreground tracking-tight">{title}</h3>

      </div>

      {children}

    </div>

  );

}



function NumericFilterRow({ options, value, onChange, formatLabel }) {

  return (

    <div className="flex flex-wrap gap-2.5">

      {options.map((opt) => {

        const optValue = typeof opt === "string" ? opt : opt.value;

        const optLabel = formatLabel ? formatLabel(opt) : typeof opt === "string" ? (opt === "5" ? "5+" : opt) : opt.label;

        const active = value === optValue;

        return (

          <FilterCircle

            key={optValue}

            label={optLabel}

            active={active}

            onClick={() => onChange(active ? "" : optValue)}

          />

        );

      })}

    </div>

  );

}



export default function AdvancedFilters({ filters, onChange, onClear, className }) {

  const activeCount = countAdvancedFilters(filters);

  const set = (key) => (val) => onChange({ ...filters, [key]: val });



  const priceMin = filters.priceMin ? parseInt(filters.priceMin, 10) : 0;

  const priceMax = filters.priceMax ? parseInt(filters.priceMax, 10) : PRICE_SLIDER_MAX;



  const handlePriceChange = ([min, max]) => {

    onChange({

      ...filters,

      priceMin: min > 0 ? String(min) : "",

      priceMax: max < PRICE_SLIDER_MAX ? String(max) : "",

    });

  };



  return (

    <div

      className={cn(

        "rounded-2xl bg-[hsl(0,0%,96%)] px-5 py-6 sm:px-6",

        className

      )}

    >

      <div className="flex items-center justify-between mb-2">

        <h2 className="font-extrabold text-xl text-foreground tracking-tight">{EXPLORE_MORE_FILTERS}</h2>

        {activeCount > 0 && (

          <button

            type="button"

            onClick={onClear}

            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"

          >

            <X className="w-3.5 h-3.5" />

            Limpiar

          </button>

        )}

      </div>



      <FilterSection icon={DollarSign} title="Precio total mensual">

        <div className="space-y-3 px-1">

          <Slider

            min={0}

            max={PRICE_SLIDER_MAX}

            step={PRICE_SLIDER_STEP}

            value={[priceMin, priceMax]}

            onValueChange={handlePriceChange}

            className="py-2"

          />

          <div className="flex justify-between text-xs font-semibold text-muted-foreground">

            <span>{formatCOP(priceMin)}</span>

            <span>{priceMax >= PRICE_SLIDER_MAX ? `${formatCOP(PRICE_SLIDER_MAX)}+` : formatCOP(priceMax)}</span>

          </div>

          <p className="text-[10px] text-muted-foreground">Incluye arriendo + administración</p>

        </div>

      </FilterSection>



      <FilterSection icon={Home} title="Tipo de contrato">

        <div className="flex flex-wrap gap-2.5">

          {LISTING_TYPE_OPTIONS.map((opt) => {

            const active = filters.listingType === opt.value;

            return (

              <FilterTextPill

                key={opt.value}

                label={opt.label}

                active={active}

                onClick={() => set("listingType")(active ? "" : opt.value)}

              />

            );

          })}

        </div>

      </FilterSection>



      <FilterSection icon={Clock} title="Antigüedad del inmueble">

        <div className="flex flex-wrap gap-2.5">

          {BUILDING_AGE_OPTIONS.map((opt) => {

            const active = filters.buildingAge === opt.value;

            return (

              <FilterTextPill

                key={opt.value}

                label={opt.label}

                active={active}

                onClick={() => set("buildingAge")(active ? "" : opt.value)}

              />

            );

          })}

        </div>

      </FilterSection>



      <FilterSection icon={Bed} title="Habitaciones">

        <NumericFilterRow

          options={BEDROOM_OPTIONS}

          value={filters.bedrooms}

          onChange={set("bedrooms")}

          formatLabel={(v) => (v === "5" ? "5+" : v)}

        />

      </FilterSection>



      <FilterSection icon={Bath} title="Baños">

        <NumericFilterRow

          options={BATHROOM_OPTIONS}

          value={filters.bathrooms}

          onChange={set("bathrooms")}

          formatLabel={(v) => (v === "5" ? "5+" : v)}

        />

      </FilterSection>



      <FilterSection icon={Car} title="Parqueaderos">
        <NumericFilterRow
          options={PARKING_OPTIONS}
          value={filters.parkingSpots}
          onChange={set("parkingSpots")}
          formatLabel={(v) => (v === "5" ? "5+" : v)}
        />
      </FilterSection>

      <FilterSection icon={ElevatorIcon} title="Ascensor">
        <div className="flex flex-wrap gap-2.5">
          {ELEVATOR_OPTIONS.map((opt) => {
            const active = filters.elevator === opt.value;
            return (
              <FilterTextPill
                key={opt.value}
                label={opt.label}
                active={active}
                onClick={() => set("elevator")(active ? "" : opt.value)}
              />
            );
          })}
        </div>
      </FilterSection>

      <FilterSection icon={Layers} title="Piso">
        <NumericFilterRow
          options={FLOOR_OPTIONS}
          value={filters.floor}
          onChange={set("floor")}
          formatLabel={(v) => (v === "10" ? "10+" : v)}
        />
        <p className="text-[10px] text-muted-foreground mt-2.5">Filtra por el piso del inmueble</p>
      </FilterSection>

      <FilterSection icon={Building2} title="Estrato">

        <div className="flex flex-wrap gap-2.5">

          {NUMERIC_ESTRATO.map((opt) => {

            const active = filters.estrato === opt.value;

            return (

              <FilterCircle

                key={opt.value}

                label={opt.label}

                active={active}

                onClick={() => set("estrato")(active ? "" : opt.value)}

              />

            );

          })}

          {TEXT_ESTRATO.map((opt) => {

            const active = filters.estrato === opt.value;

            return (

              <FilterTextPill

                key={opt.value}

                label={opt.label}

                active={active}

                onClick={() => set("estrato")(active ? "" : opt.value)}

              />

            );

          })}

        </div>

      </FilterSection>

    </div>

  );

}

