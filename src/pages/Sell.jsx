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
  Headphones,
  Home,
  MessageCircleOff,
  Shield,
  Users,
  Zap,
  Camera,
  ClipboardCheck,
  Handshake,
  Star,
  Phone,
  Mail,
  User,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { INTERIORS } from "@/lib/colombiaImages";

const STATS = [
  { value: "2×", label: "Más consultas calificadas" },
  { value: "14 días", label: "Promedio hasta oferta" },
  { value: "Gratis", label: "Publicar inmueble" },
  { value: "2", label: "Ciudades activas" },
];

const BENEFITS = [
  {
    icon: Shield,
    tag: "Verificado",
    headline: "Listado con sello de confianza MatchColombia",
    desc: "Revisamos datos, fotos y documentación antes de activar tu anuncio.",
  },
  {
    icon: Zap,
    tag: "Eficiente",
    headline: "Gestión total de consultas y visitas",
    desc: "Respondemos por ti, agendamos visitas y filtramos compradores interesados.",
  },
  {
    icon: MessageCircleOff,
    tag: "Sin estrés",
    headline: "Nosotros hablamos con los compradores",
    desc: "Tú recibes resúmenes claros, no cientos de mensajes sueltos.",
  },
  {
    icon: ClipboardCheck,
    tag: "Transparente",
    headline: "Seguimiento hasta cerrar la operación",
    desc: "Ofertas, visitas y estado de tu venta siempre visibles.",
  },
  {
    icon: Handshake,
    tag: "Simple",
    headline: "Tú decides, nosotros ejecutamos",
    desc: "Te presentamos compradores serios; el seguimiento lo hacemos nosotros.",
  },
];

const PROCESS = [
  { title: "Registras tu propiedad", desc: "Barrio, precio en COP, fotos y características.", icon: Home },
  { title: "Verificamos y publicamos", desc: "Revisamos tu inmueble y lo promocionamos en tu zona.", icon: Camera },
  { title: "Gestionamos compradores", desc: "Consultas, visitas y evaluación — sin que tú hables con nadie.", icon: Users },
  { title: "Cierras con confianza", desc: "Te acompañamos hasta concretar la venta.", icon: BadgeCheck },
];

const SELLER_TESTIMONIALS = [
  {
    text: "Vendí mi apartamento en Chapinero en menos de un mes. MatchColombia filtró las consultas y solo me avisaron cuando había alguien serio.",
    author: "Roberto G.",
    role: "Propietario · Chapinero",
  },
  {
    text: "Publicamos un martes y el equipo coordinó todas las visitas del fin de semana. Yo solo recibí el resumen de cada interesado.",
    author: "Lucía P.",
    role: "Propietaria · Usaquén",
  },
  {
    text: "Me presentaron dos ofertas reales y cerramos sin estrés. Cero llamadas innecesarias.",
    author: "Javier M.",
    role: "Propietario · Barranquilla",
  },
];

const FAQ = [
  {
    q: "¿Cómo ayuda MatchColombia a vender más rápido?",
    a: "Verificamos tu inmueble, lo promocionamos a compradores filtrados y gestionamos consultas y visitas. Tú recibes candidatos serios, no mensajes sueltos.",
  },
  {
    q: "¿Cuánto cuesta vender con MatchColombia?",
    a: "Publicar es gratis. Te explicamos honorarios y opciones cuando registres tu propiedad — sin letra pequeña.",
  },
  {
    q: "¿Tengo que hablar con los interesados?",
    a: "No. MatchColombia atiende consultas, responde preguntas, agenda visitas y te informa. Tú no expones tu teléfono ni recibes mensajes directos.",
  },
  {
    q: "¿Puedo vender y arrendar al mismo tiempo?",
    a: "Sí. Indica el tipo de operación al registrar tu propiedad y te asesoramos según tu objetivo.",
  },
  {
    q: "¿En qué ciudades operan?",
    a: "Bogotá y Barranquilla, con cobertura en las principales zonas residenciales.",
  },
];

function OwnerBreadcrumb() {
  return (
    <div className="bg-[hsl(265,35%,22%)] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
          <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3 text-white/40" />
          <span className="text-white/90">Portal propietarios</span>
          <ChevronRight className="w-3 h-3 text-white/40" />
          <span className="text-white">Vender</span>
        </nav>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/15">
          <TrendingUp className="w-3 h-3" />
          Para quien quiere vender
        </span>
      </div>
    </div>
  );
}

function OwnerSectionTitle({ title, subtitle, light = false, className }) {
  return (
    <div className={cn("border-l-4 border-[hsl(340,82%,52%)] pl-5", className)}>
      <h2 className={cn("text-2xl sm:text-3xl font-extrabold tracking-tight", light ? "text-white" : "text-foreground")}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-2 text-sm sm:text-base leading-relaxed max-w-xl", light ? "text-white/70" : "text-muted-foreground")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ManagementCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-8 sm:bottom-8 sm:w-72 bg-white rounded-2xl shadow-2xl border border-white/80 p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg gradient-cta flex items-center justify-center">
          <Headphones className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Hoy</p>
          <p className="text-xs font-extrabold">4 consultas gestionadas</p>
        </div>
      </div>
      <div className="space-y-2">
        {["Oferta recibida — $420M", "Visita confirmada — sábado 3pm"].map((line) => (
          <div key={line} className="flex items-center gap-2 text-[11px] font-semibold text-foreground/80 bg-[hsl(240,40%,98%)] rounded-lg px-2.5 py-2">
            <Check className="w-3 h-3 text-[hsl(168,72%,40%)] shrink-0" />
            {line}
          </div>
        ))}
      </div>
    </motion.div>
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
      <OwnerBreadcrumb />

      <section className="grid lg:grid-cols-[minmax(0,46%)_1fr] min-h-[480px] lg:min-h-[520px]">
        <div className="bg-[hsl(265,35%,22%)] text-white px-6 sm:px-10 lg:px-12 py-12 lg:py-16 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[hsl(340,82%,52%)]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[hsl(168,72%,40%)]/10 blur-3xl pointer-events-none" />
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="relative max-w-md">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-[hsl(340,82%,60%)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">Portal propietarios</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-[1.1] tracking-tight">
              Vende tu inmueble con confianza
            </h1>
            <p className="mt-5 text-white/75 text-sm sm:text-base leading-relaxed">
              Publica gratis. {BRAND.name} verifica tu propiedad, gestiona consultas y visitas con compradores. Tú no hablas con los interesados — solo recibes información clara.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/publicar/nuevo"
                className="inline-flex items-center justify-center gap-2 bg-white text-[hsl(265,35%,22%)] font-bold px-6 py-3.5 rounded-xl hover:bg-white/90 transition-colors text-sm"
              >
                Vender mi inmueble
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#vender-form" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm">
                Déjanos tus datos
              </a>
            </div>
            <Link
              to="/anunciar"
              className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-white/50 hover:text-white/80 transition-colors"
            >
              ¿Prefieres arrendar? Ir a anunciar
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
        <div className="relative min-h-[280px] lg:min-h-full bg-[hsl(265,25%,30%)]">
          <img src={INTERIORS.casa} alt="Inmueble en venta" className="absolute inset-0 w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(265,35%,22%)]/40 via-transparent to-transparent lg:bg-gradient-to-l lg:from-[hsl(265,35%,22%)]/50 lg:via-transparent lg:to-transparent" />
          <ManagementCard />
        </div>
      </section>

      <section className="color-bar">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="text-center text-white"
            >
              <p className="text-2xl sm:text-3xl font-extrabold">{value}</p>
              <p className="text-[11px] sm:text-xs font-semibold text-white/85 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <OwnerSectionTitle
            title="Vendemos con estrategia"
            subtitle="Verificación, exposición y gestión. Sin llamadas, sin mensajes sueltos, sin visitas mal coordinadas."
            className="mb-12"
          />
          <div className="mt-10 space-y-3">
            {BENEFITS.map(({ icon: Icon, tag, headline, desc }, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, x: i % 2 === 0 ? -12 : 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border",
                  i % 2 === 0 ? "bg-white border-border/40" : "bg-[hsl(265,30%,94%)] border-[hsl(265,75%,58%)]/15"
                )}
              >
                <div className="flex items-center gap-4 sm:w-48 shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-[hsl(265,35%,22%)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[hsl(265,75%,45%)]">{tag}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-base sm:text-lg">{headline}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-y border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <OwnerSectionTitle title="Cómo funciona" subtitle="Tú publicas. Nosotros hacemos el resto." />
          <div className="mt-12 max-w-2xl mx-auto relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-[hsl(265,75%,58%)]/25 hidden sm:block" />
            <div className="space-y-8">
              {PROCESS.map(({ title, desc, icon: Icon }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-5 sm:gap-6 relative"
                >
                  <div className="w-10 h-10 rounded-full bg-[hsl(265,35%,22%)] flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="pt-1.5 pb-2">
                    <span className="text-[10px] font-extrabold text-[hsl(340,82%,52%)] uppercase tracking-wider">Paso {i + 1}</span>
                    <h3 className="font-extrabold text-lg mt-0.5">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <OwnerSectionTitle title="Propietarios que ya vendieron" subtitle="Dejaron la gestión en nuestras manos." />
          <div className="mt-10 grid lg:grid-cols-[1.2fr_1fr] gap-5">
            <blockquote className="bg-[hsl(265,35%,22%)] text-white rounded-2xl p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[hsl(340,82%,52%)]/20 blur-3xl" />
              <div className="relative">
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[hsl(32,95%,54%)] text-[hsl(32,95%,54%)]" />
                  ))}
                </div>
                <p className="text-lg sm:text-xl font-medium leading-relaxed text-white/95">&ldquo;{SELLER_TESTIMONIALS[0].text}&rdquo;</p>
                <footer className="mt-6 pt-6 border-t border-white/15">
                  <p className="font-bold">{SELLER_TESTIMONIALS[0].author}</p>
                  <p className="text-sm text-white/60">{SELLER_TESTIMONIALS[0].role}</p>
                </footer>
              </div>
            </blockquote>
            <div className="space-y-4">
              {SELLER_TESTIMONIALS.slice(1).map((t) => (
                <blockquote key={t.author} className="bg-white border border-border/40 rounded-2xl p-5">
                  <p className="text-sm text-foreground/85 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <footer className="mt-3 text-xs font-bold text-muted-foreground">{t.author} · {t.role}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-t border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <OwnerSectionTitle title="Preguntas frecuentes" subtitle="Todo lo que necesitas saber antes de vender." />
          <div className="bg-[hsl(265,18%,97%)] rounded-2xl border border-border/40 px-5 sm:px-6">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <section id="vender-form" className="bg-[hsl(265,35%,22%)] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <OwnerSectionTitle
              light
              title="¿Listo para vender sin estrés?"
              subtitle={`Completa tus datos y deja que ${BRAND.name} gestione la venta de tu propiedad. Sin exclusividad, sin contacto directo.`}
            />
            <ul className="mt-8 space-y-4">
              {[
                "Venta segura y 100% gestionada",
                "Listado verificado con sello MatchColombia",
                "Asesoría del equipo MatchColombia",
              ].map((text) => (
                <li key={text} className="flex items-center gap-3 text-sm font-semibold text-white/85">
                  <Check className="w-4 h-4 text-[hsl(168,72%,55%)] shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
            <Link to="/explorar?intent=compra" className="inline-flex items-center gap-1.5 mt-8 text-sm font-bold text-white/60 hover:text-white transition-colors">
              ¿Buscas comprar? Ir a inmuebles
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl p-6 sm:p-8">
            <h3 className="font-extrabold text-lg mb-1">Publica gratis</h3>
            <p className="text-sm text-white/60 mb-6">Bogotá y Barranquilla</p>
            <LeadForm dark />
          </div>
        </div>
      </section>
    </div>
  );
}
