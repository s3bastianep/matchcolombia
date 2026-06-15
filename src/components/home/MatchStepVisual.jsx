import React from "react";
import {
  MapPin,
  Wallet,
  Bed,
  Bath,
  PawPrint,
  Check,
  Heart,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

function VisualCard({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[hsl(35,30%,96%)] border border-[hsl(35,15%,88%)] p-4 sm:p-5 min-h-[220px] flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
}

function FilterPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 shadow-sm border border-border/35">
      <div className="w-9 h-9 rounded-full bg-brand-violet/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-brand-violet" strokeWidth={2.25} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-xs font-bold text-foreground truncate">{value}</p>
      </div>
      <Check className="w-4 h-4 text-brand-magenta shrink-0" strokeWidth={3} />
    </div>
  );
}

function QuizVisual() {
  return (
    <VisualCard>
      <div className="w-full max-w-[240px] space-y-2">
        <FilterPill icon={MapPin} label="Ciudad" value="Bogotá · Chapinero" />
        <FilterPill icon={Wallet} label="Presupuesto" value="Hasta $3.000.000" />
        <FilterPill icon={Bed} label="Habitaciones" value="2 habitaciones" />
        <FilterPill icon={Bath} label="Baños" value="2 baños" />
        <FilterPill icon={PawPrint} label="Mascotas" value="Sí, tengo mascotas" />
      </div>
    </VisualCard>
  );
}

function MatchVisual() {
  return (
    <VisualCard>
      <div className="relative w-full max-w-[220px] mx-auto py-2">
        <div
          className="absolute inset-0 translate-x-3 translate-y-3 rotate-[4deg] rounded-2xl bg-white border border-border/25 shadow-sm"
          aria-hidden
        />
        <div
          className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-[2deg] rounded-2xl bg-white border border-border/35 shadow-md"
          aria-hidden
        />
        <div className="relative rounded-2xl bg-white border border-border/50 shadow-lg overflow-hidden">
          <div className="aspect-[5/4] relative overflow-hidden">
            <div className="absolute inset-0 gradient-cta opacity-90" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 10px)",
              }}
            />
            <div className="absolute top-3 left-3 w-11 h-11 rounded-full gradient-cta flex items-center justify-center shadow-lg ring-4 ring-white">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--brand-verified-bg))] border border-[hsl(var(--brand-verified-border))] text-[9px] font-extrabold text-[hsl(var(--brand-verified-fg))] shadow-sm">
                <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
                Verificado
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 text-[10px] font-extrabold text-brand-violet">
                <Check className="w-3 h-3" strokeWidth={3} />
                Revisado por el equipo
              </span>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[hsl(var(--brand-verified))]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold text-[hsl(var(--brand-verified-fg))]">Anuncio verificado</span>
            </div>
            <div className="h-2.5 w-3/4 rounded-full bg-border/50" />
            <div className="h-2 w-1/2 rounded-full bg-border/35" />
            <div className="flex gap-1 pt-0.5">
              {[1, 2, 3, 4].map((i) => (
                <Check key={i} className="w-3.5 h-3.5 text-brand-magenta" strokeWidth={3} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </VisualCard>
  );
}

function VisitVisual() {
  const days = [
    { d: "7", l: "L" },
    { d: "8", l: "M" },
    { d: "9", l: "M" },
    { d: "10", l: "J" },
    { d: "11", l: "V" },
  ];
  const times = ["09:00", "09:30", "10:00"];

  return (
    <VisualCard>
      <div className="w-[148px] mx-auto">
        <div className="rounded-[1.75rem] border-[3px] border-foreground/8 bg-white shadow-xl p-2">
          <div className="rounded-[1.2rem] bg-secondary/40 overflow-hidden">
            <div className="h-5 flex items-center justify-center">
              <div className="w-10 h-1 rounded-full bg-foreground/10" />
            </div>
            <div className="px-2 pb-2">
              <div className="aspect-[4/3] rounded-lg gradient-to-br from-brand-violet/15 to-brand-magenta/10 mb-2 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-brand-violet/40" />
              </div>
              <div className="bg-white rounded-xl p-2 shadow-sm border border-border/40">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Agendar visita
                </p>
                <div className="flex gap-1 mb-2">
                  {days.map((day, i) => (
                    <div
                      key={day.d}
                      className={cn(
                        "flex-1 rounded-md py-1 text-center",
                        i === 4 ? "gradient-cta text-white shadow-sm" : "bg-secondary/80"
                      )}
                    >
                      <p className="text-[7px] font-bold leading-none opacity-80">{day.l}</p>
                      <p className="text-[9px] font-extrabold leading-tight mt-0.5">{day.d}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {times.map((t, i) => (
                    <div
                      key={t}
                      className={cn(
                        "flex-1 rounded py-1 text-center text-[7px] font-bold",
                        i === 1 ? "gradient-cta text-white" : "border border-border/50 text-foreground/70"
                      )}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VisualCard>
  );
}

const VISUALS = [QuizVisual, MatchVisual, VisitVisual];

export default function MatchStepVisual({ stepIndex }) {
  const Visual = VISUALS[stepIndex] ?? QuizVisual;
  return <Visual />;
}
