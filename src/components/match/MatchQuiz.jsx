import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import { ArrowRight, ArrowLeft, Check, Car, PawPrint, Sofa, Sparkles, Bath } from "lucide-react";
import ElevatorIcon from "@/components/icons/ElevatorIcon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { savePreferences, buildExploreUrl } from "@/lib/matchPreferences";
import { CITIES, getZonesForCity } from "@/lib/colombia";
import { QUIZ_FINISH_CTA, QUIZ_STEPS, TRUST_TAGLINE } from "@/lib/siteCopy";
import { cn } from "@/lib/utils";

const TYPES = [
  { value: "apartamento", label: "Apartamento", color: "border-brand-magenta/40 bg-brand-magenta/8" },
  { value: "casa", label: "Casa", color: "border-brand-violet/40 bg-brand-violet/8" },
  { value: "estudio", label: "Estudio", color: "border-brand-violet/35 bg-brand-violet/8" },
  { value: "habitacion", label: "Habitación", color: "border-brand-magenta/35 bg-brand-magenta/8" },
];
const BEDS = ["1", "2", "3", "4", "5"];
const BATHS = ["1", "2", "3", "4", "5"];
const ELEVATOR_OPTIONS = [
  { value: "si", label: "Sí, lo necesito", icon: ElevatorIcon },
  { value: "no", label: "No lo necesito", icon: ElevatorIcon },
  { value: "", label: "Me da igual", icon: null },
];
const PETS_OPTIONS = [
  { value: "si", label: "Sí, tengo mascotas", desc: "Solo inmuebles que las acepten", icon: PawPrint },
  { value: "no", label: "No tengo mascotas", desc: "Cualquier inmueble me sirve", icon: PawPrint },
];
const BUDGETS = [
  { value: 1000000, label: "Hasta $1M" },
  { value: 2000000, label: "Hasta $2M" },
  { value: 3000000, label: "Hasta $3M" },
  { value: 5000000, label: "Hasta $5M" },
  { value: 10000000, label: "Sin límite" },
];

function OptionButton({ selected, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-3 rounded-2xl text-sm font-bold border-2 transition-all text-left",
        selected
          ? "border-foreground bg-foreground text-white shadow-md"
          : "border-border/70 bg-white text-foreground hover:border-foreground/30 hover:bg-secondary/40",
        className
      )}
    >
      {children}
    </button>
  );
}

export default function MatchQuiz({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState({
    city: "",
    zone: "",
    type: "apartamento",
    beds: "2",
    bathrooms: "all",
    maxPrice: 3000000,
    elevator: "",
    pets: "",
    parking: false,
    furnished: false,
  });

  const current = QUIZ_STEPS[step];
  const progress = ((step + 1) / QUIZ_STEPS.length) * 100;
  const zones = prefs.city ? getZonesForCity(prefs.city) : [];

  const finish = () => {
    savePreferences(prefs);
    onOpenChange(false);
    setStep(0);
    navigate(buildExploreUrl(prefs));
  };

  const next = () => (step < QUIZ_STEPS.length - 1 ? setStep(step + 1) : finish());
  const back = () => step > 0 && setStep(step - 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-3xl border border-border/50 shadow-2xl">
        <div className="h-1.5 bg-secondary">
          <motion.div className="h-full gradient-cta" animate={{ width: `${progress}%` }} transition={{ duration: 0.25 }} />
        </div>

        <div className="gradient-hero px-6 sm:px-8 pt-6 pb-4 border-b border-border/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Match inteligente · Paso {step + 1}/{QUIZ_STEPS.length}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <VerifiedBadge size="sm" />
                <span className="text-[11px] text-muted-foreground">{TRUST_TAGLINE}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl sm:text-2xl font-extrabold mb-1">{current.title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{current.subtitle}</p>

              {current.id === "city" && (
                <div className="grid grid-cols-2 gap-3">
                  <OptionButton selected={!prefs.city} onClick={() => setPrefs({ ...prefs, city: "", zone: "" })} className="col-span-2 text-center">
                    Ambas ciudades
                  </OptionButton>
                  {CITIES.map((c) => (
                    <OptionButton key={c.id} selected={prefs.city === c.name} onClick={() => setPrefs({ ...prefs, city: c.name, zone: "" })} className="text-center">
                      {c.name}
                    </OptionButton>
                  ))}
                </div>
              )}

              {current.id === "zone" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <OptionButton selected={!prefs.zone} onClick={() => setPrefs({ ...prefs, zone: "" })} className="col-span-2 sm:col-span-3 text-center">
                    {prefs.city ? `Toda ${prefs.city}` : "Cualquier zona"}
                  </OptionButton>
                  {zones.map((z) => (
                    <OptionButton key={z} selected={prefs.zone === z} onClick={() => setPrefs({ ...prefs, zone: z })} className="text-center text-xs sm:text-sm">
                      {z}
                    </OptionButton>
                  ))}
                </div>
              )}

              {current.id === "type" && (
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map((t) => (
                    <OptionButton
                      key={t.value}
                      selected={prefs.type === t.value}
                      onClick={() => setPrefs({ ...prefs, type: t.value })}
                      className={cn(prefs.type === t.value && t.color)}
                    >
                      {t.label}
                    </OptionButton>
                  ))}
                </div>
              )}

              {current.id === "beds" && (
                <div className="flex flex-wrap gap-2">
                  {BEDS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setPrefs({ ...prefs, beds: b })}
                      className={cn(
                        "min-w-[3rem] px-5 py-3 rounded-full border-2 text-sm font-bold transition-all",
                        prefs.beds === b ? "border-foreground bg-foreground text-white" : "border-border/80 bg-white hover:border-foreground/25"
                      )}
                    >
                      {b === "5" ? "5+" : b}
                    </button>
                  ))}
                </div>
              )}

              {current.id === "baths" && (
                <div className="space-y-3">
                  <OptionButton
                    selected={prefs.bathrooms === "all"}
                    onClick={() => setPrefs({ ...prefs, bathrooms: "all" })}
                    className="w-full text-center"
                  >
                    Cualquiera
                  </OptionButton>
                  <div className="flex flex-wrap gap-2">
                    {BATHS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setPrefs({ ...prefs, bathrooms: b })}
                        className={cn(
                          "min-w-[3rem] px-5 py-3 rounded-full border-2 text-sm font-bold transition-all inline-flex items-center justify-center gap-1.5",
                          prefs.bathrooms === b ? "border-foreground bg-foreground text-white" : "border-border/80 bg-white hover:border-foreground/25"
                        )}
                      >
                        <Bath className="w-3.5 h-3.5" />
                        {b === "5" ? "5+" : b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {current.id === "budget" && (
                <div className="grid grid-cols-1 gap-2">
                  {BUDGETS.map((b) => (
                    <OptionButton key={b.value} selected={prefs.maxPrice === b.value} onClick={() => setPrefs({ ...prefs, maxPrice: b.value })}>
                      {b.label}
                    </OptionButton>
                  ))}
                </div>
              )}

              {current.id === "elevator" && (
                <div className="grid grid-cols-1 gap-2">
                  {ELEVATOR_OPTIONS.map((opt) => (
                    <OptionButton
                      key={opt.label}
                      selected={prefs.elevator === opt.value}
                      onClick={() => setPrefs({ ...prefs, elevator: opt.value })}
                      className="flex items-center gap-3"
                    >
                      {opt.icon && <opt.icon className="w-4 h-4 text-brand-violet" />}
                      {opt.label}
                      {prefs.elevator === opt.value && <Check className="w-4 h-4 ml-auto" />}
                    </OptionButton>
                  ))}
                </div>
              )}

              {current.id === "pets" && (
                <div className="grid grid-cols-1 gap-2">
                  {PETS_OPTIONS.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      selected={prefs.pets === opt.value}
                      onClick={() => setPrefs({ ...prefs, pets: opt.value })}
                      className="flex flex-col items-start gap-0.5"
                    >
                      <span className="flex items-center gap-3 w-full">
                        <opt.icon className="w-4 h-4 shrink-0" />
                        <span className="font-bold">{opt.label}</span>
                        {prefs.pets === opt.value && <Check className="w-4 h-4 ml-auto" />}
                      </span>
                      <span className={cn("text-xs pl-7", prefs.pets === opt.value ? "text-white/80" : "text-muted-foreground")}>
                        {opt.desc}
                      </span>
                    </OptionButton>
                  ))}
                </div>
              )}

              {current.id === "extras" && (
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { key: "parking", label: "Parqueadero", icon: Car },
                    { key: "furnished", label: "Amoblado", icon: Sofa },
                  ].map((e) => (
                    <OptionButton
                      key={e.key}
                      selected={prefs[e.key]}
                      onClick={() => setPrefs({ ...prefs, [e.key]: !prefs[e.key] })}
                      className="flex items-center gap-3"
                    >
                      <e.icon className="w-4 h-4" />
                      {e.label}
                      {prefs[e.key] && <Check className="w-4 h-4 ml-auto" />}
                    </OptionButton>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-2 gradient-cta btn-glow text-white font-bold px-6 py-3 rounded-xl hover:opacity-95 transition-opacity"
            >
              {step === QUIZ_STEPS.length - 1 ? QUIZ_FINISH_CTA : "Siguiente"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
