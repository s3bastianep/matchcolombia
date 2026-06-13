import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Check,
  ChevronDown,
  ClipboardList,
  Headphones,
  Home,
  IdCard,
  MapPin,
  MessageCircle,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  BarChart3,
  Bell,
  FileCheck,
  Search,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

const OWNER_CHECKS = [
  { icon: IdCard, text: "Identidad del propietario o representante legal" },
  { icon: FileCheck, text: "Titularidad o autorización para arrendar el inmueble" },
  { icon: Home, text: "Fotos reales, dirección y datos coherentes" },
  { icon: ClipboardList, text: "Precio, administración y condiciones del arriendo" },
];

const TENANT_CHECKS = [
  { icon: UserCheck, text: "Identidad y datos de contacto verificados" },
  { icon: Search, text: "Perfil de arrendamiento: presupuesto, zona y plazo" },
  { icon: BadgeCheck, text: "Referencias e intención seria antes de visita" },
  { icon: Shield, text: "Solo candidatos calificados llegan al propietario" },
];

const PUBLISH_PIPELINE = [
  {
    step: "1",
    title: "Tú publicas",
    desc: "Completas el anuncio con fotos, precio en COP y características del inmueble.",
    status: "draft",
  },
  {
    step: "2",
    title: "Nosotros verificamos",
    desc: "Revisamos identidad, inmueble y condiciones. Nada se publica sin nuestra aprobación.",
    status: "review",
  },
  {
    step: "3",
    title: "Anuncio verificado",
    desc: "Tu inmueble queda activo con sello de confianza para inquilinos también verificados.",
    status: "live",
  },
  {
    step: "4",
    title: "Match y visitas",
    desc: "Conectamos con arrendatarios filtrados. Coordinamos consultas y visitas por ti.",
    status: "match",
  },
];

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Verificación de propietarios",
    desc: "Confirmamos quién publica y que el inmueble es real antes de mostrarlo en la plataforma.",
    color: "hsl(265,75%,58%)",
  },
  {
    icon: UserCheck,
    title: "Verificación de inquilinos",
    desc: "Filtramos a quienes buscan arriendo para que solo lleguen candidatos serios y verificados.",
    color: "hsl(340,82%,52%)",
  },
  {
    icon: Lock,
    title: "Sin contacto directo",
    desc: "Nadie te escribe sin pasar por MatchColombia. Protegemos tu privacidad y tu tiempo.",
    color: "hsl(168,72%,40%)",
  },
  {
    icon: CalendarCheck,
    title: "Visitas coordinadas",
    desc: "Agendamos cada visita con inquilinos que ya pasaron nuestro filtro de confianza.",
    color: "hsl(200,90%,50%)",
  },
  {
    icon: MessageCircle,
    title: "Gestión de consultas",
    desc: "Respondemos preguntas y te informamos solo cuando hay un interesado calificado.",
    color: "hsl(32,95%,54%)",
  },
  {
    icon: BarChart3,
    title: "Seguimiento transparente",
    desc: "Ves el estado de verificación, consultas y visitas desde tu panel de propietario.",
    color: "hsl(265,75%,58%)",
  },
];

const FAQ = [
  {
    q: "¿Mi anuncio se publica de inmediato?",
    a: "No. Tú completas el formulario, pero nuestro equipo verifica identidad, inmueble y condiciones antes de activar el anuncio. Así protegemos a propietarios e inquilinos.",
  },
  {
    q: "¿Qué verifican del propietario?",
    a: "Identidad, autorización para arrendar, coherencia de fotos y datos del inmueble, y condiciones reales del arriendo (precio, administración, zona).",
  },
  {
    q: "¿Qué verifican del inquilino?",
    a: "Identidad, perfil de búsqueda, intención seria y referencias básicas cuando aplica. Solo candidatos verificados pueden avanzar a visitas.",
  },
  {
    q: "¿Por qué la verificación en doble vía?",
    a: "Porque la confianza funciona en ambos sentidos: tú necesitas inquilinos serios y ellos necesitan inmuebles reales. Verificamos a los dos lados para que el proceso sea seguro.",
  },
  {
    q: "¿Cuánto cuesta anunciar?",
    a: "Publicar es gratis. La verificación y gestión están incluidas en nuestro modelo de confianza para Bogotá y Barranquilla.",
  },
  {
    q: "¿Los interesados me contactan directamente?",
    a: "No. Todo pasa por el equipo MatchColombia. Tú recibes actualizaciones claras sin exponer tu teléfono a desconocidos.",
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

function VerificationBadge({ label, variant = "verified" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold",
        variant === "verified" && "bg-[hsl(168,72%,40%)]/12 text-[hsl(168,72%,32%)]",
        variant === "review" && "bg-[hsl(32,95%,54%)]/12 text-[hsl(32,95%,38%)]",
        variant === "tenant" && "bg-[hsl(265,75%,58%)]/12 text-[hsl(265,75%,45%)]"
      )}
    >
      <BadgeCheck className="w-3 h-3" />
      {label}
    </span>
  );
}

function TwoWayVerificationVisual() {
  return (
    <div className="rounded-[1.5rem] border border-border/30 bg-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(265,75%,58%)]/10 text-[11px] font-bold text-[hsl(265,75%,45%)] mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verificación en doble vía
        </span>
        <h3 className="font-extrabold text-xl sm:text-2xl">Confianza para propietarios e inquilinos</h3>
      </div>

      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        {/* Propietario */}
        <div className="rounded-[1.25rem] bg-[hsl(240,40%,98%)] border border-border/30 p-5">
          <div className="w-12 h-12 rounded-2xl bg-[hsl(265,75%,58%)]/12 flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-[hsl(265,75%,50%)]" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Propietario</p>
          <h4 className="font-extrabold text-lg mb-3">Publica el inmueble</h4>
          <ul className="space-y-2.5">
            {OWNER_CHECKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Icon className="w-3.5 h-3.5 text-[hsl(265,75%,50%)] shrink-0 mt-0.5" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <VerificationBadge label="Propietario verificado" />
          </div>
        </div>

        {/* Centro MatchColombia */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="hidden md:flex flex-col items-center gap-1 text-muted-foreground/40">
            <div className="w-px h-8 bg-border" />
            <ArrowRight className="w-4 h-4 rotate-0" />
          </div>
          <div className="w-16 h-16 rounded-2xl gradient-cta flex items-center justify-center shadow-lg shadow-[hsl(265,75%,58%)]/25">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <p className="text-xs font-extrabold text-center text-foreground max-w-[120px]">
            {BRAND.name} verifica ambos lados
          </p>
          <div className="hidden md:flex flex-col items-center gap-1 text-muted-foreground/40">
            <ArrowRight className="w-4 h-4" />
            <div className="w-px h-8 bg-border" />
          </div>
        </div>

        {/* Inquilino */}
        <div className="rounded-[1.25rem] bg-[hsl(240,40%,98%)] border border-border/30 p-5">
          <div className="w-12 h-12 rounded-2xl bg-[hsl(340,82%,52%)]/12 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-[hsl(340,82%,52%)]" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Inquilino</p>
          <h4 className="font-extrabold text-lg mb-3">Busca y aplica</h4>
          <ul className="space-y-2.5">
            {TENANT_CHECKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Icon className="w-3.5 h-3.5 text-[hsl(340,82%,52%)] shrink-0 mt-0.5" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <VerificationBadge label="Inquilino verificado" variant="tenant" />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-[hsl(168,72%,40%)]/8 border border-[hsl(168,72%,40%)]/20 text-center">
        <p className="text-sm font-semibold text-foreground">
          Solo cuando <span className="text-[hsl(168,72%,32%)]">ambas partes están verificadas</span> avanzamos a match y visitas.
        </p>
      </div>
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
        <span className="ml-2 text-xs font-semibold text-muted-foreground">Panel propietario · {BRAND.name}</span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tu publicación</p>
            <h3 className="font-extrabold text-lg">Apto en Chapinero · 2 hab.</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" /> Bogotá
            </p>
          </div>
          <VerificationBadge label="Verificado" />
        </div>

        {/* Pipeline status */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl bg-[hsl(0,0%,97%)] border border-border/30">
          {["Publicado", "En revisión", "Verificado", "Activo"].map((s, i) => (
            <div
              key={s}
              className={cn(
                "flex-1 text-center py-2 rounded-lg text-[9px] sm:text-[10px] font-bold transition-colors",
                i === 3 ? "bg-[hsl(168,72%,40%)] text-white" : i < 3 ? "text-muted-foreground" : ""
              )}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Consultas", value: "12", icon: MessageCircle },
            { label: "Visitas", value: "4", icon: CalendarCheck },
            { label: "Verificados", value: "8", icon: UserCheck },
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
            { text: "Inmueble verificado — anuncio activo", time: "Hoy", verified: true },
            { text: "Inquilino verificado — match 92%", time: "Ayer", verified: true },
            { text: "Visita confirmada — perfil aprobado", time: "Ayer", verified: true },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-white">
              <div className="w-8 h-8 rounded-full bg-[hsl(168,72%,40%)]/12 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-4 h-4 text-[hsl(168,72%,32%)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate">{item.text}</p>
                <p className="text-[10px] text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
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
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(168,72%,40%)]/6 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20 relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[hsl(168,72%,40%)]/30 text-[11px] font-bold text-[hsl(168,72%,32%)] mb-5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verificación en doble vía
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.1rem] font-extrabold tracking-tight leading-[1.08] text-foreground">
                Tú publicas.
                <br />
                <span className="text-gradient">Nosotros verificamos.</span>
                <br />
                Todos confían.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                En {BRAND.name} verificamos propietarios e inquilinos antes de conectarlos. Tu inmueble no se publica sin revisión, y ningún interesado llega a ti sin pasar nuestro filtro de confianza.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/publicar"
                  className="inline-flex items-center justify-center gap-2 gradient-cta text-white font-bold px-7 py-4 rounded-full shadow-lg shadow-[hsl(265,75%,58%)]/25 hover:opacity-95 transition-opacity"
                >
                  Enviar mi inmueble a verificación
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
                {["Verificamos dueños", "Verificamos inquilinos", "Publicar es gratis"].map((item) => (
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

      {/* Two-way verification — hero section */}
      <section className="section-pad bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TwoWayVerificationVisual />
          </motion.div>
        </div>
      </section>

      {/* Publish → Verify pipeline */}
      <section className="section-pad bg-[hsl(240,40%,98%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Tu inmueble <span className="text-gradient">no se publica solo</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Tú envías la información. Nuestro equipo revisa todo antes de activar el anuncio. Así garantizamos confianza también para quien busca arrendar.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PUBLISH_PIPELINE.map(({ step, title, desc, status }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative p-5 sm:p-6 rounded-[1.25rem] bg-white border border-border/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-foreground text-white text-sm font-extrabold flex items-center justify-center">
                    {step}
                  </span>
                  {status === "review" && <VerificationBadge label="Revisión" variant="review" />}
                  {status === "live" && <VerificationBadge label="Verificado" />}
                </div>
                <h3 className="font-extrabold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="section-pad bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Por qué confiar tu inmueble a {BRAND.name}
            </h2>
            <p className="mt-4 text-muted-foreground">
              No somos un tablón de anuncios. Somos una plataforma con procesos de verificación reales.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {TRUST_PILLARS.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-[1.25rem] border border-border/30 bg-[hsl(0,0%,99%)]"
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

      {/* Guarantee block */}
      <section className="section-pad bg-[hsl(240,40%,98%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center rounded-[1.5rem] bg-foreground text-white p-8 sm:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[hsl(265,75%,58%)]/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60 mb-4">
                <Shield className="w-3.5 h-3.5" />
                Garantía de confianza
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Protegemos al propietario y al inquilino
              </h2>
              <p className="mt-4 text-white/70 leading-relaxed">
                Verificamos dueños para que el inquilino sepa que el inmueble es real. Verificamos inquilinos para que tú recibas solo personas serias. Esa es la diferencia de {BRAND.name} en Bogotá y Barranquilla.
              </p>
              <Link
                to="/publicar"
                className="inline-flex items-center gap-2 mt-8 bg-white text-foreground font-bold px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors"
              >
                Iniciar verificación de mi inmueble
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative grid grid-cols-2 gap-4">
              {[
                { value: "100%", label: "Inmuebles revisados antes de publicar", icon: Home },
                { value: "2 vías", label: "Verificación propietario + inquilino", icon: ShieldCheck },
                { value: "0", label: "Contacto directo sin filtro", icon: Lock },
                { value: "24h", label: "Respuesta del equipo de verificación", icon: Bell },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label} className="p-5 rounded-[1.25rem] bg-white/10 border border-white/15 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-[hsl(168,72%,55%)] mb-2" />
                  <p className="text-2xl font-extrabold">{value}</p>
                  <p className="text-xs text-white/65 mt-1 leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-2">Preguntas sobre verificación</h2>
          <p className="text-center text-muted-foreground text-sm mb-8">Todo lo que necesitas saber antes de anunciar</p>
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
          <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Entrega tu inmueble con confianza
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Publica hoy. Nosotros verificamos. Los inquilinos también. Así construimos un mercado de arriendo más seguro en Colombia.
          </p>
          <Link
            to="/publicar"
            className="inline-flex items-center gap-2 mt-8 gradient-cta text-white font-bold px-8 py-4 rounded-full shadow-lg hover:opacity-95 transition-opacity"
          >
            Enviar inmueble a verificación
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">Gratis · Sin compromiso · Bogotá y Barranquilla</p>
        </div>
      </section>
    </div>
  );
}
