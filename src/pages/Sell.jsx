import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Home,
  MessageCircleOff,
  Shield,
  Users,
  Zap,
  Camera,
  ClipboardCheck,
  Handshake,
  Phone,
  Mail,
  User,
  TrendingUp,
  MapPin,
  ShieldCheck,
  FileCheck,
  X,
  Sparkles,
  Eye,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { CITIES } from "@/lib/colombia";
import { INTERIORS } from "@/lib/colombiaImages";

const STATS = [
  { value: "Gratis", label: "Publicar inmueble" },
  { value: "100%", label: "Gestión por MatchColombia" },
  { value: "0", label: "Contacto directo" },
  { value: "2", label: "Ciudades activas" },
];

const VALUE_PILLARS = [
  {
    icon: ShieldCheck,
    tag: "Confianza",
    title: "Listado verificado",
    desc: "Tu inmueble pasa revisión antes de publicarse. Los compradores ven un anuncio serio, no uno más del montón.",
    accent: "from-[hsl(340,82%,52%)] to-[hsl(265,75%,58%)]",
    bg: "bg-[hsl(340,82%,52%)]/8",
  },
  {
    icon: Headphones,
    tag: "Gestión",
    title: "Nosotros atendemos por ti",
    desc: "Consultas, visitas y seguimiento los maneja nuestro equipo. Tú no recibes 50 WhatsApps ni expones tu número.",
    accent: "from-[hsl(265,75%,58%)] to-[hsl(200,90%,50%)]",
    bg: "bg-[hsl(265,75%,58%)]/8",
  },
  {
    icon: Eye,
    tag: "Exposición",
    title: "Compradores que buscan en tu zona",
    desc: "Promocionamos tu propiedad a quienes ya exploran Bogotá y Barranquilla en MatchColombia.",
    accent: "from-[hsl(168,72%,40%)] to-[hsl(32,95%,54%)]",
    bg: "bg-[hsl(168,72%,40%)]/8",
  },
];

const WITHOUT_US = [
  "Respondes cada mensaje tú mismo",
  "Tu teléfono queda expuesto en el anuncio",
  "Visitas mal coordinadas y gente que no compra",
  "No sabes si el interesado es serio",
];

const WITH_US = [
  "MatchColombia filtra y responde por ti",
  "Solo te avisamos cuando hay alguien real",
  "Visitas agendadas y confirmadas",
  "Seguimiento claro hasta cerrar la venta",
];

const PROCESS = [
  { title: "Registras tu inmueble", desc: "Barrio, precio, fotos y lo esencial.", icon: Home, accent: "from-[hsl(340,82%,52%)] to-[hsl(265,75%,58%)]" },
  { title: "Verificamos y publicamos", desc: "Revisamos datos y activamos tu listado.", icon: FileCheck, accent: "from-[hsl(265,75%,58%)] to-[hsl(200,90%,50%)]" },
  { title: "Gestionamos compradores", desc: "Consultas y visitas sin que tú hables con nadie.", icon: Users, accent: "from-[hsl(200,90%,50%)] to-[hsl(168,72%,40%)]" },
  { title: "Cierras con apoyo", desc: "Te acompañamos hasta concretar la operación.", icon: BadgeCheck, accent: "from-[hsl(168,72%,40%)] to-[hsl(32,95%,54%)]" },
];

const FAQ = [
  {
    q: "¿Por qué vender con MatchColombia y no por mi cuenta?",
    a: "Porque verificamos tu inmueble, lo exponemos a compradores reales y gestionamos todo el contacto. Tú te enfocas en decidir; nosotros en filtrar y coordinar.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Publicar es gratis. Te explicamos honorarios y opciones cuando registres tu propiedad — sin letra pequeña.",
  },
  {
    q: "¿Tengo que hablar con los interesados?",
    a: "No. Atendemos consultas, agendamos visitas y te informamos. Tu teléfono no aparece en el anuncio.",
  },
  {
    q: "¿Puedo vender y arrendar?",
    a: "Sí. Indica el tipo de operación al registrar y te guiamos según tu objetivo.",
  },
  {
    q: "¿En qué ciudades operan?",
    a: "Bogotá y Barranquilla.",
  },
];

function SectionEyebrow({ children, light = false }) {
  return (
    <p className={cn(
      "text-xs font-bold uppercase tracking-widest mb-3",
      light ? "text-[hsl(340,82%,65%)]" : "text-[hsl(265,75%,50%)]"
    )}>
      {children}
    </p>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-bold text-sm text-white pr-4">{q}</span>
        <ChevronDown className={cn("w-4 h-4 text-white/50 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="pb-4 text-sm text-white/70 leading-relaxed">{a}</p>}
    </div>
  );
}

function LeadForm({ dark = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", neighborhood: "", city: "Bogotá" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.name) params.set("name", form.name);
    if (form.email) params.set("email", form.email);
    if (form.phone) params.set("phone", form.phone);
    if (form.neighborhood) params.set("neighborhood", form.neighborhood);
    if (form.city) params.set("city", form.city);
    navigate(`/publicar/nuevo${params.toString() ? `?${params}` : ""}`);
  };

  const inputClass = cn(
    "w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,52%)]/30",
    dark ? "bg-white/10 border-white/20 text-white placeholder:text-white/40" : "bg-white border-border/50"
  );
  const labelClass = cn("text-[10px] font-bold uppercase tracking-wider mb-1.5 block", dark ? "text-white/60" : "text-muted-foreground");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre</label>
          <div className="relative">
            <User className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", dark ? "text-white/50" : "text-[hsl(265,75%,58%)]")} />
            <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} placeholder="Tu nombre" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Correo</label>
          <div className="relative">
            <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", dark ? "text-white/50" : "text-[hsl(340,82%,52%)]")} />
            <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} placeholder="tu@email.com" />
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Barrio</label>
          <div className="relative">
            <MapPin className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", dark ? "text-white/50" : "text-[hsl(168,72%,40%)]")} />
            <input type="text" value={form.neighborhood} onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))} className={inputClass} placeholder="Ej: Chapinero" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Ciudad</label>
          <select value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className={cn(inputClass, "pl-4")}>
            {CITIES.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Celular</label>
        <div className="relative">
          <Phone className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", dark ? "text-white/50" : "text-[hsl(168,72%,40%)]")} />
          <input type="tel" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} placeholder="+57 300 000 0000" />
        </div>
      </div>
      <button type="submit" className="w-full gradient-cta text-white font-bold py-4 rounded-xl hover:opacity-95 transition-opacity shadow-lg">
        Vender con {BRAND.name}
      </button>
      <a
        href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, quiero vender mi inmueble con MatchColombia")}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 font-bold text-sm transition-colors",
          dark ? "border-white/25 text-white hover:bg-white/10" : "border-border/60 hover:bg-secondary"
        )}
      >
        Conversemos por WhatsApp
      </a>
    </form>
  );
}

export default function Sell() {
  return (
    <div className="w-full overflow-x-hidden bg-[hsl(265,18%,97%)]">
      {/* Breadcrumb con color */}
      <div className="color-bar">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white/90">Vender</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-white/15 px-3 py-1 rounded-full border border-white/20">
            <TrendingUp className="w-3 h-3" />
            Venta de inmuebles
          </span>
        </div>
      </div>

      {/* Hero con valor claro */}
      <section className="relative overflow-hidden bg-[hsl(265,35%,22%)] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(340,82%,52%)]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(265,75%,58%)]/15 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <SectionEyebrow light>Por qué vender con nosotros</SectionEyebrow>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.08] tracking-tight">
              Vende sin estrés.{" "}
              <span className="text-[hsl(340,82%,65%)]">Nosotros gestionamos todo.</span>
            </h1>
            <p className="mt-5 text-white/75 text-sm sm:text-base leading-relaxed max-w-lg">
              Publicar es gratis. {BRAND.name} verifica tu inmueble, filtra compradores y coordina visitas. Tú decides; nosotros hacemos el trabajo pesado.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Listado verificado con sello de confianza",
                "Cero contacto directo con interesados",
                "Equipo real en Bogotá y Barranquilla",
              ].map((text) => (
                <li key={text} className="flex items-center gap-3 text-sm font-semibold text-white/90">
                  <div className="w-6 h-6 rounded-full bg-[hsl(168,72%,40%)]/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[hsl(168,72%,55%)]" strokeWidth={3} />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/publicar/nuevo" className="inline-flex items-center justify-center gap-2 gradient-cta text-white font-bold px-7 py-3.5 rounded-xl hover:opacity-95 transition-opacity text-sm shadow-lg">
                Empezar a vender
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#por-que" className="inline-flex items-center justify-center gap-2 border border-white/30 font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm">
                Ver el valor
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-auto lg:min-h-[380px]"
          >
            <img src={INTERIORS.casa} alt="Inmueble en venta" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(265,35%,22%)]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3">
              {VALUE_PILLARS.map(({ tag, title, accent }) => (
                <div key={tag} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/15">
                  <div className={cn("w-2 h-8 rounded-full bg-gradient-to-b shrink-0", accent)} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">{tag}</p>
                    <p className="text-sm font-extrabold">{title}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats color bar */}
      <section className="bg-white border-b border-border/40 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center p-5 rounded-2xl border border-border/40 bg-gradient-to-br from-white to-[hsl(265,75%,58%)]/5"
            >
              <p className="text-xl sm:text-2xl font-extrabold text-gradient">{value}</p>
              <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3 pilares de valor */}
      <section id="por-que" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <SectionEyebrow>El valor de MatchColombia</SectionEyebrow>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Tres razones para <span className="text-gradient">vender con nosotros</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              No es solo publicar un anuncio. Es tener un equipo que trabaja tu venta.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {VALUE_PILLARS.map(({ icon: Icon, tag, title, desc, accent, bg }, i) => (
              <motion.article
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-3xl bg-white border border-border/50 overflow-hidden shadow-sm card-hover"
              >
                <div className={cn("h-1.5 w-full bg-gradient-to-r", accent)} />
                <div className="p-6 sm:p-7">
                  <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-5", bg, "text-foreground/80")}>
                    <Sparkles className="w-3 h-3" />
                    {tag}
                  </div>
                  <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md mb-5", accent)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-xl mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparación: solo vs con nosotros — guía clara */}
      <section className="py-16 sm:py-20 bg-white border-y border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <SectionEyebrow>Entiende la diferencia</SectionEyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Vender solo vs vender con {BRAND.name}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            <div className="rounded-3xl border border-border/50 bg-[hsl(240,40%,98%)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <X className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-extrabold text-lg text-muted-foreground">Por tu cuenta</h3>
              </div>
              <ul className="space-y-4">
                {WITHOUT_US.map((text) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 shrink-0 mt-0.5 text-[hsl(340,82%,52%)]/60" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border-2 border-[hsl(265,75%,58%)]/30 bg-gradient-to-br from-[hsl(265,75%,58%)]/8 via-white to-[hsl(340,82%,52%)]/5 p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[hsl(340,82%,52%)]/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                  <h3 className="font-extrabold text-lg">Con {BRAND.name}</h3>
                </div>
                <ul className="space-y-4">
                  {WITH_US.map((text) => (
                    <li key={text} className="flex items-start gap-3 text-sm font-semibold text-foreground/90">
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-[hsl(168,72%,40%)]" strokeWidth={3} />
                      {text}
                    </li>
                  ))}
                </ul>
                <Link to="/publicar/nuevo" className="inline-flex items-center gap-2 mt-8 gradient-cta text-white font-bold px-6 py-3 rounded-xl hover:opacity-95 transition-opacity text-sm">
                  Quiero vender así
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso guiado con color */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <SectionEyebrow>Tu camino</SectionEyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Así vendes con nosotros, <span className="text-gradient">paso a paso</span>
            </h2>
            <p className="mt-3 text-muted-foreground">Simple de entender. Fácil de empezar.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PROCESS.map(({ title, desc, icon: Icon, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm"
              >
                <div className={cn("h-1 w-full bg-gradient-to-r", accent)} />
                <div className="p-5 sm:p-6">
                  <span className={cn("inline-block text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full bg-gradient-to-r mb-4", accent)}>
                    Paso {i + 1}
                  </span>
                  <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4", accent)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banda de valor con color */}
      <section className="color-bar py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="text-white font-extrabold text-xl sm:text-2xl">¿Listo para vender con respaldo real?</p>
            <p className="text-white/80 text-sm mt-2">Publica gratis · Bogotá y Barranquilla</p>
          </div>
          <Link to="/publicar/nuevo" className="inline-flex items-center gap-2 bg-white text-[hsl(265,35%,22%)] font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors shrink-0">
            Vender mi inmueble
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FAQ en panel oscuro */}
      <section className="py-16 sm:py-20 bg-[hsl(265,35%,22%)] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <SectionEyebrow light>Preguntas frecuentes</SectionEyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">¿Aún tienes dudas?</h2>
            <p className="mt-3 text-white/70 text-sm sm:text-base leading-relaxed">
              Aquí respondemos lo más importante antes de que registres tu inmueble.
            </p>
            <Link to="/anunciar" className="inline-flex items-center gap-1.5 mt-8 text-sm font-bold text-white/60 hover:text-white transition-colors">
              ¿Prefieres arrendar? Ir a anunciar
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-5 sm:px-6">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="vender-form" className="py-16 sm:py-20 bg-[hsl(265,18%,97%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <SectionEyebrow>Empieza hoy</SectionEyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cuéntanos sobre tu inmueble
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Completa el formulario y nuestro equipo te guía en el siguiente paso. Sin compromiso.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {[
                { icon: Shield, label: "Verificación", color: "text-[hsl(340,82%,52%)]" },
                { icon: Zap, label: "Gestión total", color: "text-[hsl(265,75%,50%)]" },
                { icon: MessageCircleOff, label: "Sin contacto directo", color: "text-[hsl(200,90%,50%)]" },
                { icon: Handshake, label: "Tú decides", color: "text-[hsl(168,72%,40%)]" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-border/40">
                  <Icon className={cn("w-4 h-4 shrink-0", color)} />
                  <span className="text-xs font-bold">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-border/50 ring-1 ring-[hsl(265,75%,58%)]/10">
            <div className="h-1 w-16 rounded-full gradient-cta mb-6" />
            <h3 className="font-extrabold text-lg mb-1">Registra tu propiedad</h3>
            <p className="text-sm text-muted-foreground mb-6">Bogotá y Barranquilla · Gratis</p>
            <LeadForm />
          </div>
        </div>
      </section>
    </div>
  );
}
