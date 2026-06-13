import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Sparkles, ShieldCheck, ArrowRight, MapPin } from "lucide-react";
import { INTERIORS } from "@/lib/colombiaImages";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Building2,
    title: "Listados completos",
    desc: "Explora inmuebles verificados en Bogotá y Barranquilla. Filtra por zona, precio y habitaciones sin scroll infinito.",
    tag: "Inventario real",
    accent: "from-[hsl(340,82%,52%)] to-[hsl(265,75%,58%)]",
    ring: "ring-[hsl(340,82%,52%)]/20",
    image: INTERIORS.conjunto,
    preview: (
      <div className="flex flex-wrap gap-1.5">
        {["Chapinero", "2 hab", "$2.8M", "Apto"].map((pill) => (
          <span key={pill} className="px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-foreground shadow-sm border border-border/40">
            {pill}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: Sparkles,
    title: "Recursos útiles",
    desc: "Match inteligente, filtros avanzados, mapa interactivo y herramientas para decidir mejor en Colombia.",
    tag: "Match + mapa",
    accent: "from-[hsl(265,75%,58%)] to-[hsl(200,90%,50%)]",
    ring: "ring-[hsl(265,75%,58%)]/20",
    image: INTERIORS.sala2,
    preview: (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {[94, 88, 91].map((score) => (
            <div
              key={score}
              className="w-8 h-8 rounded-full gradient-cta flex items-center justify-center text-[9px] font-extrabold text-white ring-2 ring-white"
            >
              {score}%
            </div>
          ))}
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground">compatibilidad</span>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Tranquilidad de espíritu",
    desc: "Anuncios verificados y un equipo real que gestiona consultas y visitas. Arrienda con confianza.",
    tag: "Gestión completa",
    accent: "from-[hsl(168,72%,40%)] to-[hsl(32,95%,54%)]",
    ring: "ring-[hsl(168,72%,40%)]/20",
    image: INTERIORS.dormitorio,
    preview: (
      <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-foreground/80">
        <span className="px-2.5 py-1 rounded-lg bg-white/95 border border-border/40 shadow-sm flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[hsl(168,72%,40%)]" /> Verificado
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-white/95 border border-border/40 shadow-sm">Equipo Match</span>
      </div>
    ),
  },
];

export default function RentEasySection() {
  return (
    <section className="relative overflow-hidden bg-[hsl(240,40%,98%)] border-b border-border/40 py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/3 w-[420px] h-[420px] rounded-full bg-[hsl(265,75%,58%)]/6 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[360px] h-[360px] rounded-full bg-[hsl(340,82%,52%)]/6 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[hsl(265,75%,50%)] mb-3">
            Por qué MatchColombia
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-foreground leading-[1.12] tracking-tight">
            Arrendar nunca fue{" "}
            <span className="text-gradient">tan fácil</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mt-4 max-w-2xl mx-auto">
            Ayudamos a quienes buscan arriendo en Bogotá y Barranquilla a encontrar su hogar con confianza.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col rounded-3xl bg-white border border-border/50 shadow-sm overflow-hidden card-hover"
              >
                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <img
                    src={feature.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className={cn("absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent")} />
                  <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", feature.accent)} />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-white text-[10px] font-bold drop-shadow">
                      <MapPin className="w-3 h-3" />
                      Colombia
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-foreground shadow-sm">
                      {feature.tag}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md shrink-0",
                        feature.accent
                      )}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2.25} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">{feature.desc}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">{feature.preview}</div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-12 flex justify-center"
        >
          <Link
            to="/explorar"
            className="inline-flex items-center gap-2 text-sm font-bold text-[hsl(265,75%,50%)] hover:underline group"
          >
            Ver todos los inmuebles
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
