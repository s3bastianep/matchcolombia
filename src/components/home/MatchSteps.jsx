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
    desc: "Ciudad, habitaciones y presupuesto — solo para filtrar entre inmuebles verificados.",
    tag: "Match inteligente",
    accent: "from-[hsl(340,82%,52%)] to-[hsl(265,75%,58%)]",
    pills: ["Verificados", "Sin estafas", "Sin sustos"],
  },
  {
    num: "02",
    icon: Target,
    title: "Recibe tu selección",
    desc: "Solo inmuebles 100% verificados por MatchColombia. Precio real, fotos reales.",
    tag: "100% verificados",
    accent: "from-[hsl(265,75%,58%)] to-[hsl(200,90%,50%)]",
    scores: [92, 88, 95],
  },
  {
    num: "03",
    icon: KeyRound,
    title: "Haz tu mudanza",
    desc: "Guarda favoritos, agenda visitas y nosotros gestionamos todo por ti.",
    tag: "Gestión completa",
    accent: "from-[hsl(168,72%,40%)] to-[hsl(32,95%,54%)]",
    pills: ["Favoritos", "Visita", "Equipo Match"],
  },
];

export default function MatchSteps({ onStartQuiz }) {
  return (
    <section className="section-pad relative overflow-hidden bg-white border-y border-border/40">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-[hsl(265,75%,58%)]/5 blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[hsl(340,82%,52%)]/5 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 sm:mb-16">
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
            <Compass className="w-4 h-4 text-[hsl(265,75%,50%)]" />
            Bogotá y Barranquilla
          </div>
        </div>

        {/* Timeline horizontal — sin fotos, distinto a RentEasy */}
        <div className="relative">
          <div className="hidden lg:block absolute top-[2.75rem] left-[12%] right-[12%] h-[2px]">
            <div className="h-full bg-gradient-to-r from-[hsl(340,82%,52%)]/20 via-[hsl(265,75%,58%)]/40 to-[hsl(168,72%,40%)]/20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center"
                >
                  {/* Línea vertical en mobile */}
                  {i < steps.length - 1 && (
                    <div className="lg:hidden absolute left-[1.65rem] top-14 bottom-0 w-px bg-gradient-to-b from-[hsl(265,75%,58%)]/30 to-transparent" />
                  )}

                  <div className="relative shrink-0 z-10">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg ring-4 ring-white",
                        step.accent
                      )}
                    >
                      <Icon className="w-6 h-6" strokeWidth={2.25} />
                    </div>
                    <span
                      className={cn(
                        "absolute -top-2 -right-2 lg:-top-3 lg:-right-4 text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full bg-gradient-to-r shadow-sm",
                        step.accent
                      )}
                    >
                      {step.num}
                    </span>
                  </div>

                  <div className="flex-1 lg:flex-none pt-1 lg:pt-6">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[hsl(240,40%,98%)] text-muted-foreground border border-border/50">
                      {step.tag}
                    </span>
                    <h3 className="font-extrabold text-xl sm:text-[1.35rem] mt-3 mb-2 tracking-tight">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs lg:mx-auto">{step.desc}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5 lg:justify-center">
                      {step.pills?.map((pill) => (
                        <span key={pill} className="px-2.5 py-1 rounded-full bg-[hsl(240,40%,98%)] text-[10px] font-bold text-foreground border border-border/40">
                          {pill}
                        </span>
                      ))}
                      {step.scores?.map((score) => (
                        <span
                          key={score}
                          className="w-8 h-8 rounded-full gradient-cta flex items-center justify-center text-[9px] font-extrabold text-white"
                        >
                          {score}%
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-foreground border-2 border-border/60 bg-[hsl(240,40%,98%)] hover:bg-secondary/60 transition-colors"
          >
            Explorar manualmente
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
