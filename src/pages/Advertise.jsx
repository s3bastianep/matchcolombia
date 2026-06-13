import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock,
  Headphones,
  Home,
  MessageCircleOff,
  Shield,
  Sparkles,
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

const STATS = [
  { value: "100%", label: "Gestión por MatchColombia" },
  { value: "0", label: "Contacto directo con interesados" },
  { value: "Gratis", label: "Publicar tu inmueble" },
  { value: "2", label: "Ciudades: Bogotá y Barranquilla" },
];

const BENEFITS = [
  {
    icon: Zap,
    title: "Eficiente",
    headline: "Gestión total de visitas y consultas",
    desc: "Respondemos por ti, agendamos visitas y filtramos interesados. Tú no recibes llamadas ni mensajes de desconocidos.",
    color: "hsl(265,75%,58%)",
  },
  {
    icon: Shield,
    title: "Protegido",
    headline: "Arrendatarios evaluados por nuestro equipo",
    desc: "Solo te presentamos candidatos que pasaron nuestro filtro. Verificamos perfil e intención antes de avanzar.",
    color: "hsl(340,82%,52%)",
  },
  {
    icon: MessageCircleOff,
    title: "Sin estrés",
    headline: "Nosotros hablamos con los clientes",
    desc: "Toda la comunicación pasa por MatchColombia. Tú recibes resúmenes claros, no cientos de mensajes sueltos.",
    color: "hsl(168,72%,40%)",
  },
  {
    icon: ClipboardCheck,
    title: "Transparente",
    headline: "Todo tu proceso en un solo lugar",
    desc: "Consultas, visitas, candidatos y estado de tu publicación. Siempre sabes en qué va tu inmueble.",
    color: "hsl(200,90%,50%)",
  },
  {
    icon: Handshake,
    title: "Simple",
    headline: "Tú decides, nosotros ejecutamos",
    desc: "Cuando hay un candidato serio, te lo presentamos. El resto del seguimiento lo hacemos nosotros.",
    color: "hsl(32,95%,54%)",
  },
];

const PROCESS = [
  {
    step: "1",
    title: "Registras tu propiedad",
    desc: "Completa el formulario con fotos, precio en COP, zona y características. Toma pocos minutos.",
    icon: Home,
  },
  {
    step: "2",
    title: "Publicamos por ti",
    desc: "Revisamos tu anuncio, lo activamos y lo promocionamos a arrendatarios que buscan en tu zona.",
    icon: Camera,
  },
  {
    step: "3",
    title: "Gestionamos a los interesados",
    desc: "Atendemos consultas, coordinamos visitas y evaluamos candidatos. Sin que tú hables con nadie.",
    icon: Users,
  },
  {
    step: "4",
    title: "Eliges con confianza",
    desc: "Te presentamos al mejor candidato. Nosotros seguimos el proceso hasta cerrar el arriendo.",
    icon: BadgeCheck,
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
    text: "Pensé que tendría que responder mensajes todo el día. Para nada: el equipo gestionó consultas y me presentó dos candidatos buenos.",
    author: "Andrés V.",
    role: "Propietario · Barranquilla",
  },
];

const FAQ = [
  {
    q: "¿Tengo que hablar con los interesados?",
    a: "No. Esa es la idea. MatchColombia atiende consultas, responde preguntas, agenda visitas y te informa. Tú no expones tu teléfono ni recibes mensajes directos.",
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
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Nombre</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/60 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(265,75%,58%)]/30"
              placeholder="Tu nombre"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Correo electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/60 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(265,75%,58%)]/30"
              placeholder="tu@email.com"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Celular</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/60 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(265,75%,58%)]/30"
            placeholder="+57 300 000 0000"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full gradient-cta text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-95 transition-opacity"
      >
        Publicar con {BRAND.name}
      </button>
      <a
        href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, quiero publicar mi inmueble con MatchColombia")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-border font-bold text-sm hover:bg-secondary transition-colors"
      >
        Conversemos por WhatsApp
      </a>
    </form>
  );
}

export default function Advertise() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero — estilo Houm */}
      <section className="relative min-h-[520px] sm:min-h-[580px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold mb-6 border border-white/20">
              <Building2 className="w-3.5 h-3.5" />
              Para propietarios en Colombia
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-white leading-[1.06] tracking-tight">
              Arrienda rápido, fácil y seguro.
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-white/85 leading-relaxed font-medium">
              Publica gratis. <span className="text-white font-bold">Nosotros nos encargamos de todo</span> — consultas, visitas y candidatos. Tú no hablas con los interesados.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/publicar"
                className="inline-flex items-center justify-center gap-2 bg-white text-foreground font-bold px-7 py-4 rounded-full hover:bg-white/90 transition-colors shadow-xl"
              >
                Publicar mi inmueble gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#publicar-form"
                className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold px-7 py-4 rounded-full hover:bg-white/25 transition-colors"
              >
                Déjanos tus datos
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-gradient">{value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1 leading-snug">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cuidamos tu propiedad */}
      <section className="section-pad bg-[hsl(240,40%,98%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Cuidamos tu propiedad
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed text-base">
              Administración eficiente sin que tengas que estar pendiente. Olvídate de las llamadas, los mensajes y las visitas mal coordinadas.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, title, headline, desc, color }, i) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "p-6 sm:p-7 rounded-[1.35rem] bg-white border border-border/30 shadow-[0_4px_24px_rgba(15,23,42,0.04)]",
                  i === 4 && "sm:col-span-2 lg:col-span-1"
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color }}>
                    {title}
                  </span>
                </div>
                <h3 className="font-extrabold text-lg mb-2 leading-snug">{headline}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Te respaldamos */}
      <section className="section-pad bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Te respaldamos de verdad
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-base">
                Desde tu publicación hasta el seguimiento con candidatos. En {BRAND.name} encuentras gestión completa: nosotros hablamos con los clientes, tú solo recibes información clara para decidir.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Atendemos consultas por ti",
                  "Coordinamos todas las visitas",
                  "Evaluamos arrendatarios antes de presentártelos",
                  "Sin exponer tu teléfono personal",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-foreground/85">
                    <Check className="w-4 h-4 text-[hsl(168,72%,40%)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.5rem] overflow-hidden border border-border/30 shadow-[0_16px_48px_rgba(15,23,42,0.1)]">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Propiedad en Colombia"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-5 bg-[hsl(0,0%,98%)] border-t border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center shrink-0">
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
        </div>
      </section>

      {/* Proceso */}
      <section className="section-pad bg-[hsl(240,40%,98%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Nuestro proceso: simple y efectivo</h2>
            <p className="mt-3 text-muted-foreground">Tú publicas. Nosotros hacemos el resto.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-[1.35rem] border border-border/30 overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-br from-[hsl(265,75%,58%)]/10 to-[hsl(340,82%,52%)]/10 flex items-center justify-center">
                  <Icon className="w-12 h-12 text-[hsl(265,75%,50%)] opacity-80" strokeWidth={1.25} />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[hsl(265,75%,50%)]">
                    Paso {step}
                  </span>
                  <h3 className="font-extrabold text-base mt-1 mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios propietarios */}
      <section className="section-pad bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold">¿Qué opinan los propietarios?</h2>
            <p className="mt-2 text-muted-foreground text-sm">Quienes ya dejaron la gestión en nuestras manos</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {OWNER_TESTIMONIALS.map((t, i) => (
              <motion.blockquote
                key={t.author}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 rounded-[1.25rem] bg-[hsl(240,40%,98%)] border border-border/30"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[hsl(32,95%,54%)] text-[hsl(32,95%,54%)]" />
                  ))}
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <footer className="mt-4 pt-4 border-t border-border/30">
                  <p className="font-bold text-sm">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-[hsl(240,40%,98%)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-8">Preguntas frecuentes</h2>
          <div className="rounded-[1.25rem] border border-border/30 bg-white px-6">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Formulario + CTA final — estilo Houm */}
      <section id="publicar-form" className="section-pad bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                ¿Listo para arrendar sin estrés?
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Completa tus datos y deja que {BRAND.name} gestione tu propiedad. Sin exclusividad, sin contacto directo con interesados, con asesoría personalizada.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: Shield, text: "Arriendo seguro y gestionado" },
                  { icon: Home, text: "Tu propiedad siempre en buenas manos" },
                  { icon: UserCheck, text: "Asesoría del equipo MatchColombia" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm font-semibold">
                    <div className="w-9 h-9 rounded-xl bg-[hsl(265,75%,58%)]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[hsl(265,75%,50%)]" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.5rem] border border-border/30 bg-[hsl(240,40%,98%)] p-6 sm:p-8 shadow-[0_8px_32px_rgba(15,23,42,0.06)]">
              <h3 className="font-extrabold text-xl mb-1">Publica gratis</h3>
              <p className="text-sm text-muted-foreground mb-6">Sin exclusividad · Bogotá y Barranquilla</p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
