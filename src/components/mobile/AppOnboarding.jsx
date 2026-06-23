import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, CalendarCheck, Building2, ChevronRight } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";
import { hapticLight } from "@/lib/haptics";
import { BRAND } from "@/lib/brand";

const STORAGE_KEY = "habibar_onboarding_v2_done";

const SLIDES = [
  {
    icon: Search,
    title: "Arriendos verificados en Bogotá",
    description:
      "Explora apartamentos y casas con fotos reales, precios claros y filtros por zona. Más fácil, rápido y seguro.",
    tone: "text-brand-violet",
    bg: "bg-brand-violet/10",
  },
  {
    icon: Sparkles,
    title: "Match inteligente",
    description: "Cuéntanos qué buscas en 2 minutos y te mostramos los inmuebles que mejor encajan contigo.",
    tone: "text-brand-magenta",
    bg: "bg-brand-magenta/10",
  },
  {
    icon: CalendarCheck,
    title: "Agenda tu visita",
    description: "Elige fecha y horario. El equipo de HABIBAR coordina la visita y te acompaña en el proceso.",
    tone: "text-brand-violet",
    bg: "bg-brand-violet/10",
  },
  {
    icon: Building2,
    title: "¿Tienes un inmueble?",
    description: `Publica gratis en ${BRAND.name}, delega visitas y cobros, y haz seguimiento desde tu panel de propietario.`,
    tone: "text-brand-magenta",
    bg: "bg-brand-magenta/10",
  },
];

export function hasCompletedOnboarding() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function shouldShowAppOnboarding() {
  if (typeof window === "undefined") return false;
  if (hasCompletedOnboarding()) return false;
  return window.matchMedia("(max-width: 1023px)").matches;
}

export function markOnboardingComplete() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export default function AppOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const Icon = slide.icon;
  const isLast = step === SLIDES.length - 1;

  const finish = () => {
    markOnboardingComplete();
    onComplete?.();
  };

  const next = () => {
    hapticLight();
    if (isLast) finish();
    else setStep((s) => s + 1);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col pt-safe pb-safe">
      <div className="flex items-center justify-between px-5 h-12">
        <BrandLogo size="lg" layout="lockup" link={false} />
        <button
          type="button"
          onClick={finish}
          className="text-sm font-semibold text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          Omitir
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center max-w-sm"
          >
            <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-8", slide.bg)}>
              <Icon className={cn("w-9 h-9", slide.tone)} strokeWidth={1.75} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-violet mb-2">
              {step + 1} de {SLIDES.length}
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground leading-tight">{slide.title}</h2>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{slide.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-4 space-y-5">
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-6 bg-brand-violet" : "w-1.5 bg-border"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          className="app-btn-primary w-full flex items-center justify-center gap-2 py-4 text-sm font-bold"
        >
          {isLast ? "Empezar" : "Siguiente"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
