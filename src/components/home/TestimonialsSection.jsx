import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const quotes = [
  { text: "Encontré mi apartamento en Chapinero en 3 días. Solo vi opciones que encajaban.", author: "Laura M.", city: "Bogotá" },
  { text: "Por fin una búsqueda sin perder horas. El match funciona de verdad.", author: "Diego R.", city: "Bogotá" },
  { text: "Llegué a Barranquilla y en una semana ya tenía donde vivir.", author: "Valentina O.", city: "Barranquilla" },
  { text: "Me encanta que no sea scroll infinito. Solo lo relevante.", author: "Andrés P.", city: "Bogotá" },
  { text: "Súper fácil de usar desde el celular. Muy recomendado.", author: "Camila S.", city: "Barranquilla" },
];

export default function TestimonialsSection() {
  return (
    <section className="section-pad bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[hsl(265,75%,50%)] mb-2">Comunidad</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold">Arrendatarios más felices</h2>
      </div>

      <div className="relative fade-edges">
        <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused] w-max px-4">
          {[...quotes, ...quotes].map((q, i) => (
            <blockquote
              key={i}
              className="shrink-0 w-[min(320px,78vw)] surface-card p-6 text-left"
            >
              <div className="flex gap-0.5 mb-3">
                {Array(5).fill(0).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-[hsl(32,95%,54%)] text-[hsl(32,95%,54%)]" />
                ))}
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed font-medium">&ldquo;{q.text}&rdquo;</p>
              <footer className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{q.author}</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{q.city}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
