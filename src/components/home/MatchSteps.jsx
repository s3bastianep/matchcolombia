import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import MatchStepVisual from "./MatchStepVisual";
import VerifiedBadge from "../brand/VerifiedBadge";
import { BRAND } from "@/lib/brand";
import { MATCH_STEPS_VERIFIED, TRUST_TAGLINE } from "@/lib/siteCopy";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    num: "01",
    title: "Haz el cuestionario",
    problem: "Sin perder horas en portales sin filtro.",
    desc: `Ciudad, presupuesto, habitaciones, baños, mascotas y más. ${BRAND.name} filtra por ti.`,
  },
  {
    num: "02",
    title: "Encuentra tu match",
    problem: "Sin anuncios dudosos ni precios inventados.",
    desc: "Solo ves inmuebles verificados por nuestro equipo que encajan con lo que buscas.",
    verified: true,
  },
  {
    num: "03",
    title: "Agenda tu visita",
    problem: "Sin perseguir dueños ni mensajes sueltos.",
    desc: "Reserva visita presencial o virtual. El equipo Match te acompaña.",
  },
];

export default function MatchSteps({ onStartQuiz }) {
  return (
    <section className="section-pad relative overflow-hidden bg-[hsl(0,0%,98%)] border-y border-border/40">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-10 items-start mb-10 sm:mb-12">
          <SectionHeader
            eyebrow="Cómo funciona"
            title={
              <>
                Tu match en <span className="text-gradient">3 pasos</span>
              </>
            }
            subtitle={TRUST_TAGLINE}
          />
          <div className="border-l-4 border-brand-magenta pl-4 sm:pl-5 py-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-magenta mb-2">
              El problema que resolvemos
            </p>
            <p className="text-sm sm:text-base text-foreground font-semibold leading-relaxed">
              Buscar arriendo suele ser perder tiempo: anuncios falsos, precios que no cuadran y nadie que coordine visitas.
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {MATCH_STEPS_VERIFIED} Te acompañamos de la búsqueda a la visita.
            </p>
          </div>
        </div>

        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 sm:px-5 rounded-2xl bg-[hsl(var(--brand-verified-bg))] border border-[hsl(var(--brand-verified-border))]">
          <VerifiedBadge size="md" className="shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[hsl(var(--brand-verified-fg))] leading-snug">
              {MATCH_STEPS_VERIFIED}
            </p>
            <p className="text-xs text-[hsl(var(--brand-verified-fg))]/80 mt-1 leading-relaxed">
              Fotos, precio y datos revisados por el equipo {BRAND.name} antes de que veas el anuncio.
            </p>
          </div>
          <ShieldCheck className="hidden sm:block w-8 h-8 text-[hsl(var(--brand-verified))] shrink-0 ml-auto opacity-80" strokeWidth={1.75} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-5 items-stretch">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col h-full"
            >
              <div className="mb-4 min-h-[128px] sm:min-h-[140px]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-violet">
                  Paso {step.num}
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl mt-1 tracking-tight">{step.title}</h3>
                <p className="text-xs font-semibold text-foreground/80 mt-1">{step.problem}</p>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{step.desc}</p>
                {step.verified && (
                  <VerifiedBadge size="sm" className="mt-2.5" />
                )}
              </div>

              <div className="mt-auto w-full">
                <MatchStepVisual stepIndex={i} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            type="button"
            onClick={onStartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-cta text-white font-bold px-8 py-3.5 rounded-full hover:opacity-95 transition-opacity"
          >
            Empezar match inteligente
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            to="/explorar"
            className={cn(
              "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold",
              "text-foreground border-2 border-border/60 bg-white hover:bg-secondary/60 transition-colors"
            )}
          >
            Ver tarjetas de inmuebles
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
