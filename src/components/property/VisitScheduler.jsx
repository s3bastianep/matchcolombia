import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Gift, MapPin, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getTimeSlotsForType,
  getAvailableVisitDays,
  formatVisitDay,
} from "@/lib/visitSlots";

const selectedSolid =
  "border-[hsl(var(--brand-violet))] bg-[hsl(var(--brand-violet))] text-white shadow-sm";
const defaultChip =
  "border-border/60 bg-[hsl(0,0%,97%)] text-foreground/80 hover:border-[hsl(var(--brand-violet)/0.35)] hover:bg-[hsl(var(--brand-violet)/0.05)]";

function shortTimeLabel(label) {
  return label.replace(/^0/, "").replace(/(am|pm)$/i, "");
}

function TimeSlotGrid({ slots, selectedSlot, onSlotChange }) {
  const morning = slots.filter((s) => s.hour < 12);
  const afternoon = slots.filter((s) => s.hour >= 12);

  const renderGroup = (group) => (
    <div className="flex flex-wrap gap-2">
      {group.map((slot) => {
        const selected = selectedSlot === slot.id;
        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSlotChange(slot.id)}
            className={cn(
              "min-w-[3.75rem] h-9 px-2.5 rounded-md border text-[11px] font-semibold tabular-nums transition-all duration-200",
              selected ? selectedSolid : defaultChip
            )}
          >
            {shortTimeLabel(slot.label)}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-3.5">
      {morning.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground/45 mb-2">
            Mañana
          </p>
          {renderGroup(morning)}
        </div>
      )}
      {afternoon.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground/45 mb-2">
            Tarde
          </p>
          {renderGroup(afternoon)}
        </div>
      )}
    </div>
  );
}

const VISIT_TYPE_UI = [
  { id: "presencial", label: "Presencial", hint: "En el inmueble", Icon: MapPin },
  { id: "virtual", label: "Virtual", hint: "Video llamada", Icon: Video },
];

function ScrollRow({ children, className, ariaLabel, step = 148 }) {
  const ref = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollHints = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateScrollHints();
    el.addEventListener("scroll", updateScrollHints, { passive: true });
    const ro = new ResizeObserver(updateScrollHints);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollHints);
      ro.disconnect();
    };
  }, [updateScrollHints, children]);

  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label={`Anterior: ${ariaLabel}`}
        disabled={!canScrollLeft}
        className={cn(
          "shrink-0 w-7 h-7 rounded-full bg-white border border-border/70 shadow-sm flex items-center justify-center text-brand-violet transition-opacity duration-200",
          canScrollLeft ? "opacity-100" : "opacity-30 pointer-events-none"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="relative flex-1 min-w-0">
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-[1]" />
        )}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-[1]" />
        )}
        <div
          ref={ref}
          className={cn(
            "flex flex-nowrap overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory",
            "gap-2 py-0.5 scrollbar-thin [-ms-overflow-style:none] [scrollbar-width:thin]",
            className
          )}
          aria-label={ariaLabel}
        >
          {children}
        </div>
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label={`Siguiente: ${ariaLabel}`}
        disabled={!canScrollRight}
        className={cn(
          "shrink-0 w-7 h-7 rounded-full bg-white border border-border/70 shadow-sm flex items-center justify-center text-brand-violet transition-opacity duration-200",
          canScrollRight ? "opacity-100" : "opacity-30 pointer-events-none"
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function VisitScheduler({
  visitType,
  onVisitTypeChange,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
}) {
  const days = getAvailableVisitDays(21);
  const timeSlots = getTimeSlotsForType(visitType);

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-border/40">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-foreground leading-tight">
              Agenda tu visita
            </h3>
            <p className="text-sm text-foreground/70 mt-1.5 leading-snug">
              Sin costo. Nosotros coordinamos todo por ti.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full bg-[hsl(var(--brand-magenta)/0.1)] border border-[hsl(var(--brand-magenta)/0.22)] text-xs font-bold text-[hsl(var(--brand-magenta))]">
            <Gift className="w-3.5 h-3.5" strokeWidth={2.5} />
            Gratis
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-foreground/55 mb-3">
          Tipo de visita
        </p>
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[hsl(var(--brand-violet)/0.05)] border border-border/50">
          {VISIT_TYPE_UI.map((type) => {
            const active = visitType === type.id;
            const Icon = type.Icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  onVisitTypeChange(type.id);
                  onSlotChange("");
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 min-h-[5.5rem] py-3.5 px-2 rounded-xl border transition-all duration-200",
                  active
                    ? "border-[hsl(var(--brand-violet))] bg-[hsl(var(--brand-violet))] text-white shadow-md"
                    : "border-transparent bg-white/80 text-foreground hover:bg-white hover:border-border/60"
                )}
              >
                <span
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center",
                    active ? "bg-white/20" : "bg-[hsl(var(--brand-violet)/0.08)]"
                  )}
                >
                  <Icon
                    className={cn("w-4 h-4 shrink-0", active ? "text-white" : "text-brand-violet")}
                    strokeWidth={2}
                  />
                </span>
                <span className="text-sm font-bold leading-none whitespace-nowrap">
                  {type.label}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none whitespace-nowrap",
                    active ? "text-white/85" : "text-foreground/55"
                  )}
                >
                  {type.hint}
                </span>
              </button>
            );
          })}
        </div>
        {visitType === "virtual" && (
          <p className="text-xs text-foreground/65 mt-3 leading-relaxed">
            Ideal si no estás en la ciudad. Nuestro equipo te muestra el inmueble por video.
          </p>
        )}
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-foreground/55 mb-3">
          Fecha
        </p>

        <ScrollRow ariaLabel="fechas disponibles" step={76}>
          {days.map((date) => {
            const info = formatVisitDay(date);
            const selected = selectedDate === info.iso;
            return (
              <button
                key={info.iso}
                type="button"
                onClick={() => onDateChange(info.iso)}
                className={cn(
                  "snap-start shrink-0 w-[3.5rem] h-[4.25rem] flex flex-col items-center justify-center gap-0.5 rounded-lg border transition-all duration-200",
                  selected ? selectedSolid : defaultChip
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-semibold leading-none uppercase",
                    selected ? "text-white/90" : "text-foreground/65"
                  )}
                >
                  {info.weekday}
                </span>
                <span className="text-lg font-extrabold leading-none tabular-nums">
                  {info.dayNum}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    selected ? "text-white/85" : "text-foreground/60"
                  )}
                >
                  {info.month}
                </span>
              </button>
            );
          })}
        </ScrollRow>

        <p className="text-xs font-bold uppercase tracking-wide text-foreground/55 mt-5 mb-3">
          Hora
        </p>

        <TimeSlotGrid
          slots={timeSlots}
          selectedSlot={selectedSlot}
          onSlotChange={onSlotChange}
        />
      </div>
    </div>
  );
}
