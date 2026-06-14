import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
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
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import OwnerPanelBenefits from "@/components/advertise/OwnerPanelBenefits";

const STATS = [
  { value: "100%", label: "Propiedades verificadas" },
  { value: "95%", label: "Ocupación promedio" },
  { value: "72 h", label: "Promedio respuesta tickets" },
  { value: "100%", label: "Seguimiento digital" },
];

const ADMIN_INCLUDES = [
  "Publicación premium",
  "Fotografías profesionales",
  "Verificación documental",
  "Gestión de visitas",
  "Estudio de arrendatarios",
  "Contratos digitales",
  "Cobro de cánones",
  "Gestión de mantenimiento",
  "Panel de seguimiento",
];

const BENEFITS = [
  {
    icon: Zap,
    tag: "Eficiente",
    headline: "Gestión total de visitas y consultas",
    desc: "Respondemos por ti, agendamos visitas y filtramos interesados.",
  },
  {
    icon: Shield,
    tag: "Protegido",
    headline: "Arrendatarios evaluados por nuestro equipo",
    desc: "Solo te presentamos candidatos que pasaron nuestro filtro.",
  },
  {
    icon: MessageCircleOff,
    tag: "Sin estrés",
    headline: "Nosotros hablamos con los clientes",
    desc: "Tú recibes resúmenes claros, no cientos de mensajes sueltos.",
  },
];

const PROCESS = [
  { title: "Registras tu propiedad", desc: "Fotos, precio en COP, zona y características.", icon: Home },
  { title: "Publicamos por ti", desc: "Revisamos, activamos y promocionamos en tu zona.", icon: Camera },
  { title: "Gestionamos interesados", desc: "Consultas, visitas y evaluación — sin que tú hables con nadie.", icon: Users },
  { title: "Eliges con confianza", desc: "Te presentamos al mejor candidato. Seguimos el proceso.", icon: BadgeCheck },
];

const FAQ = [
  {
    q: "¿Tengo que hablar con los interesados?",
    a: "No. MatchColombia atiende consultas, responde preguntas, agenda visitas y te informa. Tú no expones tu teléfono ni recibes mensajes directos.",
  },
  {
    q: "¿Cuánto cuesta publicar?",
    a: "Publicar tu inmueble es gratis en Bogotá y Barranquilla.",
  },
  {
    q: "¿Cómo funciona la gestión de visitas?",
    a: "Coordinamos horarios con arrendatarios filtrados, confirmamos asistencia y te avisamos.",
  },
  {
    q: "¿Cómo elijo al arrendatario?",
    a: "Cuando un candidato pasa nuestra evaluación, te enviamos su perfil. Tú apruebas o rechazas.",
  },
  {
    q: "¿Puedo publicar en arriendo y venta?",
    a: "Sí. Indica el tipo de operación al registrar tu propiedad.",
  },
  {
    q: "¿En qué ciudades operan?",
    a: "Bogotá y Barranquilla, con cobertura en las principales zonas.",
  },
];

function OwnerBreadcrumb() {
  return (
    <div className="color-bar">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
          <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3 text-white/40" />
          <span className="text-white/90">Portal propietarios</span>
          <ChevronRight className="w-3 h-3 text-white/40" />
          <span className="text-white">Anunciar</span>
        </nav>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-white/15 px-3 py-1 rounded-full border border-white/20">
          <KeyRound className="w-3 h-3" />
          Para quien tiene un inmueble
        </span>
      </div>
    </div>
  );
}

function OwnerSectionTitle({ title, subtitle, light = false, className, badge }) {
  return (
    <div className={cn("border-l-4 border-brand-magenta pl-4 sm:pl-5", className)}>
      {badge && (
        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-brand-magenta mb-2">{badge}</span>
      )}
      <h2 className={cn("text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight", light ? "text-white" : "text-foreground")}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-2 text-sm sm:text-base leading-relaxed max-w-2xl", light ? "text-white/70" : "text-muted-foreground")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-bold text-sm text-foreground pr-4">{q}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </div>
  );
}

function LeadForm({ dark = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.name) params.set("name", form.name);
    if (form.email) params.set("email", form.email);
    if (form.phone) params.set("phone", form.phone);
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
      <div>
        <label className={labelClass}>Celular</label>
        <div className="relative">
          <Phone className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", dark ? "text-white/50" : "text-brand-violet")} />
          <input type="tel" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} placeholder="+57 300 000 0000" />
        </div>
      </div>
      <button type="submit" className="w-full gradient-cta text-white font-bold py-4 rounded-xl hover:opacity-95 transition-opacity shadow-lg">
        Publicar con {BRAND.name}
      </button>
      <a
        href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, quiero publicar mi inmueble con MatchColombia")}`}
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

export default function Advertise() {
  return (
    <div className="w-full overflow-x-hidden bg-background">
      <OwnerBreadcrumb />

      {/* Hero compacto — menos altura para equilibrar la página */}
      <section className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-brand-magenta" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Portal propietarios</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.12] tracking-tight">
                Nos encargamos de todo tu arriendo
              </h1>
              <p className="mt-4 text-white/75 text-sm sm:text-base leading-relaxed max-w-lg">
                Publica gratis. {BRAND.name} gestiona consultas, visitas y candidatos. Tú no hablas con los interesados — solo recibes información clara en tu panel.
              </p>
              <div className="mt-3">
                <VerifiedBadge size="sm" />
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/publicar/nuevo"
                  className="inline-flex items-center justify-center gap-2 gradient-cta text-white font-bold px-6 py-3 rounded-xl hover:opacity-95 transition-opacity text-sm shadow-lg"
                >
                  Publicar mi inmueble
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#beneficios-panel" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
                  Ver beneficios
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden sm:block rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-h-[220px] lg:max-h-[260px]"
            >
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&q=80"
                alt="Interior de propiedad en Colombia"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Beneficios del panel — sin mock visual */}
      <section id="beneficios-panel" className="py-10 sm:py-14 lg:py-16 bg-white border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <OwnerSectionTitle
            badge="Tecnología MatchColombia"
            title="Tu panel propietario, siempre visible"
            subtitle="Pagos, contratos, tickets y estado de cada inmueble — en tiempo real, desde cualquier dispositivo."
            className="mb-8 sm:mb-10"
          />
          <OwnerPanelBenefits />
        </div>
      </section>

      {/* PRIORIDAD #2 — Resultados concretos */}
      <section className="color-bar">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-5 sm:py-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="text-center text-white px-1"
            >
              <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-none">{value}</p>
              <p className="text-[10px] sm:text-xs font-semibold text-white/90 mt-1.5 leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRIORIDAD #3 — Qué incluye la administración */}
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-start">
            <OwnerSectionTitle
              title="Administración MatchColombia"
              subtitle="Todo lo que necesitas para arrendar sin estrés, en un solo servicio."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {ADMIN_INCLUDES.map((item, i) => (
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

      {/* Beneficios — más compacto */}
      <section className="py-10 sm:py-14 bg-[hsl(0,0%,98%)] border-y border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <OwnerSectionTitle
            title="Cuidamos tu propiedad"
            subtitle="Administración eficiente. Sin llamadas, sin mensajes sueltos, sin visitas mal coordinadas."
            className="mb-8"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            {BENEFITS.map(({ icon: Icon, tag, headline, desc }, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-white border border-border/40"
              >
                <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-violet">{tag}</span>
                <h3 className="font-extrabold text-base mt-1">{headline}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <OwnerSectionTitle title="Cómo funciona" subtitle="Tú publicas. Nosotros hacemos el resto." />
          <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PROCESS.map(({ title, desc, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl border border-border/40 bg-background"
              >
                <div className="w-9 h-9 rounded-full gradient-cta flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-extrabold text-brand-magenta uppercase tracking-wider">Paso {i + 1}</span>
                <h3 className="font-extrabold text-base mt-1">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 sm:py-14 bg-[hsl(0,0%,98%)] border-t border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-10 items-start">
          <OwnerSectionTitle title="Preguntas frecuentes" subtitle="Todo lo que necesitas saber antes de anunciar." />
          <div className="bg-white rounded-2xl border border-border/40 px-5 sm:px-6">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="publicar-form" className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14 lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <OwnerSectionTitle
              light
              title="¿Listo para arrendar sin estrés?"
              subtitle={`Completa tus datos y deja que ${BRAND.name} gestione tu propiedad con exclusividad. Nosotros atendemos a los interesados.`}
            />
            <ul className="mt-6 space-y-3">
              {ADMIN_INCLUDES.slice(0, 4).map((text) => (
                <li key={text} className="flex items-center gap-3 text-sm font-semibold text-white/85">
                  <Check className="w-4 h-4 text-brand-magenta shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
            <Link to="/explorar" className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold text-white/60 hover:text-white transition-colors">
              ¿Buscas arrendar? Ir a inmuebles
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl p-5 sm:p-7">
            <h3 className="font-extrabold text-lg mb-1">Publica gratis</h3>
            <p className="text-sm text-white/60 mb-5">Bogotá y Barranquilla</p>
            <LeadForm dark />
          </div>
        </div>
      </section>
    </div>
  );
}
