import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import SectionHeader from "../ui/SectionHeader";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    num: "01",
    title: "Dices qué buscas",
    problem: "Sin perder horas en portales sin filtro.",
    desc: "Ciudad, presupuesto y habitaciones. MatchColombia filtra por ti.",
  },
  {
    num: "02",
    title: "Ves solo inmuebles reales",
    problem: "Sin anuncios dudosos ni precios inventados.",
    desc: "Cada listado está verificado: fotos, precio y datos revisados.",
  },
  {
    num: "03",
    title: "Nosotros coordinamos",
    problem: "Sin perseguir dueños ni mensajes sueltos.",
    desc: "Guardas favoritos, agendas visitas y el equipo Match te acompaña.",
  },
];

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 overflow-hidden h-full min-h-[280px]">
      <div className="aspect-[5/4] shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 shimmer rounded w-1/2" />
        <div className="h-3 shimmer rounded w-2/3" />
      </div>
    </div>
  );
}

export default function MatchSteps({ onStartQuiz, properties = [], isLoading = false }) {
  const showcase = properties.slice(0, 3);

  return (
    <section className="section-pad relative overflow-hidden bg-[hsl(0,0%,98%)] border-y border-border/40">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-10 items-start mb-10 sm:mb-12">
          <SectionHeader
            eyebrow="Por qué MatchColombia"
            title={
              <>
                Tu match en <span className="text-gradient">3 pasos</span>
              </>
            }
            subtitle="Menos tiempo buscando. Más confianza al arrendar."
          />
          <div className="border-l-4 border-brand-magenta pl-4 sm:pl-5 py-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-magenta mb-2">
              El problema que resolvemos
            </p>
            <p className="text-sm sm:text-base text-foreground font-semibold leading-relaxed">
              Buscar arriendo suele ser perder tiempo: anuncios falsos, precios que no cuadran y nadie que coordine visitas.
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              MatchColombia verifica cada inmueble y te acompaña de la búsqueda a la visita.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col"
            >
              <div className="mb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-violet">
                  Paso {step.num}
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl mt-1 tracking-tight">{step.title}</h3>
                <p className="text-xs font-semibold text-foreground/80 mt-1">{step.problem}</p>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-auto">
                {isLoading ? (
                  <CardSkeleton />
                ) : showcase[i] ? (
                  <PropertyCard property={showcase[i]} index={i} variant="grid" showMatch={i === 1} matchScore={92} />
                ) : (
                  <div className="rounded-xl border border-dashed border-border/50 bg-white p-6 text-center min-h-[200px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Inmuebles verificados disponibles pronto</p>
                  </div>
                )}
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
