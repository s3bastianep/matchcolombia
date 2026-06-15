import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Car,
  PawPrint,
  Sofa,
  Sparkles,
  Bath,
  Bed,
  Building2,
  MapPin,
  Wallet,
  SlidersHorizontal,
} from "lucide-react";
import ElevatorIcon from "@/components/icons/ElevatorIcon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { savePreferences, buildExploreUrl } from "@/lib/matchPreferences";
import { CITIES, getZonesForCity } from "@/lib/colombia";
import { QUIZ_FINISH_CTA, QUIZ_STEPS } from "@/lib/siteCopy";
import { cn } from "@/lib/utils";

const STEP_ICONS = {
  city: MapPin,
  zone: MapPin,
  type: Building2,
  beds: Bed,
  baths: Bath,
  budget: Wallet,
  elevator: ElevatorIcon,
  pets: PawPrint,
  extras: SlidersHorizontal,
};

const TYPES = [
  { value: "apartamento", label: "Apartamento", emoji: "🏢" },
  { value: "casa", label: "Casa", emoji: "🏠" },
  { value: "estudio", label: "Estudio", emoji: "🛋️" },
  { value: "habitacion", label: "Habitación", emoji: "🚪" },
];

const BEDS = ["1", "2", "3", "4", "5"];
const BATHS = ["1", "2", "3", "4", "5"];

const ELEVATOR_OPTIONS = [
  { value: "si", label: "Sí, lo necesito" },
  { value: "no", label: "No lo necesito" },
  { value: "", label: "Me da igual" },
];

const PETS_OPTIONS = [
  { value: "si", label: "Sí, tengo mascotas", desc: "Solo inmuebles que las acepten" },
  { value: "no", label: "No tengo mascotas", desc: "Cualquier inmueble me sirve" },
];

const BUDGETS = [
  { value: 1000000, label: "Hasta $1M" },
  { value: 2000000, label: "Hasta $2M" },
  { value: 3000000, label: "Hasta $3M" },
  { value: 5000000, label: "Hasta $5M" },
  { value: 10000000, label: "Sin límite" },
];

const EXTRAS = [
  { key: "parking", label: "Parqueadero", icon: Car },
  { key: "furnished", label: "Amoblado", icon: Sofa },
];

function StepDots({ total, current }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === current ? "w-6 gradient-cta" : i < current ? "w-1.5 bg-brand-violet/50" : "w-1.5 bg-border"
          )}
        />
      ))}
    </div>
  );
}

function QuizOption({ selected, onClick, children, className, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border-2 transition-all",
        compact ? "px-4 py-3" : "px-4 py-3.5",
        selected
          ? "border-brand-violet bg-brand-violet/[0.06] shadow-sm ring-1 ring-brand-violet/20"
          : "border-border/60 bg-white hover:border-brand-violet/30 hover:bg-secondary/30",
        className
      )}
    >
      {children}
    </button>
  );
}

function OptionCheck({ selected }) {
  return (
    <span
      className={cn(
        "ml-auto shrink-0 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all",
        selected ? "gradient-cta border-transparent text-white" : "border-border/60 bg-white"
      )}
    >
      {selected && <Check className="w-3 h-3" strokeWidth={3} />}
    </span>
  );
}

function IconBubble({ icon: Icon, selected }) {
  return (
    <span
      className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
        selected ? "gradient-cta text-white shadow-sm" : "bg-brand-violet/10 text-brand-violet"
      )}
    >
      <Icon className="w-4 h-4" strokeWidth={2.25} />
    </span>
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
  const StepIcon = STEP_ICONS[current.id] || Sparkles;
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

  const handleOpenChange = (value) => {
    onOpenChange(value);
    if (!value) setStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden rounded-3xl border border-border/50 shadow-2xl max-h-[min(92vh,720px)] flex flex-col">
        <div className="shrink-0">
          <div className="h-1 bg-secondary">
            <motion.div className="h-full gradient-cta" animate={{ width: `${progress}%` }} transition={{ duration: 0.25 }} />
          </div>

          <div className="gradient-hero px-5 sm:px-7 pt-5 pb-4 border-b border-border/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl gradient-cta flex items-center justify-center shadow-md shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Match inteligente
                </p>
                <p className="text-xs font-semibold text-foreground/70 mt-0.5">
                  Paso {step + 1} de {QUIZ_STEPS.length}
                </p>
              </div>
            </div>
            <StepDots total={QUIZ_STEPS.length} current={step} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[hsl(35,25%,98%)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-3 mb-5">
                <IconBubble icon={StepIcon} selected />
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">{current.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{current.subtitle}</p>
                </div>
              </div>

              {current.id === "city" && (
                <div className="grid grid-cols-2 gap-2.5">
                  <QuizOption
                    selected={!prefs.city}
                    onClick={() => setPrefs({ ...prefs, city: "", zone: "" })}
                    className="col-span-2 flex items-center gap-3"
                  >
                    <IconBubble icon={MapPin} selected={!prefs.city} />
                    <span className="font-bold text-sm">Ambas ciudades</span>
                    <OptionCheck selected={!prefs.city} />
                  </QuizOption>
                  {CITIES.map((c) => (
                    <QuizOption
                      key={c.id}
                      selected={prefs.city === c.name}
                      onClick={() => setPrefs({ ...prefs, city: c.name, zone: "" })}
                      className="flex items-center gap-3"
                    >
                      <IconBubble icon={MapPin} selected={prefs.city === c.name} />
                      <span className="font-bold text-sm">{c.name}</span>
                      <OptionCheck selected={prefs.city === c.name} />
                    </QuizOption>
                  ))}
                </div>
              )}

              {current.id === "zone" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <QuizOption
                    selected={!prefs.zone}
                    onClick={() => setPrefs({ ...prefs, zone: "" })}
                    className="col-span-2 sm:col-span-3 text-center font-bold text-sm"
                    compact
                  >
                    {prefs.city ? `Toda ${prefs.city}` : "Cualquier zona"}
                  </QuizOption>
                  {zones.map((z) => (
                    <QuizOption
                      key={z}
                      selected={prefs.zone === z}
                      onClick={() => setPrefs({ ...prefs, zone: z })}
                      className="text-center text-xs sm:text-sm font-bold"
                      compact
                    >
                      {z}
                    </QuizOption>
                  ))}
                </div>
              )}

              {current.id === "type" && (
                <div className="grid grid-cols-2 gap-2.5">
                  {TYPES.map((t) => (
                    <QuizOption
                      key={t.value}
                      selected={prefs.type === t.value}
                      onClick={() => setPrefs({ ...prefs, type: t.value })}
                      className="flex flex-col items-center text-center gap-2 py-4"
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <span className="font-bold text-sm">{t.label}</span>
                    </QuizOption>
                  ))}
                </div>
              )}

              {current.id === "beds" && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {BEDS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setPrefs({ ...prefs, beds: b })}
                      className={cn(
                        "min-w-[3.25rem] h-12 px-5 rounded-2xl border-2 text-sm font-extrabold transition-all",
                        prefs.beds === b
                          ? "gradient-cta text-white border-transparent shadow-md"
                          : "border-border/60 bg-white hover:border-brand-violet/30"
                      )}
                    >
                      {b === "5" ? "5+" : b}
                    </button>
                  ))}
                </div>
              )}

              {current.id === "baths" && (
                <div className="space-y-3">
                  <QuizOption
                    selected={prefs.bathrooms === "all"}
                    onClick={() => setPrefs({ ...prefs, bathrooms: "all" })}
                    className="text-center font-bold text-sm"
                  >
                    Cualquiera
                  </QuizOption>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {BATHS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setPrefs({ ...prefs, bathrooms: b })}
                        className={cn(
                          "min-w-[3.25rem] h-12 px-5 rounded-2xl border-2 text-sm font-extrabold transition-all inline-flex items-center justify-center gap-1.5",
                          prefs.bathrooms === b
                            ? "gradient-cta text-white border-transparent shadow-md"
                            : "border-border/60 bg-white hover:border-brand-violet/30"
                        )}
                      >
                        <Bath className="w-4 h-4" />
                        {b === "5" ? "5+" : b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {current.id === "budget" && (
                <div className="grid grid-cols-1 gap-2">
                  {BUDGETS.map((b) => (
                    <QuizOption
                      key={b.value}
                      selected={prefs.maxPrice === b.value}
                      onClick={() => setPrefs({ ...prefs, maxPrice: b.value })}
                      className="flex items-center gap-3"
                    >
                      <IconBubble icon={Wallet} selected={prefs.maxPrice === b.value} />
                      <span className="font-bold text-sm">{b.label}</span>
                      <OptionCheck selected={prefs.maxPrice === b.value} />
                    </QuizOption>
                  ))}
                </div>
              )}

              {current.id === "elevator" && (
                <div className="grid grid-cols-1 gap-2">
                  {ELEVATOR_OPTIONS.map((opt) => (
                    <QuizOption
                      key={opt.label}
                      selected={prefs.elevator === opt.value}
                      onClick={() => setPrefs({ ...prefs, elevator: opt.value })}
                      className="flex items-center gap-3"
                    >
                      <IconBubble icon={ElevatorIcon} selected={prefs.elevator === opt.value} />
                      <span className="font-bold text-sm">{opt.label}</span>
                      <OptionCheck selected={prefs.elevator === opt.value} />
                    </QuizOption>
                  ))}
                </div>
              )}

              {current.id === "pets" && (
                <div className="grid grid-cols-1 gap-2.5">
                  {PETS_OPTIONS.map((opt) => (
                    <QuizOption
                      key={opt.value}
                      selected={prefs.pets === opt.value}
                      onClick={() => setPrefs({ ...prefs, pets: opt.value })}
                      className="flex items-start gap-3"
                    >
                      <IconBubble icon={PawPrint} selected={prefs.pets === opt.value} />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm">{opt.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                      </div>
                      <OptionCheck selected={prefs.pets === opt.value} />
                    </QuizOption>
                  ))}
                </div>
              )}

              {current.id === "extras" && (
                <div className="grid grid-cols-1 gap-2">
                  {EXTRAS.map((e) => (
                    <QuizOption
                      key={e.key}
                      selected={prefs[e.key]}
                      onClick={() => setPrefs({ ...prefs, [e.key]: !prefs[e.key] })}
                      className="flex items-center gap-3"
                    >
                      <IconBubble icon={e.icon} selected={prefs[e.key]} />
                      <span className="font-bold text-sm">{e.label}</span>
                      <OptionCheck selected={prefs[e.key]} />
                    </QuizOption>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="shrink-0 flex items-center justify-between gap-3 px-5 sm:px-7 py-4 border-t border-border/40 bg-white">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors px-2 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </button>
          <button
            type="button"
            onClick={next}
            className="flex items-center gap-2 gradient-cta btn-glow text-white font-bold px-7 py-3 rounded-full hover:opacity-95 transition-opacity shadow-md"
          >
            {step === QUIZ_STEPS.length - 1 ? QUIZ_FINISH_CTA : "Siguiente"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
