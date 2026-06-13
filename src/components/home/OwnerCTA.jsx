import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const perks = ["Publicación gratuita", "Nosotros atendemos a los interesados", "Gestión de visitas y consultas", "Todo desde tu celular"];

export default function OwnerCTA() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 gradient-cta opacity-95" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">Propietarios</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            ¿Tienes un inmueble para arrendar?
          </h2>
          <p className="text-white/80 text-base max-w-lg mx-auto mb-8">
            Publica con nosotros. Nos encargamos de conectar tu inmueble con arrendatarios en Bogotá y Barranquilla.
          </p>

          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <Check className="w-4 h-4 shrink-0" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>

          <Link to="/publicar">
            <button className="inline-flex items-center gap-2.5 bg-white text-foreground font-extrabold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all group">
              Publicar mi inmueble gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
