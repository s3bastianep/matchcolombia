import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  User,
  TrendingUp,
  MapPin,
  X,
  Smartphone,
  Eye,
  Headphones,
  Handshake,
  BarChart3,
  Users,
  Calendar,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import SellDashboardScreen from "@/components/advertise/SellDashboardScreen";
import SellHeroForm from "@/components/advertise/SellHeroForm";
import SaleProgressTracker from "@/components/advertise/SaleProgressTracker";
import { CITIES } from "@/lib/colombia";

const SALE_VISIBILITY = [
  { icon: BarChart3, title: "Personas que vieron el inmueble" },
  { icon: Users, title: "Compradores interesados" },
  { icon: Calendar, title: "Visitas programadas" },
  { icon: Banknote, title: "Ofertas recibidas" },
  { icon: Handshake, title: "Estado de negociación" },
  { icon: Smartphone, title: "Seguimiento en tiempo real" },
];

const OWNER_VIEWS = [
  {
    icon: Smartphone,
    title: "Seguimiento en tiempo real",
    desc: "Consulta visitas, interesados y ofertas desde cualquier dispositivo.",
  },
  {
    icon: Headphones,
    title: "Menos llamadas",
    desc: "Nosotros filtramos compradores y coordinamos visitas.",
  },
  {
    icon: Eye,
    title: "Más visibilidad",
    desc: "Publicación profesional con fotografías optimizadas.",
  },
  {
    icon: Handshake,
    title: "Acompañamiento completo",
    desc: "Desde la publicación hasta el cierre.",
  },
];

const SERVICE_INCLUDES = [
  "Fotografías profesionales",
  "Publicación en MatchColombia",
  "Gestión de interesados",
  "Coordinación de visitas",
  "Seguimiento de compradores",
  "Negociación",
  "Acompañamiento documental",
  "Panel de seguimiento",
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

const FAQ = [
  {
    q: "¿Por qué vender con MatchColombia y no por mi cuenta?",
    a: "Porque verificamos tu inmueble, lo exponemos a compradores reales y gestionamos todo el contacto. Tú te enfocas en decidir; nosotros en filtrar y coordinar.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Publicar es gratis. Te explicamos honorarios y opciones cuando registres tu propiedad, sin letra pequeña.",
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
      light ? "text-brand-magenta" : "text-brand-violet"
    )}>
      {children}
    </p>
  );
}

function SectionTitle({ title, subtitle, badge, className }) {
  return (
    <div className={cn("border-l-4 border-brand-magenta pl-4 sm:pl-5", className)}>
      {badge && (
        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-brand-magenta mb-2">{badge}</span>
      )}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
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
    params.set("operation", "venta");
    navigate(`/publicar/nuevo${params.toString() ? `?${params}` : ""}`);
  };

  const inputClass = cn(
    "w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-magenta/30",
    dark ? "bg-white/10 border-white/20 text-white placeholder:text-white/40" : "bg-white border-border/50"
  );
  const labelClass = cn("text-[10px] font-bold uppercase tracking-wider mb-1.5 block", dark ? "text-white/60" : "text-muted-foreground");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre</label>
          <div className="relative">
            <User className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", dark ? "text-white/50" : "text-brand-violet")} />
            <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} placeholder="Tu nombre" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Correo</label>
          <div className="relative">
            <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", dark ? "text-white/50" : "text-brand-magenta")} />
            <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} placeholder="tu@email.com" />
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Barrio</label>
          <div className="relative">
            <MapPin className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", dark ? "text-white/50" : "text-brand-violet")} />
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
          <Phone className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", dark ? "text-white/50" : "text-brand-magenta")} />
          <input type="tel" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} placeholder="+57 300 000 0000" />
        </div>
      </div>
      <button type="submit" className="w-full gradient-cta text-white font-bold py-4 rounded-xl hover:opacity-95 transition-opacity shadow-lg">
        Vender con {BRAND.name}
      </button>
    </form>
  );
}

function SellComparison() {
  return (
    <section id="comparacion" className="py-10 sm:py-14 bg-white border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <SectionTitle
          badge="La pregunta clave"
          title={`Vender solo vs vender con ${BRAND.name}`}
          subtitle="¿Por qué dejarles vender tu inmueble? Porque nosotros filtramos, coordinamos y te mantenemos informado sin exponer tu teléfono."
          className="mb-8"
        />
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          <div className="rounded-2xl border border-border/50 bg-background p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <X className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-extrabold text-lg text-muted-foreground">Por tu cuenta</h3>
            </div>
            <ul className="space-y-4">
              {WITHOUT_US.map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <X className="w-4 h-4 shrink-0 mt-0.5 text-brand-magenta/60" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-brand-violet/30 bg-gradient-to-br from-brand-violet/8 via-white to-brand-magenta/5 p-6 sm:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <h3 className="font-extrabold text-lg">Con {BRAND.name}</h3>
            </div>
            <ul className="space-y-4">
              {WITH_US.map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm font-semibold text-foreground/90">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-brand-violet" strokeWidth={3} />
                  {text}
                </li>
              ))}
            </ul>
            <a href="#vender-form-top" className="inline-flex items-center gap-2 mt-8 gradient-cta text-white font-bold px-6 py-3 rounded-xl hover:opacity-95 transition-opacity text-sm">
              Quiero vender así
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Sell() {
  return (
    <div className="w-full overflow-x-hidden bg-background">
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

      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-magenta/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-brand-violet/10 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid lg:grid-cols-[1fr_0.85fr] gap-8 lg:gap-10 items-start">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <SectionEyebrow light>Por qué vender con nosotros</SectionEyebrow>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.12] tracking-tight">
                Vende tu inmueble sin perseguir compradores
              </h1>
              <p className="mt-4 text-white/75 text-sm sm:text-base leading-relaxed max-w-lg">
                Nos encargamos de las publicaciones, visitas, negociaciones y seguimiento mientras monitoreas todo desde tu panel.
              </p>
              <div className="mt-3">
                <VerifiedBadge size="sm" />
              </div>
              <ul className="mt-5 space-y-2">
                {[
                  "Listado verificado con sello de confianza",
                  "Cero contacto directo con interesados",
                  "Equipo real en Bogotá y Barranquilla",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm font-semibold text-white/90">
                    <Check className="w-3.5 h-3.5 text-brand-magenta shrink-0" strokeWidth={3} />
                    {text}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="#vender-form-top" className="inline-flex items-center justify-center gap-2 gradient-cta text-white font-bold px-6 py-3 rounded-xl hover:opacity-95 transition-opacity text-sm shadow-lg">
                  Empezar a vender
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#venta-visible" className="inline-flex items-center justify-center gap-2 border border-white/30 font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
                  Ver cómo se ve
                </a>
              </div>
            </motion.div>

            <motion.div
              id="vender-form-top"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SellHeroForm />
            </motion.div>
          </div>
        </div>
      </section>

      <SellComparison />

      <section id="venta-visible" className="py-10 sm:py-14 lg:py-16 bg-white border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-start mb-8 sm:mb-10">
            <SectionTitle
              badge="Tu venta, no un panel genérico"
              title="Tu venta siempre visible"
              subtitle="Visualizaciones, interesados, visitas y ofertas en un solo lugar. Sin tickets ni contratos de arriendo: solo lo que importa para vender."
            />
            <SellDashboardScreen />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SALE_VISIBILITY.map(({ icon: Icon, title }) => (
              <div key={title} className="p-3.5 sm:p-4 rounded-xl bg-[hsl(0,0%,98%)] border border-border/40">
                <div className="w-9 h-9 rounded-lg bg-white border border-border/50 flex items-center justify-center mb-2.5 mx-auto sm:mx-0">
                  <Icon className="w-4 h-4 text-brand-violet" strokeWidth={2} />
                </div>
                <p className="text-[11px] sm:text-xs font-bold leading-snug text-center sm:text-left">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 bg-[hsl(0,0%,98%)] border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <SectionTitle
            title="Lo que ves como propietario"
            subtitle="Tranquilidad para vender: menos llamadas, más visibilidad y acompañamiento hasta el cierre."
            className="mb-8"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {OWNER_VIEWS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white border border-border/40"
              >
                <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base">{title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-start">
            <SectionTitle
              title="¿Qué incluye nuestro servicio?"
              subtitle="Todo lo que necesitas para vender sin estrés, en un solo acompañamiento."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {SERVICE_INCLUDES.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-border/40 shadow-sm"
                >
                  <span className="w-7 h-7 rounded-lg bg-brand-violet/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-brand-violet" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-bold text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SaleProgressTracker />

      <section className="color-bar py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="text-white font-extrabold text-xl sm:text-2xl">¿Listo para vender con respaldo real?</p>
            <p className="text-white/80 text-sm mt-2">Publica gratis · Bogotá y Barranquilla</p>
          </div>
          <a href="#vender-form-top" className="inline-flex items-center gap-2 bg-white text-brand-dark font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors shrink-0">
            Vender mi inmueble
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-dark text-white">
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

      <section id="vender-form" className="py-16 sm:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <SectionEyebrow>Empieza hoy</SectionEyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cuéntanos sobre tu inmueble
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Completa el formulario y nuestro equipo te guía en el siguiente paso. Sin compromiso.
            </p>
            <ul className="mt-8 space-y-3">
              {SERVICE_INCLUDES.slice(0, 4).map((text) => (
                <li key={text} className="flex items-center gap-3 text-sm font-semibold">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" strokeWidth={2.5} />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-border/50 ring-1 ring-brand-violet/10">
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
