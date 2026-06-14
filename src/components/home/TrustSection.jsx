import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Users, BadgeCheck, TrendingUp, MessageCircle } from "lucide-react";

const perks = [
  {
    icon: ShieldCheck,
    title: "Verificado y seguro",
    desc: "Todos los anuncios pasan por verificación manual antes de publicarse.",
    color: "text-[hsl(var(--brand-verified-fg))]",
    bg: "bg-[hsl(var(--brand-verified-bg))]",
  },
  {
    icon: Zap,
    title: "Respuesta inmediata",
    desc: "Nuestro equipo responde en menos de 24 horas.",
    color: "text-brand-magenta",
    bg: "bg-brand-magenta/10",
  },
  {
    icon: Users,
    title: "Gestión completa",
    desc: "Nos encargamos de visitas, consultas y seguimiento. Tú solo eliges.",
    color: "text-brand-violet",
    bg: "bg-brand-violet/10",
  },
  {
    icon: BadgeCheck,
    title: "Sin costos ocultos",
    desc: "El precio que ves es el precio real. Transparencia total en cada inmueble.",
    color: "text-brand-violet",
    bg: "bg-brand-violet/10",
  },
];

const testimonials = [
  {
    text: "Encontré mi apartamento en Chapinero en menos de una semana. El proceso fue rapidísimo y sin complicaciones.",
    name: "Valentina R.",
    role: "Diseñadora gráfica",
    avatar: "VR",
  },
  {
    text: "Publiqué mi apartamento y tuve consultas al día siguiente. Lo arrendé en 10 días sin pagar ninguna comisión.",
    name: "Carlos M.",
    role: "Propietario · Suba",
    avatar: "CM",
  },
  {
    text: "La plataforma más limpia y fácil de usar que he encontrado para buscar arriendo en Colombia. Muy recomendada.",
    name: "Andrea T.",
    role: "Profesora universitaria",
    avatar: "AT",
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Perks grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.18em] mb-3">Por qué elegirnos</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">
              Arrendar nunca fue<br />tan <span className="text-primary">transparente</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl ${p.bg} flex items-center justify-center mb-5`}>
                  <p.icon className={`w-6 h-6 ${p.color}`} strokeWidth={1.8} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <MessageCircle className="w-4 h-4 text-primary" />
            <p className="text-primary text-xs font-bold uppercase tracking-[0.18em]">Testimonios</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-secondary/40 border border-border/60"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-brand-magenta fill-brand-magenta" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}