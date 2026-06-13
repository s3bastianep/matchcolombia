import React from "react";
import { motion } from "framer-motion";
import { INTERIORS, CITIES_IMG } from "@/lib/colombiaImages";
import { cn } from "@/lib/utils";

const props = [
  { title: "Cero scroll infinito", desc: "Hacemos la parte difícil; tú ahorras más de 50 horas de búsqueda.", images: [INTERIORS.sala, INTERIORS.conjunto, CITIES_IMG.bogota] },
  { title: "Menos estrés, más \"¡Sí!\"", desc: "Sin anuncios engañosos. Solo inmuebles que encajan contigo.", images: [INTERIORS.dormitorio, INTERIORS.balcon, INTERIORS.cocina] },
  { title: "Nos encargamos de todo", desc: "Visitas, documentos y seguimiento. Tú eliges, nosotros gestionamos.", images: [INTERIORS.comedor, CITIES_IMG.barranquilla, INTERIORS.estudio] },
];

function MiniCollage({ images }) {
  return (
    <div className="grid grid-cols-3 gap-2 h-[120px] sm:h-[140px]">
      {images.map((src, i) => (
        <div key={i} className={cn("relative overflow-hidden rounded-xl", i === 1 && "row-span-1")}>
          <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        </div>
      ))}
    </div>
  );
}

export default function ValuePropsSection({ onStartQuiz }) {
  return (
    <section className="section-pad philosophy-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[hsl(265,75%,50%)] mb-2">Nuestra filosofía</p>
          <h2 className="text-2xl sm:text-[2rem] font-extrabold leading-tight mb-6">
            Hecho por quienes entienden de arriendos
          </h2>
          <button
            onClick={onStartQuiz}
            className="gradient-cta btn-glow text-white font-bold px-8 py-3.5 rounded-full hover:opacity-95 transition-opacity"
          >
            Empieza tu match ahora
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {props.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="philosophy-card rounded-3xl p-5 sm:p-6 flex flex-col shadow-sm"
            >
              <h3 className="font-extrabold text-lg sm:text-xl mb-2">{p.title}</h3>
              <p className="text-sm text-foreground/65 leading-relaxed mb-5 flex-1">{p.desc}</p>
              <MiniCollage images={p.images} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
