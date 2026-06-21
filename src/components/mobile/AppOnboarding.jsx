import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, CalendarCheck, ChevronRight } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";
import { hapticLight } from "@/lib/haptics";

const STORAGE_KEY = "habibar_onboarding_done";

const SLIDES = [
  {
    icon: Search,
    title: "Explora inmuebles verificados",
    description: "Apartamentos y casas revisados en Bogotá, con fotos reales y precios claros.",
    tone: "text-brand-violet",
    bg: "bg-brand-violet/10",
  },
  {
    icon: Sparkles,
    title: "Cuestionario Habibar",
    description: "Cuéntanos qué buscas y te mostramos los inmuebles que mejor encajan contigo.",
    tone: "text-brand-magenta",
    bg: "bg-brand-magenta/10",
  },
  {
    icon: CalendarCheck,
    title: "Agenda tu visita",
    description: "Elige fecha y hora. Nosotros coordinamos todo el proceso por ti.",
    tone: "text-brand-violet",
    bg: "bg-brand-violet/10",
  },
];

export function hasCompletedOnboarding() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
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
        <BrandLogo size="lg" layout="lockup" />
        <button type="button" onClick={finish} className="text-sm font-semibold text-muted-foreground px-2 py-1">
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
        <button type="button" onClick={next} className="app-btn-primary w-full flex items-center justify-center gap-2 py-4 text-sm font-bold">
          {isLast ? "Empezar" : "Siguiente"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
