import React from "react";
import { motion } from "framer-motion";
import { BOGOTA, INTERIORS } from "@/lib/bogotaImages";

const cards = [
  {
    title: "Cero scroll infinito",
    desc: "Solo inmuebles verificados. Match inteligente, sin anuncios falsos.",
    img: INTERIORS.balcon,
    accent: "hsl(var(--brand-magenta))",
  },
  {
    title: "Menos estrés, más ¡sí!",
    desc: "100% verificados. Nosotros gestionamos todo — sin estafas, sin sustos.",
    img: BOGOTA.chapinero,
    accent: "hsl(var(--brand-violet))",
  },
  {
    title: "Ayuda real, no solo búsqueda",
    desc: "Match inteligente, favoritos y acompañamiento real por WhatsApp.",
    img: INTERIORS.sala,
    accent: "hsl(var(--brand-magenta))",
  },
];

export default function BuiltForRenters({ onStartQuiz }) {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 max-w-lg">
          Hecho para quien busca arriendo en Colombia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl overflow-hidden border border-[#e8e0d5]/60 hover:shadow-lg transition-shadow"
            >
              <div className="h-36 overflow-hidden relative">
                <img src={card.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${card.accent}88, transparent)` }} />
              </div>
              <div className="p-5">
                <h3 className="font-extrabold text-base mb-1.5">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onStartQuiz}
          className="gradient-cta text-white font-bold px-7 py-3.5 rounded-xl shadow-md hover:opacity-95 transition-opacity"
        >
          Match inteligente
        </button>
      </div>
    </section>
  );
}
