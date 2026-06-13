import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Building2, ArrowRight, Check } from "lucide-react";
import { INTERIORS } from "@/lib/colombiaImages";

const renterPerks = [
  "Inmuebles verificados por MatchColombia",
  "Postula 100% online",
  "Match sin scroll infinito",
  "Te acompañamos hasta tu nuevo hogar",
];

const ownerPerks = [
  "Nosotros atendemos a los interesados",
  "Alta visibilidad en Bogotá y Barranquilla",
  "Gestión de visitas y consultas",
  "Publicación gratuita",
];

export default function DualPathSection({ onStartQuiz }) {
  return (
    <section className="section-pad bg-[hsl(240,40%,98%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-white border border-border/50 shadow-sm group"
          >
            <div className="absolute inset-0">
              <img src={INTERIORS.sala} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-25 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-[hsl(265,75%,58%)]/10" />
            </div>
            <div className="relative p-7 sm:p-9">
              <div className="w-12 h-12 rounded-2xl gradient-cta flex items-center justify-center text-white mb-5 shadow-lg">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                Encuentra tu próximo hogar
                <br />
                <span className="text-gradient">sin complicaciones</span>
              </h3>
              <ul className="space-y-2.5 mb-8">
                {renterPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[hsl(168,72%,40%)] shrink-0 mt-0.5" strokeWidth={3} />
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onStartQuiz}
                  className="inline-flex items-center justify-center gap-2 gradient-cta btn-glow text-white font-bold px-6 py-3.5 rounded-full hover:opacity-95 transition-opacity"
                >
                  Empieza tu match
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/explorar"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold border-2 border-border/60 bg-white hover:bg-secondary/50 transition-colors"
                >
                  Buscar propiedad
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="relative rounded-3xl overflow-hidden bg-foreground text-white group"
          >
            <div className="absolute inset-0 opacity-20">
              <img src={INTERIORS.conjunto} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(240,30%,12%)] via-[hsl(265,40%,18%)] to-[hsl(340,50%,20%)]" />
            <div className="relative p-7 sm:p-9">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-5 border border-white/20">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                Arrendar tu propiedad
                <br />
                nunca fue tan rápido
              </h3>
              <ul className="space-y-2.5 mb-8">
                {ownerPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm text-white/75">
                    <Check className="w-4 h-4 text-[hsl(168,72%,55%)] shrink-0 mt-0.5" strokeWidth={3} />
                    {perk}
                  </li>
                ))}
              </ul>
              <Link to="/publicar">
                <button className="inline-flex items-center justify-center gap-2 bg-white text-foreground font-extrabold px-6 py-3.5 rounded-full hover:shadow-xl transition-shadow">
                  Publicar mi propiedad
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
