import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Target, KeyRound, ArrowRight, Compass } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import { INTERIORS } from "@/lib/colombiaImages";
import { cn } from "@/lib/utils";

const steps = [
  {
    num: "01",
    icon: Sparkles,
    title: "Haz el quiz",
    desc: "Ciudad, habitaciones, presupuesto y lo que de verdad te importa.",
    tag: "2 minutos",
    accent: "from-[hsl(340,82%,52%)] to-[hsl(265,75%,58%)]",
    ring: "ring-[hsl(340,82%,52%)]/20",
    image: INTERIORS.estudio,
    preview: (
      <div className="flex flex-wrap gap-1.5">
        {["Bogotá", "2 hab", "$2.5M", "Mascotas"].map((pill) => (
          <span key={pill} className="px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-bold text-foreground shadow-sm border border-border/40">
            {pill}
          </span>
        ))}
      </div>
    ),
  },
  {
    num: "02",
    icon: Target,
    title: "Recibe tus matches",
    desc: "Solo inmuebles que encajan contigo. Sin anuncios que no van contigo.",
    tag: "Match real",
    accent: "from-[hsl(265,75%,58%)] to-[hsl(200,90%,50%)]",
    ring: "ring-[hsl(265,75%,58%)]/20",
    image: INTERIORS.sala,
    preview: (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {[92, 88, 95].map((score) => (
            <div
              key={score}
              className="w-8 h-8 rounded-full gradient-cta flex items-center justify-center text-[9px] font-extrabold text-white ring-2 ring-white"
            >
              {score}%
            </div>
          ))}
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground">compatibles contigo</span>
      </div>
    ),
  },
  {
    num: "03",
    icon: KeyRound,
    title: "Haz tu mudanza",
    desc: "Guarda favoritos, agenda visitas y nosotros gestionamos todo por ti.",
    tag: "Gestión completa",
    accent: "from-[hsl(168,72%,40%)] to-[hsl(32,95%,54%)]",
    ring: "ring-[hsl(168,72%,40%)]/20",
    image: INTERIORS.dormitorio,
    preview: (
      <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/80">
        <span className="px-2 py-1 rounded-lg bg-white/90 border border-border/40 shadow-sm">♥ Favoritos</span>
        <span className="px-2 py-1 rounded-lg bg-white/90 border border-border/40 shadow-sm">📅 Visita</span>
        <span className="px-2 py-1 rounded-lg bg-white/90 border border-border/40 shadow-sm">Equipo Match</span>
      </div>
    ),
  },
];

export default function MatchSteps({ onStartQuiz }) {
  return (
    <section className="section-pad relative overflow-hidden bg-[hsl(240,40%,98%)] border-y border-border/40">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[hsl(340,82%,52%)]/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[hsl(265,75%,58%)]/8 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-14">
          <SectionHeader
            eyebrow="Cómo funciona"
            title={
              <>
                Tu match en <span className="text-gradient">3 pasos</span>
              </>
            }
            subtitle="Menos scroll. Más claridad. Inmuebles que sí van contigo."
            className="max-w-xl"
          />
          <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-muted-foreground shrink-0">
            <Compass className="w-4 h-4 text-[hsl(265,75%,50%)]" />
            Bogotá y Barranquilla
          </div>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-[4.5rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[hsl(265,75%,58%)]/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative flex flex-col rounded-3xl bg-white border border-border/50 shadow-sm overflow-hidden card-hover"
                >
                  <div className={cn("h-1.5 w-full bg-gradient-to-r", step.accent)} />

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md ring-4",
                            step.accent,
                            step.ring
                          )}
                        >
                          <Icon className="w-5 h-5" strokeWidth={2.25} />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                          Paso {step.num}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                        {step.tag}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xl mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{step.desc}</p>

                    <div className="mb-4">{step.preview}</div>

                    <div className="relative h-28 sm:h-32 rounded-2xl overflow-hidden">
                      <img
                        src={step.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-white text-xs font-bold drop-shadow">MatchColombia</span>
                        <span className={cn("text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full bg-gradient-to-r", step.accent)}>
                          {step.num}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-cta btn-glow text-white font-bold px-8 py-3.5 rounded-full hover:opacity-95 transition-opacity"
          >
            Empieza tu match
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            to="/explorar"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-foreground border-2 border-border/60 bg-white hover:bg-secondary/60 transition-colors"
          >
            Explorar manualmente
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
