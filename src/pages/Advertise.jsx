import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  ChevronDown,
  ClipboardList,
  Headphones,
  Home,
  MapPin,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
  BarChart3,
  Bell,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

const FEATURES = [
  {
    icon: Home,
    title: "Publica en minutos",
    desc: "Crea tu anuncio con fotos, precio en COP, estrato y zona. Llega a arrendatarios en Bogotá y Barranquilla.",
    color: "hsl(340,82%,52%)",
  },
  {
    icon: Users,
    title: "Match con inquilinos",
    desc: "Conectamos tu inmueble con personas que encajan por presupuesto, zona y tipo de vivienda.",
    color: "hsl(265,75%,58%)",
  },
  {
    icon: CalendarCheck,
    title: "Visitas coordinadas",
    desc: "Agendamos y confirmamos cada visita. Tú no recibes llamadas ni mensajes directos de desconocidos.",
    color: "hsl(168,72%,40%)",
  },
  {
    icon: MessageCircle,
    title: "Gestión de consultas",
    desc: "Respondemos preguntas, filtramos interesados y te avisamos solo cuando hay un candidato serio.",
    color: "hsl(200,90%,50%)",
  },
  {
    icon: FileCheck,
    title: "Documentos y contrato",
    desc: "Te guiamos en contrato de arriendo, depósito y requisitos habituales en Colombia.",
    color: "hsl(32,95%,54%)",
  },
  {
    icon: BarChart3,
    title: "Panel de seguimiento",
    desc: "Ve consultas, visitas agendadas y estado de tu publicación desde un solo lugar.",
    color: "hsl(265,75%,58%)",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Crea tu anuncio",
    desc: "Sube fotos, define canon mensual, administración y características del inmueble.",
  },
  {
    step: "02",
    title: "MatchColombia gestiona",
    desc: "Filtramos interesados, respondemos consultas y coordinamos visitas por ti.",
  },
  {
    step: "03",
    title: "Cierra con confianza",
    desc: "Elige al arrendatario ideal con nuestro acompañamiento en documentos y seguimiento.",
  },
];

const COLOMBIA_POINTS = [
  "Canon y administración en pesos colombianos (COP)",
  "Estrato, conjunto cerrado y parqueadero",
  "Bogotá y Barranquilla con cobertura local",
  "Sin exponer tu teléfono personal a desconocidos",
];

const FAQ = [
  {
    q: "¿Cuánto cuesta anunciar en MatchColombia?",
    a: "Publicar tu inmueble es gratis. Nos enfocamos en conectar propietarios con arrendatarios calificados en Bogotá y Barranquilla.",
  },
  {
    q: "¿Los interesados me contactan directamente?",
    a: "No. Todo pasa por el equipo MatchColombia: consultas, visitas y seguimiento. Tú recibes actualizaciones claras sin ruido.",
  },
  {
    q: "¿Puedo anunciar para arriendo y venta?",
    a: "Sí. Puedes publicar inmuebles en arriendo o en venta. Indica el tipo de operación al crear tu anuncio.",
  },
  {
    q: "¿En qué ciudades operan?",
    a: "Actualmente en Bogotá y Barranquilla, con planes de expandir a más ciudades de Colombia.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-bold text-foreground">{q}</span>
        <ChevronDown className={cn("w-5 h-5 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="rounded-[1.5rem] border border-border/40 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 bg-[hsl(0,0%,98%)]">
        <div className="w-3 h-3 rounded-full bg-[hsl(340,82%,52%)]" />
        <div className="w-3 h-3 rounded-full bg-[hsl(32,95%,54%)]" />
        <div className="w-3 h-3 rounded-full bg-[hsl(168,72%,40%)]" />
        <span className="ml-2 text-xs font-semibold text-muted-foreground">Panel propietario · MatchColombia</span>
      </div>
      <div className="p-5 sm:p-6 grid sm:grid-cols-[1fr_200px] gap-5">
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tu publicación</p>
              <h3 className="font-extrabold text-lg">Apto en Chapinero · 2 hab.</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> Bogotá
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[hsl(168,72%,40%)]/12 text-[hsl(168,72%,32%)] text-[10px] font-bold">Activo</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Consultas", value: "12", icon: MessageCircle },
              { label: "Visitas", value: "4", icon: CalendarCheck },
              { label: "Matches", value: "8", icon: Sparkles },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl bg-[hsl(0,0%,97%)] p-3 border border-border/30">
                <Icon className="w-4 h-4 text-[hsl(265,75%,50%)] mb-1.5" />
                <p className="text-xl font-extrabold">{value}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">{label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { text: "Nueva consulta — interesado en visita sábado", time: "Hace 2 h" },
              { text: "Match 92% — perfil verificado", time: "Ayer" },
              { text: "Visita confirmada — martes 10:00 a.m.", time: "Ayer" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-white">
                <div className="w-8 h-8 rounded-full bg-[hsl(265,75%,58%)]/10 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-[hsl(265,75%,50%)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">{item.text}</p>
                  <p className="text-[10px] text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:block rounded-xl overflow-hidden bg-muted aspect-[4/5] relative">
          <img
            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80"
            alt="Vista previa del inmueble"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 right-3 bg-black/55 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-white text-xs font-bold">$2.800.000 / mes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Advertise() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-[hsl(240,40%,98%)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full bg-[hsl(265,75%,58%)]/8 blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(340,82%,52%)]/6 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20 relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border/50 text-[11px] font-bold text-[hsl(265,75%,50%)] mb-5">
                <Building2 className="w-3.5 h-3.5" />
                Para propietarios en Colombia
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.08] text-foreground">
                Anuncia tu inmueble.
                <br />
                <span className="text-gradient">Nosotros gestionamos el resto.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                La forma más fácil de arrendar o vender en Bogotá y Barranquilla. Publica gratis, recibe matches calificados y deja que {BRAND.name} coordine consultas y visitas por ti.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/publicar"
                  className="inline-flex items-center justify-center gap-2 gradient-cta text-white font-bold px-7 py-4 rounded-full shadow-lg shadow-[hsl(265,75%,58%)]/25 hover:opacity-95 transition-opacity"
                >
                  Empezar a anunciar
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, quiero anunciar mi inmueble en MatchColombia")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-border/60 text-foreground font-bold px-7 py-4 rounded-full hover:bg-secondary transition-colors"
                >
                  <Headphones className="w-4 h-4" />
                  Hablar con el equipo
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {["Publicar gratis", "Sin contacto directo", "Gestión completa"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
                    <Check className="w-4 h-4 text-[hsl(168,72%,40%)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <DashboardMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="section-pad bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Todo lo que necesitas para <span className="text-gradient">administrar tu arriendo</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Inspirado en las mejores herramientas del mundo, adaptado al mercado inmobiliario colombiano.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-[1.25rem] border border-border/30 bg-[hsl(0,0%,99%)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-shadow"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-extrabold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-pad bg-[hsl(240,40%,98%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold">¿Cómo funciona?</h2>
            <p className="mt-3 text-muted-foreground">Tres pasos. Sin complicaciones.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative p-6 sm:p-8 rounded-[1.25rem] bg-white border border-border/30"
              >
                <span className="text-4xl font-extrabold text-[hsl(265,75%,58%)]/20">{step}</span>
                <h3 className="font-extrabold text-xl mt-2 mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Colombia focus */}
      <section className="section-pad bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center rounded-[1.5rem] bg-foreground text-white p-8 sm:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[hsl(265,75%,58%)]/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60 mb-4">
                <MapPin className="w-3.5 h-3.5" />
                Hecho para Colombia
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Arrienda con tranquilidad en Bogotá y Barranquilla
              </h2>
              <p className="mt-4 text-white/70 leading-relaxed">
                Entendemos estrato, administración, depósitos y el ritmo del mercado local. No es un portal genérico: es gestión inmobiliaria pensada para propietarios colombianos.
              </p>
              <Link
                to="/publicar"
                className="inline-flex items-center gap-2 mt-8 bg-white text-foreground font-bold px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors"
              >
                Crear mi anuncio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="relative space-y-4">
              {COLOMBIA_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[hsl(168,72%,40%)] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-semibold text-white/90">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust / management */}
      <section className="section-pad bg-[hsl(240,40%,98%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-12 h-12 rounded-2xl gradient-cta flex items-center justify-center mb-5">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                {BRAND.contactRole} gestiona cada paso
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {BRAND.contactTagline}. Los interesados no te escriben por WhatsApp ni te llaman sin filtro: nosotros calificamos, respondemos y te informamos.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ClipboardList, label: "Anuncio verificado" },
                { icon: Users, label: "Inquilinos filtrados" },
                { icon: CalendarCheck, label: "Agenda de visitas" },
                { icon: Headphones, label: "Soporte humano" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="p-5 rounded-[1.25rem] bg-white border border-border/30 text-center">
                  <Icon className="w-6 h-6 text-[hsl(265,75%,50%)] mx-auto mb-2" />
                  <p className="text-sm font-bold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-8">Preguntas frecuentes</h2>
          <div className="rounded-[1.25rem] border border-border/30 bg-[hsl(0,0%,99%)] px-6">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-[hsl(240,40%,98%)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ¿Listo para anunciar tu inmueble?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Únete a propietarios en Bogotá y Barranquilla que ya confían en {BRAND.name}.
          </p>
          <Link
            to="/publicar"
            className="inline-flex items-center gap-2 mt-8 gradient-cta text-white font-bold px-8 py-4 rounded-full shadow-lg hover:opacity-95 transition-opacity"
          >
            Publicar gratis ahora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
