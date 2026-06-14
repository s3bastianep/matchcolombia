import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Shield, Sparkles, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const pillars = [
  {
    id: "comodidad",
    icon: Smartphone,
    tag: "Comodidad",
    title: "Todo en un solo lugar",
    desc: "Publica, postula, agenda visitas o habla con nosotros. Todo desde tu celular o computadora, sin ir de portal en portal.",
    accent: "from-brand-magenta to-brand-violet",
    bg: "bg-brand-magenta/5",
  },
  {
    id: "confianza",
    icon: Shield,
    tag: "Confianza",
    title: "Te respaldamos de verdad",
    desc: "Verificamos inmuebles, gestionamos consultas y te acompañamos en cada paso. Nosotros hablamos con los interesados por ti.",
    accent: "from-brand-violet to-brand-magenta",
    bg: "bg-brand-violet/5",
  },
  {
    id: "simplicidad",
    icon: Sparkles,
    tag: "Simplicidad",
    title: "Arrienda sin estrés",
    desc: "Match inteligente sin scroll infinito. Solo ves lo que encaja contigo y nuestro equipo se encarga del resto.",
    accent: "from-brand-magenta to-brand-violet",
    bg: "bg-brand-magenta/5",
  },
];

export default function WhyMatchSection() {
  const [open, setOpen] = useState("comodidad");

  return (
    <section className="section-pad bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-violet mb-3">¿Por qué MatchColombia?</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
            Hicimos el arriendo tan fácil
            <br />
            <span className="text-gradient">como debería ser</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Nos encargamos de todo y solo ves inmuebles que encajan contigo. Sin trámites eternos, sin incertidumbre.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isOpen = open === pillar.id;
            return (
              <motion.button
                key={pillar.id}
                type="button"
                onClick={() => setOpen(isOpen ? "" : pillar.id)}
                layout
                className={cn(
                  "text-left rounded-3xl border transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "border-border/60 shadow-xl shadow-brand-violet/8 bg-white lg:col-span-1"
                    : "border-border/40 bg-background hover:border-border/60"
                )}
              >
                <div className={cn("p-6 sm:p-7", isOpen && pillar.bg)}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className={cn("w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md", pillar.accent)}>
                      <Icon className="w-5 h-5" strokeWidth={2.25} />
                    </div>
                    <div className={cn("w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors", isOpen ? "bg-foreground text-white border-foreground" : "border-border bg-white")}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">{pillar.tag}</p>
                  <h3 className="font-extrabold text-lg sm:text-xl leading-snug">{pillar.title}</h3>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-muted-foreground leading-relaxed mt-3"
                      >
                        {pillar.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
