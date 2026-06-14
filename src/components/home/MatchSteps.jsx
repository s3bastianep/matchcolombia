import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Target, KeyRound, ArrowRight, Compass } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import { cn } from "@/lib/utils";

const steps = [
  {
    num: "01",
    icon: Sparkles,
    title: "Cuéntanos qué buscas",
    desc: "Ciudad, habitaciones y presupuesto para filtrar inmuebles verificados.",
    tag: "Match inteligente",
    accent: "from-brand-magenta to-brand-violet",
    pills: ["Verificado", "Sin estafas", "Sin sustos"],
  },
  {
    num: "02",
    icon: Target,
    title: "Recibe tu selección",
    desc: "Solo inmuebles verificados por MatchColombia. Precio real, fotos reales.",
    tag: "100% verificados",
    accent: "from-brand-magenta to-brand-violet",
    pills: ["92% match", "88% match", "95% match"],
  },
  {
    num: "03",
    icon: KeyRound,
    title: "Haz tu mudanza",
    desc: "Guarda favoritos, agenda visitas y nosotros gestionamos todo por ti.",
    tag: "Gestión completa",
    accent: "from-brand-violet to-brand-magenta",
    pills: ["Favoritos", "Visita", "Equipo Match"],
  },
];

function StepCard({ step, index }) {
  const Icon = step.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative h-full flex flex-col items-center text-center rounded-2xl border border-border/50 bg-white p-6 sm:p-7 shadow-sm"
    >
      <div className="relative mb-5">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md",
            step.accent
          )}
        >
          <Icon className="w-6 h-6" strokeWidth={2.25} />
        </div>
        <span
          className={cn(
            "absolute -top-2 -right-3 text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full bg-gradient-to-r",
            step.accent
          )}
        >
          {step.num}
        </span>
      </div>

      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-secondary/60 text-muted-foreground">
        {step.tag}
      </span>

      <h3 className="font-extrabold text-lg sm:text-xl mt-4 mb-2 tracking-tight text-foreground leading-snug">
        {step.title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed min-h-[2.75rem] sm:min-h-[3rem] max-w-[16rem] mx-auto">
        {step.desc}
      </p>

      <div className="mt-auto pt-5 flex flex-wrap justify-center gap-1.5 w-full">
        {step.pills.map((pill) => (
          <span
            key={pill}
            className="px-2.5 py-1 rounded-full bg-background text-[10px] font-semibold text-foreground/75 border border-border/50 whitespace-nowrap"
          >
            {pill}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export default function MatchSteps({ onStartQuiz }) {
  return (
    <section className="section-pad relative overflow-hidden bg-white border-y border-border/40">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-brand-violet/5 blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-brand-magenta/5 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-12">
          <SectionHeader
            eyebrow="Cómo funciona"
            title={
              <>
                Tu match en <span className="text-gradient">3 pasos</span>
              </>
            }
            subtitle="Match inteligente con inmuebles 100% verificados. Sin estafas, sin sustos."
            className="max-w-xl"
          />
          <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-muted-foreground shrink-0 pb-1">
            <Compass className="w-4 h-4 text-brand-violet" />
            Bogotá y Barranquilla
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {steps.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-cta btn-glow text-white font-bold px-8 py-3.5 rounded-full hover:opacity-95 transition-opacity"
          >
            Match inteligente
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            to="/explorar"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-foreground border-2 border-border/60 bg-background hover:bg-secondary/60 transition-colors"
          >
            Explorar manualmente
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
