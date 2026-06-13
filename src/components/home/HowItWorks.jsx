import React from "react";
import { motion } from "framer-motion";
import { Search, Heart, Key, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    n: "1",
    icon: Search,
    title: "Busca y filtra",
    desc: "Zona, precio, habitaciones y tipo. Encuentra solo lo que te gusta.",
    bg: "bg-[hsl(346,77%,50%)]/10",
    iconColor: "text-[hsl(346,77%,50%)]",
    border: "border-[hsl(346,77%,50%)]/20",
  },
  {
    n: "2",
    icon: Heart,
    title: "Guarda tus favoritos",
    desc: "Compara inmuebles, revisa fotos y elige los que más te llaman.",
    bg: "bg-[hsl(262,70%,58%)]/10",
    iconColor: "text-[hsl(262,70%,58%)]",
    border: "border-[hsl(262,70%,58%)]/20",
  },
  {
    n: "3",
    icon: Key,
    title: "Arrienda con nosotros",
    desc: "Agenda tu visita y nosotros nos encargamos del resto. Sin sorpresas.",
    bg: "bg-[hsl(168,76%,42%)]/10",
    iconColor: "text-[hsl(168,76%,42%)]",
    border: "border-[hsl(168,76%,42%)]/20",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14 max-w-xl mx-auto">
          <p className="text-primary text-xs font-bold uppercase tracking-wider mb-3">Así de fácil</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
            3 pasos para tu nuevo hogar
          </h2>
          <p className="text-muted-foreground">
            Inspirado en lo mejor de Apartment List: menos búsqueda, más resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border-2 ${step.border} ${step.bg} hover:shadow-lg transition-all`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm`}>
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} strokeWidth={2} />
                </div>
                <span className="text-4xl font-extrabold text-foreground/10">{step.n}</span>
              </div>
              <h3 className="font-extrabold text-xl mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/explorar">
            <button className="inline-flex items-center gap-2 font-bold text-primary hover:underline text-base group">
              Empezar a buscar
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
