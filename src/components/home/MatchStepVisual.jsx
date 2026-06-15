import React from "react";
import {
  MapPin,
  Wallet,
  Bed,
  PawPrint,
  Check,
  Heart,
  Calendar,
  ShieldCheck,
  Sparkles,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SHELL =
  "rounded-2xl bg-[hsl(35,30%,96%)] border border-[hsl(35,15%,88%)] h-[272px] w-full flex items-center justify-center p-4 sm:p-5 overflow-hidden";

function VisualShell({ children, className }) {
  return <div className={cn(SHELL, className)}>{children}</div>;
}

function FilterChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl px-2.5 py-2 shadow-sm border border-border/35 min-h-[52px]">
      <div className="w-8 h-8 rounded-lg bg-brand-violet/10 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-brand-violet" strokeWidth={2.25} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-[11px] font-bold text-foreground leading-tight truncate">{value}</p>
      </div>
      <Check className="w-3.5 h-3.5 text-brand-magenta shrink-0" strokeWidth={3} />
    </div>
  );
}

function QuizVisual() {
  return (
    <VisualShell>
      <div className="w-full max-w-[248px] space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-brand-violet shrink-0" />
          <p className="text-[11px] font-extrabold text-foreground">Match inteligente</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FilterChip icon={MapPin} label="Ciudad" value="Tu zona" />
          <FilterChip icon={Wallet} label="Presupuesto" value="Hasta $3M" />
          <FilterChip icon={Bed} label="Habitaciones" value="2 hab." />
          <FilterChip icon={PawPrint} label="Mascotas" value="Sí" />
        </div>
        <div className="rounded-xl gradient-cta text-white text-center py-2 text-[11px] font-bold shadow-sm">
          Ver resultados
        </div>
      </div>
    </VisualShell>
  );
}

function MatchVisual() {
  return (
    <VisualShell>
      <div className="relative w-full max-w-[248px]">
        <div
          className="absolute inset-x-4 top-3 bottom-3 translate-x-2 rotate-[3deg] rounded-2xl bg-white border border-border/30 shadow-sm"
          aria-hidden
        />
        <div className="relative rounded-2xl bg-white border border-border/50 shadow-lg overflow-hidden">
          <div className="aspect-[16/10] relative">
            <div className="absolute inset-0 gradient-cta opacity-90" />
            <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 text-brand-magenta fill-brand-magenta" />
            </div>
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 text-[8px] font-extrabold text-[hsl(var(--brand-verified-fg))]">
                <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
                Verificado
              </span>
            </div>
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/95 text-[10px] font-extrabold text-brand-violet">
                94% match
              </span>
              <span className="text-[10px] font-bold text-white/95">$2.8M / mes</span>
            </div>
          </div>
          <div className="px-3 py-2.5 space-y-1.5 border-t border-border/30">
            <p className="text-[11px] font-extrabold text-foreground leading-tight">Apartamento en Chapinero</p>
            <p className="text-[10px] text-muted-foreground">2 hab. · 2 baños · Parqueadero</p>
          </div>
        </div>
      </div>
    </VisualShell>
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
    <VisualShell>
      <div className="w-full max-w-[248px]">
        <div className="rounded-2xl border-2 border-foreground/10 bg-white shadow-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-brand-violet" />
            <p className="text-[11px] font-extrabold text-foreground">Agendar visita</p>
          </div>
          <div className="rounded-xl bg-secondary/50 p-2.5 mb-2.5">
            <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Elige fecha</p>
            <div className="flex gap-1">
              {days.map((day, i) => (
                <div
                  key={day.d}
                  className={cn(
                    "flex-1 rounded-lg py-1.5 text-center",
                    i === 4 ? "gradient-cta text-white shadow-sm" : "bg-white border border-border/40"
                  )}
                >
                  <p className="text-[7px] font-bold leading-none opacity-80">{day.l}</p>
                  <p className="text-[10px] font-extrabold leading-tight mt-0.5">{day.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-2.5">
            <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Horario</p>
            <div className="flex gap-1.5">
              {times.map((t, i) => (
                <div
                  key={t}
                  className={cn(
                    "flex-1 rounded-lg py-2 text-center text-[9px] font-bold",
                    i === 1 ? "gradient-cta text-white" : "bg-white border border-border/40 text-foreground/70"
                  )}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] font-semibold text-muted-foreground">
            <Clock className="w-3 h-3" />
            Presencial o virtual
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

const VISUALS = [QuizVisual, MatchVisual, VisitVisual];

export default function MatchStepVisual({ stepIndex }) {
  const Visual = VISUALS[stepIndex] ?? QuizVisual;
  return <Visual />;
}
