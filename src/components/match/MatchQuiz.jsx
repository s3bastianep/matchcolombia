import React, { useState, useEffect } from "react";
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
  Waves,
  Dumbbell,
  Flame,
  Zap,
  UtensilsCrossed,
  Droplets,
  Layers,
  PanelTopOpen,
  Ban,
  Bath,
  Bed,
  Building2,
  MapPin,
  Wallet,
  SlidersHorizontal,
  Home,
  LayoutGrid,
} from "lucide-react";
import ElevatorIcon from "@/components/icons/ElevatorIcon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { savePreferences, buildExploreUrl, asSelectionList } from "@/lib/matchPreferences";
import { CITIES, getZonesForCity } from "@/lib/colombia";
import { QUIZ_FINISH_CTA, QUIZ_STEPS, EXPLORE_DEFAULT_CITY } from "@/lib/siteCopy";
import { trackEvent } from "@/lib/analytics";
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
  kitchen: UtensilsCrossed,
  shower: Droplets,
  flooring: Layers,
  balcony: PanelTopOpen,
  extras: SlidersHorizontal,
};

const TYPES = [
  { value: "apartamento", label: "Apartamento", desc: "Edificio o conjunto cerrado", icon: Building2 },
  { value: "casa", label: "Casa", desc: "Independiente o en conjunto", icon: Home },
  { value: "estudio", label: "Estudio", desc: "Espacio compacto integrado", icon: LayoutGrid },
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

const KITCHEN_OPTIONS = [
  { value: "electrica", label: "Cocina eléctrica", icon: Zap },
  { value: "gas", label: "Cocina a gas", icon: Flame },
  { value: "", label: "Me da igual", icon: Sparkles },
];

const SHOWER_OPTIONS = [
  { value: "electrica", label: "Ducha eléctrica", icon: Zap },
  { value: "gas", label: "Ducha a gas", icon: Flame },
  { value: "", label: "Me da igual", icon: Sparkles },
];

const FLOORING_OPTIONS = [
  { value: "madera", label: "Piso en madera", icon: Layers },
  { value: "porcelanato", label: "Piso en porcelanato", icon: LayoutGrid },
  { value: "", label: "Me da igual", icon: Sparkles },
];

const BALCONY_OPTIONS = [
  { value: "si", label: "Con balcón", icon: PanelTopOpen },
  { value: "no", label: "Sin balcón", icon: Ban },
  { value: "", label: "Me da igual", icon: Sparkles },
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
  { key: "pool", label: "Piscina", icon: Waves },
  { key: "gym", label: "Gimnasio", icon: Dumbbell },
];

function PreferenceOptions({ options, selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {options.map((opt) => (
        <QuizOption
          key={opt.label}
          selected={selected === opt.value}
          onClick={() => onSelect(opt.value)}
          className="flex items-center gap-3"
        >
          <IconBubble icon={opt.icon} selected={selected === opt.value} />
          <span className="font-bold text-sm">{opt.label}</span>
          <OptionCheck selected={selected === opt.value} />
        </QuizOption>
      ))}
    </div>
  );
}

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

function StepQuestionIcon({ icon: Icon }) {
  return (
    <span className="w-11 h-11 rounded-2xl bg-white border border-brand-violet/15 flex items-center justify-center shrink-0 shadow-sm">
      <Icon className="w-5 h-5 text-brand-violet" strokeWidth={1.75} />
    </span>
  );
}

function toggleSelection(list, value) {
  const current = asSelectionList(list);
  if (current.includes(value)) return current.filter((v) => v !== value);
  return [...current, value].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

function formatCountSelection(list, { singular, plural, plusLabel = "5 o más" }) {
  const selected = asSelectionList(list);
  if (!selected.length) return "Cualquier cantidad";
  const parts = selected.map((v) => (v === "5" ? plusLabel : v));
  const label = parts.length === 1 ? parts[0] : parts.join(" y ");
  const unit = selected.length === 1 && selected[0] === "1" ? singular : plural;
  return `${label} ${unit}`;
}

function MultiNumberSelectGrid({ values, selectedList, onToggle, unit, icon: Icon }) {
  const selected = asSelectionList(selectedList);
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
      {values.map((v) => {
        const isSelected = selected.includes(v);
        const display = v === "5" ? "5+" : v;
        const unitLabel = v === "1" ? unit.singular : unit.plural;

        return (
          <button
            key={v}
            type="button"
            onClick={() => onToggle(v)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 py-4 px-1.5 rounded-2xl border-2 transition-all min-h-[96px]",
              isSelected
                ? "border-brand-violet bg-white shadow-md ring-1 ring-brand-violet/15"
                : "border-border/50 bg-white hover:border-brand-violet/25 hover:shadow-sm"
            )}
          >
            {isSelected && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full gradient-cta flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </span>
            )}
            <Icon
              className={cn("w-4 h-4", isSelected ? "text-brand-violet" : "text-muted-foreground/45")}
              strokeWidth={1.75}
            />
            <span
              className={cn(
                "text-2xl sm:text-[1.65rem] font-extrabold tabular-nums leading-none",
                isSelected ? "text-brand-violet" : "text-foreground"
              )}
            >
              {display}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{unitLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

function TypeOptionCard({ type, selected, onClick }) {
  const Icon = type.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-center",
        selected
          ? "border-brand-violet bg-white shadow-md ring-1 ring-brand-violet/15"
          : "border-border/50 bg-white hover:border-brand-violet/25 hover:shadow-sm"
      )}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
          selected ? "gradient-cta text-white shadow-sm" : "bg-[hsl(265,40%,96%)] text-brand-violet"
        )}
      >
        <Icon className="w-7 h-7" strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-extrabold text-sm text-foreground">{type.label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{type.desc}</p>
      </div>
      {selected && (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-violet">
          <Check className="w-3 h-3" strokeWidth={3} />
          Seleccionado
        </span>
      )}
    </button>
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

const OPTIONAL_QUIZ_STEPS = new Set(["zone", "kitchen", "shower", "flooring", "balcony", "elevator"]);

export default function MatchQuiz({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState({
    city: "",
    zone: "",
    zones: [],
    types: ["apartamento"],
    type: "apartamento",
    beds: ["2"],
    bathrooms: [],
    maxPrice: 3000000,
    elevator: "",
    pets: "",
    kitchenType: "",
    showerType: "",
    flooringType: "",
    balcony: "",
    parking: false,
    furnished: false,
    pool: false,
    gym: false,
  });

  const current = QUIZ_STEPS[step];
  const canSkip = OPTIONAL_QUIZ_STEPS.has(current.id);
  const StepIcon = STEP_ICONS[current.id] || Sparkles;
  const progress = ((step + 1) / QUIZ_STEPS.length) * 100;
  const activeCity = prefs.city || CITIES[0]?.name || EXPLORE_DEFAULT_CITY;
  const zones = getZonesForCity(activeCity);
  const selectedZones = asSelectionList(prefs.zones?.length ? prefs.zones : prefs.zone);
  const selectedTypes = asSelectionList(prefs.types?.length ? prefs.types : prefs.type);

  useEffect(() => {
    if (open) trackEvent("quiz_open", { label: "Match inteligente" });
  }, [open]);

  const finish = () => {
    const normalized = {
      ...prefs,
      types: selectedTypes,
      type: selectedTypes.length === 1 ? selectedTypes[0] : selectedTypes.length ? selectedTypes.join(",") : "all",
      zones: selectedZones,
      zone: selectedZones.length === 1 ? selectedZones[0] : "",
    };
    savePreferences(normalized);
    trackEvent("quiz_complete", { label: "Match completado" });
    onOpenChange(false);
    setStep(0);
    navigate(buildExploreUrl(normalized));
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
              <div className="w-11 h-11 rounded-2xl bg-white border border-border/50 flex items-center justify-center shadow-sm shrink-0">
                <Sparkles className="w-5 h-5 text-brand-violet" strokeWidth={2} />
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
              <div className="flex items-start gap-3 mb-6">
                <StepQuestionIcon icon={StepIcon} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">{current.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{current.subtitle}</p>
                </div>
              </div>

              {current.id === "city" && (
                <div className="grid grid-cols-2 gap-2.5">
                  <QuizOption
                    selected={!prefs.city}
                    onClick={() => setPrefs({ ...prefs, city: "", zone: "", zones: [] })}
                    className="col-span-2 flex items-center gap-3"
                  >
                    <IconBubble icon={MapPin} selected={!prefs.city} />
                    <span className="font-bold text-sm">
                      {CITIES.length === 1 ? `Toda ${CITIES[0].name}` : "Toda la ciudad"}
                    </span>
                    <OptionCheck selected={!prefs.city} />
                  </QuizOption>
                  {CITIES.map((c) => (
                    <QuizOption
                      key={c.id}
                      selected={prefs.city === c.name}
                      onClick={() => setPrefs({ ...prefs, city: c.name, zone: "", zones: [] })}
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
                    selected={!selectedZones.length}
                    onClick={() => setPrefs({ ...prefs, zone: "", zones: [] })}
                    className="col-span-2 sm:col-span-3 text-center font-bold text-sm"
                    compact
                  >
                    {activeCity ? `Toda ${activeCity}` : "Cualquier zona"}
                  </QuizOption>
                  {zones.map((z) => (
                    <QuizOption
                      key={z}
                      selected={selectedZones.includes(z)}
                      onClick={() => {
                        const next = toggleSelection(selectedZones, z);
                        setPrefs({
                          ...prefs,
                          zones: next,
                          zone: next.length === 1 ? next[0] : "",
                        });
                      }}
                      className="text-center text-xs sm:text-sm font-bold"
                      compact
                    >
                      {z}
                    </QuizOption>
                  ))}
                </div>
              )}

              {current.id === "type" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TYPES.map((t) => (
                    <TypeOptionCard
                      key={t.value}
                      type={t}
                      selected={selectedTypes.includes(t.value)}
                      onClick={() => {
                        const next = toggleSelection(selectedTypes, t.value);
                        setPrefs({
                          ...prefs,
                          types: next,
                          type: next.length === 1 ? next[0] : next.length ? next.join(",") : "all",
                        });
                      }}
                    />
                  ))}
                </div>
              )}

              {current.id === "beds" && (
                <div className="rounded-2xl border border-border/40 bg-white p-4 sm:p-5 shadow-sm">
                  <MultiNumberSelectGrid
                    values={BEDS}
                    selectedList={prefs.beds}
                    onToggle={(b) => setPrefs({ ...prefs, beds: toggleSelection(prefs.beds, b) })}
                    unit={{ singular: "hab.", plural: "hab." }}
                    icon={Bed}
                  />
                  <p className="text-center text-[11px] text-muted-foreground mt-4 font-medium">
                    Seleccionado:{" "}
                    <span className="font-bold text-foreground">
                      {formatCountSelection(prefs.beds, {
                        singular: "habitación",
                        plural: "habitaciones",
                        plusLabel: "5+",
                      })}
                    </span>
                  </p>
                </div>
              )}

              {current.id === "baths" && (
                <div className="space-y-3">
                  <QuizOption
                    selected={!asSelectionList(prefs.bathrooms).length}
                    onClick={() => setPrefs({ ...prefs, bathrooms: [] })}
                    className="flex items-center gap-3 bg-white"
                  >
                    <StepQuestionIcon icon={Bath} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm">Cualquiera</p>
                      <p className="text-xs text-muted-foreground">Sin mínimo de baños</p>
                    </div>
                    <OptionCheck selected={!asSelectionList(prefs.bathrooms).length} />
                  </QuizOption>
                  <div className="rounded-2xl border border-border/40 bg-white p-4 sm:p-5 shadow-sm">
                    <MultiNumberSelectGrid
                      values={BATHS}
                      selectedList={prefs.bathrooms}
                      onToggle={(b) =>
                        setPrefs({ ...prefs, bathrooms: toggleSelection(prefs.bathrooms, b) })
                      }
                      unit={{ singular: "baño", plural: "baños" }}
                      icon={Bath}
                    />
                    {asSelectionList(prefs.bathrooms).length > 0 && (
                      <p className="text-center text-[11px] text-muted-foreground mt-4 font-medium">
                        Seleccionado:{" "}
                        <span className="font-bold text-foreground">
                          {formatCountSelection(prefs.bathrooms, {
                            singular: "baño",
                            plural: "baños",
                            plusLabel: "5+",
                          })}
                        </span>
                      </p>
                    )}
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

              {current.id === "kitchen" && (
                <PreferenceOptions
                  options={KITCHEN_OPTIONS}
                  selected={prefs.kitchenType}
                  onSelect={(kitchenType) => setPrefs({ ...prefs, kitchenType })}
                />
              )}

              {current.id === "shower" && (
                <PreferenceOptions
                  options={SHOWER_OPTIONS}
                  selected={prefs.showerType}
                  onSelect={(showerType) => setPrefs({ ...prefs, showerType })}
                />
              )}

              {current.id === "flooring" && (
                <PreferenceOptions
                  options={FLOORING_OPTIONS}
                  selected={prefs.flooringType}
                  onSelect={(flooringType) => setPrefs({ ...prefs, flooringType })}
                />
              )}

              {current.id === "balcony" && (
                <PreferenceOptions
                  options={BALCONY_OPTIONS}
                  selected={prefs.balcony}
                  onSelect={(balcony) => setPrefs({ ...prefs, balcony })}
                />
              )}

              {current.id === "extras" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
          <div className="flex items-center gap-2">
            {canSkip && (
              <button
                type="button"
                onClick={next}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2"
              >
                Saltar
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-2 gradient-cta btn-glow text-white font-bold px-7 py-3 rounded-full hover:opacity-95 transition-opacity shadow-md"
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
