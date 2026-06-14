import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  MapPin,
  Wallet,
  BedDouble,
  PawPrint,
  Heart,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import { INTERIORS } from "@/lib/colombiaImages";
import { cn } from "@/lib/utils";

const steps = [
  {
    paso: "Paso 1",
    title: "Cuéntanos qué buscas",
    desc: "Ciudad, habitaciones, presupuesto y lo que no negocias. Solo filtramos inmuebles verificados.",
  },
  {
    paso: "Paso 2",
    title: "Recibe tu selección",
    desc: "Solo te mostramos opciones que encajan contigo. Cada una revisada por MatchColombia.",
  },
  {
    paso: "Paso 3",
    title: "Agenda y mudanza",
    desc: "Reserva tu visita o guarda favoritos. Te acompañamos en todo el proceso.",
  },
];

function QuizMockup() {
  const rows = [
    { icon: MapPin, label: "Ciudad", value: "Bogotá · Chapinero" },
    { icon: Wallet, label: "Presupuesto", value: "$1.5M – $2.2M / mes" },
    { icon: BedDouble, label: "Habitaciones", value: "2 hab. · 2 baños" },
    { icon: PawPrint, label: "Mascotas", value: "Sí, perro mediano" },
  ];

  return (
    <div className="w-full max-w-[220px] mx-auto space-y-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white border border-border/40 shadow-sm"
        >
          <div className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center shrink-0">
            <row.icon className="w-3.5 h-3.5 text-brand-violet" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{row.label}</p>
            <p className="text-[11px] font-semibold text-foreground truncate">{row.value}</p>
          </div>
          <span className="w-5 h-5 rounded-full gradient-cta flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </span>
        </div>
      ))}
    </div>
  );
}

function PropertyMockup() {
  return (
    <div className="relative w-full max-w-[200px] mx-auto">
      <div className="rounded-2xl overflow-hidden bg-white border border-border/40 shadow-md">
        <div className="relative aspect-[4/3] bg-muted">
          <img
            src={INTERIORS.sala}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-2.5 left-2.5">
            <VerifiedBadge size="xs" />
          </div>
          <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full gradient-cta flex items-center justify-center shadow-md">
            <Heart className="w-4 h-4 text-white fill-white" strokeWidth={2} />
          </div>
        </div>
        <div className="p-3 space-y-2">
          <div className="h-2 w-3/4 rounded-full bg-foreground/10" />
          <div className="h-2 w-1/2 rounded-full bg-foreground/8" />
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--brand-verified-bg))] text-[9px] font-bold text-[hsl(var(--brand-verified-fg))] border border-[hsl(var(--brand-verified-border))]">
              100% verificado
            </span>
            <span className="text-[10px] font-extrabold text-brand-violet">92% match</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitMockup() {
  const days = [
    { d: "7", w: "Mié" },
    { d: "8", w: "Jue" },
    { d: "9", w: "Vie", active: true },
    { d: "10", w: "Sáb" },
  ];
  const times = ["08:00", "09:30", "11:00"];

  return (
    <div className="w-full max-w-[180px] mx-auto">
      <div className="rounded-[1.75rem] border-[3px] border-foreground/10 bg-white shadow-lg overflow-hidden">
        <div className="relative aspect-[4/5] bg-muted">
          <img
            src={INTERIORS.dormitorio}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent pt-8">
            <div className="rounded-xl bg-white/95 backdrop-blur-sm p-2.5 shadow-sm">
              <p className="text-[9px] font-bold text-foreground mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-brand-violet" />
                Agendar visita
              </p>
              <div className="flex gap-1 mb-2">
                {days.map((day) => (
                  <div
                    key={day.d}
                    className={cn(
                      "flex-1 rounded-lg py-1 text-center",
                      day.active ? "gradient-cta text-white" : "bg-secondary/60 text-foreground/60"
                    )}
                  >
                    <p className="text-[8px] font-bold leading-none">{day.d}</p>
                    <p className="text-[7px] font-semibold mt-0.5">{day.w}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                {times.map((t, i) => (
                  <span
                    key={t}
                    className={cn(
                      "flex-1 text-center text-[7px] font-bold py-1 rounded-md",
                      i === 1 ? "gradient-cta text-white" : "bg-secondary/50 text-foreground/55"
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const visuals = [QuizMockup, PropertyMockup, VisitMockup];

function StepCard({ step, index }) {
  const Visual = visuals[index];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col h-full rounded-3xl bg-[hsl(40,28%,98%)] border border-[hsl(40,15%,90%)] p-6 sm:p-7 lg:p-8"
    >
      <p className="text-xs font-bold text-brand-violet tracking-wide">{step.paso}</p>
      <h3 className="font-extrabold text-xl sm:text-[1.35rem] text-foreground mt-2 mb-3 leading-snug tracking-tight">
        {step.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>

      <div className="mt-8 flex-1 flex items-end justify-center min-h-[200px] sm:min-h-[220px] pt-4">
        <Visual />
      </div>
    </motion.article>
  );
}

export default function MatchSteps({ onStartQuiz }) {
  return (
    <section className="section-pad relative overflow-hidden bg-[hsl(40,25%,96%)]">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <SectionHeader
            align="center"
            eyebrow="Cómo funciona"
            title={
              <>
                Tu match en <span className="text-gradient">3 pasos</span>
              </>
            }
            subtitle="Match inteligente con inmuebles 100% verificados. Sin estafas, sin sustos."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 px-4 py-3.5 rounded-2xl bg-[hsl(var(--brand-verified-bg))] border border-[hsl(var(--brand-verified-border))] max-w-2xl mx-auto"
        >
          <ShieldCheck className="w-5 h-5 text-[hsl(var(--brand-verified))] shrink-0" strokeWidth={2.25} />
          <p className="text-sm font-semibold text-[hsl(var(--brand-verified-fg))] text-center leading-snug">
            <span className="font-extrabold">Todas las propiedades son verificadas</span>
            {" "}por MatchColombia antes de publicarse
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {steps.map((step, i) => (
            <StepCard key={step.paso} step={step} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button
            type="button"
            onClick={onStartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-cta btn-glow text-white font-bold px-8 py-3.5 rounded-full hover:opacity-95 transition-opacity"
          >
            Match inteligente
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            to="/explorar"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-foreground border-2 border-border/60 bg-white hover:bg-secondary/40 transition-colors"
          >
            Explorar manualmente
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
