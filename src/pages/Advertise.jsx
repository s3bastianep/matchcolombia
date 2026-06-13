import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Headphones,
  Home,
  MessageCircleOff,
  Shield,
  UserCheck,
  Users,
  Zap,
  Camera,
  ClipboardCheck,
  Handshake,
  Star,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { PEOPLE, INTERIORS } from "@/lib/colombiaImages";
import SectionHeader from "@/components/ui/SectionHeader";

const STATS = [
  { value: "100%", label: "Gestión por MatchColombia", accent: "hsl(265,75%,58%)" },
  { value: "0", label: "Contacto directo con interesados", accent: "hsl(340,82%,52%)" },
  { value: "Gratis", label: "Publicar tu inmueble", accent: "hsl(168,72%,40%)" },
  { value: "2", label: "Ciudades activas", accent: "hsl(200,90%,50%)" },
];

const BENEFITS = [
  {
    icon: Zap,
    tag: "Eficiente",
    headline: "Gestión total de visitas y consultas",
    desc: "Respondemos por ti, agendamos visitas y filtramos interesados. Tú no recibes llamadas ni mensajes de desconocidos.",
    bg: "bg-[hsl(265,75%,58%)]/10",
    iconColor: "text-[hsl(265,75%,50%)]",
    ring: "ring-[hsl(265,75%,58%)]/20",
  },
  {
    icon: Shield,
    tag: "Protegido",
    headline: "Arrendatarios evaluados por nuestro equipo",
    desc: "Solo te presentamos candidatos que pasaron nuestro filtro. Verificamos perfil e intención antes de avanzar.",
    bg: "bg-[hsl(340,82%,52%)]/10",
    iconColor: "text-[hsl(340,82%,52%)]",
    ring: "ring-[hsl(340,82%,52%)]/20",
  },
  {
    icon: MessageCircleOff,
    tag: "Sin estrés",
    headline: "Nosotros hablamos con los clientes",
    desc: "Toda la comunicación pasa por MatchColombia. Tú recibes resúmenes claros, no cientos de mensajes sueltos.",
    bg: "bg-[hsl(168,72%,40%)]/10",
    iconColor: "text-[hsl(168,72%,40%)]",
    ring: "ring-[hsl(168,72%,40%)]/20",
  },
  {
    icon: ClipboardCheck,
    tag: "Transparente",
    headline: "Todo tu proceso en un solo lugar",
    desc: "Consultas, visitas, candidatos y estado de tu publicación. Siempre sabes en qué va tu inmueble.",
    bg: "bg-[hsl(200,90%,50%)]/10",
    iconColor: "text-[hsl(200,90%,50%)]",
    ring: "ring-[hsl(200,90%,50%)]/20",
  },
  {
    icon: Handshake,
    tag: "Simple",
    headline: "Tú decides, nosotros ejecutamos",
    desc: "Cuando hay un candidato serio, te lo presentamos. El resto del seguimiento lo hacemos nosotros.",
    bg: "bg-[hsl(32,95%,54%)]/10",
    iconColor: "text-[hsl(32,95%,54%)]",
    ring: "ring-[hsl(32,95%,54%)]/20",
  },
];

const PROCESS = [
  {
    num: "01",
    title: "Registras tu propiedad",
    desc: "Completa el formulario con fotos, precio en COP, zona y características.",
    icon: Home,
    accent: "from-[hsl(340,82%,52%)] to-[hsl(265,75%,58%)]",
    ring: "ring-[hsl(340,82%,52%)]/20",
  },
  {
    num: "02",
    title: "Publicamos por ti",
    desc: "Revisamos tu anuncio, lo activamos y lo promocionamos en tu zona.",
    icon: Camera,
    accent: "from-[hsl(265,75%,58%)] to-[hsl(200,90%,50%)]",
    ring: "ring-[hsl(265,75%,58%)]/20",
  },
  {
    num: "03",
    title: "Gestionamos interesados",
    desc: "Atendemos consultas, coordinamos visitas y evaluamos candidatos por ti.",
    icon: Users,
    accent: "from-[hsl(200,90%,50%)] to-[hsl(168,72%,40%)]",
    ring: "ring-[hsl(200,90%,50%)]/20",
  },
  {
    num: "04",
    title: "Eliges con confianza",
    desc: "Te presentamos al mejor candidato. Nosotros seguimos el proceso.",
    icon: BadgeCheck,
    accent: "from-[hsl(168,72%,40%)] to-[hsl(32,95%,54%)]",
    ring: "ring-[hsl(168,72%,40%)]/20",
  },
];

const OWNER_TESTIMONIALS = [
  {
    text: "Lo mejor es que no me escribieron 50 personas por WhatsApp. MatchColombia filtró todo y solo me avisaron cuando había alguien serio.",
    author: "Carlos M.",
    role: "Propietario · Chapinero",
  },
  {
    text: "Publicé mi apartamento un martes y ellos se encargaron de las visitas el fin de semana. Yo solo recibí el resumen.",
    author: "María Elena R.",
    role: "Propietaria · Usaquén",
  },
  {
    text: "Pensé que tendría que responder mensajes todo el día. El equipo gestionó consultas y me presentó dos candidatos buenos.",
    author: "Andrés V.",
    role: "Propietario · Barranquilla",
  },
];

const FAQ = [
  {
    q: "¿Tengo que hablar con los interesados?",
    a: "No. MatchColombia atiende consultas, responde preguntas, agenda visitas y te informa. Tú no expones tu teléfono ni recibes mensajes directos.",
  },
  {
    q: "¿Cuánto cuesta publicar?",
    a: "Publicar tu inmueble es gratis en Bogotá y Barranquilla. Nos enfocamos en gestionar el proceso para que arrendes más rápido y con menos estrés.",
  },
  {
    q: "¿Cómo funciona la gestión de visitas?",
    a: "Coordinamos horarios con arrendatarios filtrados, confirmamos asistencia y te avisamos. No necesitas estar pendiente del chat con cada interesado.",
  },
  {
    q: "¿Cómo elijo al arrendatario?",
    a: "Cuando un candidato pasa nuestra evaluación, te enviamos su perfil. Tú apruebas o rechazas. Nosotros seguimos el seguimiento administrativo.",
  },
  {
    q: "¿Puedo publicar en arriendo y venta?",
    a: "Sí. Indica el tipo de operación al registrar tu propiedad y adaptamos la gestión según lo que necesites.",
  },
  {
    q: "¿En qué ciudades operan?",
    a: "Actualmente en Bogotá y Barranquilla, con cobertura local en las principales zonas de arriendo.",
  },
];

function CollagePhoto({ src, alt, className }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] border-[3px] sm:border-4 border-white shadow-xl shadow-black/10 bg-muted",
        className
      )}
    >
      <img src={src} alt={alt} loading="eager" className="absolute inset-0 w-full h-full object-cover object-center" />
    </div>
  );
}

function HeroCollage() {
  return (
    <div className="relative w-full flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12 lg:py-14 min-h-[260px] sm:min-h-[320px] lg:min-h-[380px]">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(265,75%,58%)]/8 via-white to-[hsl(340,82%,52%)]/6 pointer-events-none" />
      <div className="absolute top-[10%] right-[10%] w-64 h-64 rounded-full gradient-cta opacity-[0.12] blur-3xl pointer-events-none" />
      <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[400px] aspect-square mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="absolute inset-[6%] z-10">
          <CollagePhoto src={PEOPLE.collageMain} alt="Apartamento en Bogotá" className="w-full h-full shadow-2xl" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -12, rotate: -6 }} animate={{ opacity: 1, x: 0, rotate: -6 }} transition={{ duration: 0.5, delay: 0.12 }} className="absolute bottom-0 left-[-2%] w-[44%] aspect-[4/5] z-20">
          <CollagePhoto src={INTERIORS.conjunto} alt="Conjunto residencial" className="w-full h-full" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 12, rotate: 8 }} animate={{ opacity: 1, x: 0, rotate: 8 }} transition={{ duration: 0.5, delay: 0.2 }} className="absolute top-0 right-[-2%] w-[40%] aspect-square z-20">
          <CollagePhoto src={INTERIORS.casa} alt="Casa en Colombia" className="w-full h-full" />
        </motion.div>
      </div>
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
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-bold text-foreground pr-4">{q}</span>
        <ChevronDown className={cn("w-5 h-5 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </div>
  );
}

function LeadForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.name) params.set("name", form.name);
    if (form.email) params.set("email", form.email);
    if (form.phone) params.set("phone", form.phone);
    navigate(`/publicar${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Nombre</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(265,75%,58%)]" />
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border/50 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,52%)]/25"
              placeholder="Tu nombre"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Correo</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(340,82%,52%)]" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border/50 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,52%)]/25"
              placeholder="tu@email.com"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Celular</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(168,72%,40%)]" />
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border/50 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,52%)]/25"
            placeholder="+57 300 000 0000"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full gradient-cta btn-glow text-white font-bold py-4 rounded-2xl hover:opacity-95 transition-opacity"
      >
        Publicar con {BRAND.name}
      </button>
      <a
        href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, quiero publicar mi inmueble con MatchColombia")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-border/60 font-bold text-sm hover:bg-secondary transition-colors"
      >
        Conversemos por WhatsApp
      </a>
    </form>
  );
}

export default function Advertise() {
  return (
    <div className="w-full overflow-x-hidden bg-[hsl(240,40%,98%)]">
      {/* Hero — mismo layout que Home */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 gradient-hero opacity-40 pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center max-w-7xl mx-auto">
          <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16 order-1">
            <span className="section-badge bg-[hsl(265,75%,58%)]/10 text-[hsl(265,75%,50%)] border border-[hsl(265,75%,58%)]/20 w-fit mb-5">
              Para propietarios
            </span>
            <h1 className="font-extrabold leading-[1.05] tracking-tight text-[clamp(2rem,5.5vw,3.25rem)]">
              Arrienda rápido.
              <br />
              <span className="text-gradient">Sin hablar con nadie.</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-4 mb-7 max-w-md leading-relaxed">
              Publica gratis en Bogotá y Barranquilla. {BRAND.name} gestiona consultas, visitas y candidatos — tú solo recibes información clara para decidir.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/publicar"
                className="inline-flex items-center justify-center gap-2 gradient-cta btn-glow text-white font-bold px-6 py-3.5 rounded-full hover:opacity-95 transition-opacity text-sm"
              >
                Publicar mi inmueble
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#publicar-form"
                className="text-sm font-bold text-[hsl(265,75%,50%)] hover:underline"
              >
                Déjanos tus datos
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-4 gap-y-2">
              {["Gestión completa", "Sin contacto directo", "Publicar gratis"].map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-xs font-semibold text-foreground/75">
                  <Check className="w-3.5 h-3.5 text-[hsl(168,72%,40%)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="order-2">
            <HeroCollage />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/40 bg-[hsl(240,40%,98%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="surface-card p-5 sm:p-6 text-center card-hover"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-gradient">{value}</p>
                <p className="text-xs text-muted-foreground font-semibold mt-1.5 leading-snug">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <SectionHeader
            align="center"
            eyebrow="Gestión completa"
            title="Cuidamos tu propiedad"
            subtitle="Administración eficiente sin que tengas que estar pendiente. Olvídate de llamadas, mensajes y visitas mal coordinadas."
            className="mb-12 sm:mb-14"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, tag, headline, desc, bg, iconColor, ring }, i) => (
              <motion.article
                key={tag}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={cn("surface-card p-6 card-hover ring-2", ring, i === 4 && "sm:col-span-2 lg:col-span-1")}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center", bg)}>
                    <Icon className={cn("w-5 h-5", iconColor)} />
                  </div>
                  <span className={cn("text-[10px] font-extrabold uppercase tracking-wider", iconColor)}>{tag}</span>
                </div>
                <h3 className="font-extrabold text-lg mb-2 leading-snug">{headline}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Te respaldamos */}
      <section className="section-pad relative overflow-hidden bg-[hsl(240,40%,98%)] border-y border-border/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[hsl(340,82%,52%)]/8 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[hsl(265,75%,58%)]/8 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <SectionHeader
                eyebrow="Equipo MatchColombia"
                title="Te respaldamos de verdad"
                subtitle={`${BRAND.contactTagline}. Nosotros hablamos con los clientes; tú solo recibes información clara para decidir.`}
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Atendemos consultas por ti",
                  "Coordinamos todas las visitas",
                  "Evaluamos arrendatarios antes de presentártelos",
                  "Sin exponer tu teléfono personal",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-foreground/85">
                    <div className="w-5 h-5 rounded-full bg-[hsl(168,72%,40%)]/15 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[hsl(168,72%,40%)]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card overflow-hidden card-hover">
              <img src={INTERIORS.sala2} alt="Propiedad en Colombia" className="w-full aspect-[4/3] object-cover" />
              <div className="p-5 border-t border-border/40 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl gradient-cta flex items-center justify-center shrink-0 shadow-md">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-extrabold text-sm">{BRAND.contactRole}</p>
                  <p className="text-xs text-muted-foreground">{BRAND.contactTagline}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso — estilo MatchSteps */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <SectionHeader
            align="center"
            eyebrow="Paso a paso"
            title="Nuestro proceso"
            subtitle="Tú publicas. Nosotros hacemos el resto."
            className="mb-12"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map(({ num, title, desc, icon: Icon, accent, ring }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={cn("surface-card p-5 card-hover ring-2", ring)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold text-muted-foreground">{num}</span>
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm", accent)}>
                    <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="font-extrabold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="section-pad bg-[hsl(240,40%,98%)] border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <SectionHeader
            align="center"
            eyebrow="Propietarios"
            title="¿Qué opinan quienes ya confían?"
            subtitle="Quienes dejaron la gestión en nuestras manos"
            className="mb-10"
          />
          <div className="grid md:grid-cols-3 gap-5">
            {OWNER_TESTIMONIALS.map((t, i) => (
              <motion.blockquote
                key={t.author}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="surface-card p-6 card-hover"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[hsl(32,95%,54%)] text-[hsl(32,95%,54%)]" />
                  ))}
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed font-medium">&ldquo;{t.text}&rdquo;</p>
                <footer className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{t.author}</span>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t.role}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <SectionHeader align="center" eyebrow="Ayuda" title="Preguntas frecuentes" className="mb-8" />
          <div className="surface-card px-6">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="publicar-form" className="section-pad relative overflow-hidden bg-[hsl(240,40%,98%)]">
        <div className="absolute inset-0 gradient-hero opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <SectionHeader
                eyebrow="Empezar"
                title="¿Listo para arrendar sin estrés?"
                subtitle={`Completa tus datos y deja que ${BRAND.name} gestione tu propiedad. Sin exclusividad, sin contacto directo con interesados.`}
              />
              <ul className="mt-6 space-y-3">
                {[
                  { icon: Shield, text: "Arriendo seguro y gestionado", color: "hsl(265,75%,58%)" },
                  { icon: Home, text: "Tu propiedad en buenas manos", color: "hsl(340,82%,52%)" },
                  { icon: UserCheck, text: "Asesoría personalizada", color: "hsl(168,72%,40%)" },
                ].map(({ icon: Icon, text, color }) => (
                  <li key={text} className="flex items-center gap-3 text-sm font-semibold">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card p-6 sm:p-8 card-hover">
              <h3 className="font-extrabold text-xl mb-1">Publica gratis</h3>
              <p className="text-sm text-muted-foreground mb-6">Bogotá y Barranquilla · Sin exclusividad</p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
