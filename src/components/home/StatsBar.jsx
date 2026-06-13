import React from "react";
import { motion } from "framer-motion";
import { MapPin, Zap, ShieldCheck, Smartphone } from "lucide-react";

const stats = [
  { icon: MapPin, value: "2 ciudades", label: "Bogotá y Barranquilla" },
  { icon: Smartphone, value: "100% online", label: "Postula, visita y gestiona" },
  { icon: Zap, value: "24 horas", label: "Respuesta de nuestro equipo" },
  { icon: ShieldCheck, value: "Verificados", label: "Inmuebles revisados por MatchColombia" },
];

export default function StatsBar() {
  return (
    <section className="relative border-y border-border/40 bg-[hsl(240,30%,97%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-border/50 shadow-sm mb-3 lg:mb-4">
                  <Icon className="w-5 h-5 text-[hsl(265,75%,50%)]" strokeWidth={2} />
                </div>
                <p className="text-xl sm:text-2xl font-extrabold tracking-tight">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
