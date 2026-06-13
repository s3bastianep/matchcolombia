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

const BENEFITS = [
  {
    icon: Shield,
    title: "Listado verificado",
    desc: "Revisamos datos, fotos y documentación antes de activar tu anuncio.",
  },
  {
    icon: Zap,
    title: "Gestión de consultas",
    desc: "Respondemos por ti y filtramos compradores interesados.",
  },
  {
    icon: MessageCircleOff,
    title: "Sin mensajes sueltos",
    desc: "Tú recibes resúmenes claros, no cientos de WhatsApps.",
  },
  {
    icon: ClipboardCheck,
    title: "Seguimiento completo",
    desc: "Ofertas, visitas y estado de tu venta siempre visibles.",
  },
];

const PROCESS = [
  { title: "Registras", desc: "Barrio, precio, fotos y características.", icon: Home },
  { title: "Verificamos", desc: "Revisamos y activamos tu listado.", icon: FileCheck },
  { title: "Gestionamos", desc: "Consultas y visitas con compradores.", icon: Users },
  { title: "Cierras", desc: "Te acompañamos hasta concretar la venta.", icon: BadgeCheck },
];

const COMMITMENTS = [
  "Tu teléfono no se muestra en el anuncio",
  "Solo te contactamos con interesados filtrados",
  "Publicación gratuita en Bogotá y Barranquilla",
  "Puedes vender o arrendar según tu objetivo",
];

const FAQ = [
  {
    q: "¿Cómo ayuda MatchColombia a vender mi inmueble?",
    a: "Verificamos tu propiedad, la promocionamos a compradores y gestionamos consultas y visitas. Tú recibes información clara sin atender cada mensaje.",
  },
  {
    q: "¿Cuánto cuesta vender con MatchColombia?",
    a: "Publicar es gratis. Te explicamos honorarios y opciones cuando registres tu propiedad.",
  },
  {
    q: "¿Tengo que hablar con los interesados?",
    a: "No. MatchColombia atiende consultas, agenda visitas y te informa. Tú no expones tu teléfono ni recibes mensajes directos.",
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

function LeadForm() {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Nombre</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(265,75%,58%)]" />
            <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/50 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,52%)]/30" placeholder="Tu nombre" />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Correo</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(340,82%,52%)]" />
            <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/50 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,52%)]/30" placeholder="tu@email.com" />
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Barrio</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(168,72%,40%)]" />
            <input type="text" value={form.neighborhood} onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/50 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,52%)]/30" placeholder="Ej: Chapinero" />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Ciudad</label>
          <select value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-border/50 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,52%)]/30">
            {CITIES.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Celular</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(168,72%,40%)]" />
          <input type="tel" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/50 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,52%)]/30" placeholder="+57 300 000 0000" />
        </div>
      </div>
      <button type="submit" className="w-full gradient-cta text-white font-bold py-4 rounded-xl hover:opacity-95 transition-opacity shadow-lg">
        Vender con {BRAND.name}
      </button>
      <a
        href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, quiero vender mi inmueble con MatchColombia")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-border/60 font-bold text-sm hover:bg-secondary transition-colors"
      >
        Conversemos por WhatsApp
      </a>
    </form>
  );
}

export default function Sell() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* Breadcrumb claro — distinto al panel oscuro de Anunciar */}
      <div className="bg-white border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3 text-border" />
            <span className="text-foreground/80">Vender</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(265,75%,45%)] bg-[hsl(265,75%,58%)]/8 px-3 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            Venta de inmuebles
          </span>
        </div>
      </div>

      {/* Hero invertido: imagen izquierda + panel claro derecha */}
      <section className="grid lg:grid-cols-[1fr_minmax(0,44%)] min-h-[460px] lg:min-h-[500px] border-b border-border/40">
        <div className="relative min-h-[300px] lg:min-h-full order-2 lg:order-1">
          <img src={INTERIORS.casa} alt="Inmueble en venta" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/20" />
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 flex flex-wrap gap-2">
            {["Verificado", "Bogotá", "Barranquilla"].map((pill) => (
              <span key={pill} className="px-3 py-1.5 rounded-full bg-white/95 text-[10px] font-bold text-foreground shadow-sm">
                {pill}
              </span>
            ))}
          </div>
        </div>
        <div className="px-6 sm:px-10 lg:px-12 py-12 lg:py-16 flex flex-col justify-center order-1 lg:order-2 bg-[hsl(240,40%,98%)]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md lg:ml-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-[hsl(265,75%,50%)] mb-4">Vender en Colombia</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground">
              Vende tu inmueble con <span className="text-gradient">confianza</span>
            </h1>
            <p className="mt-5 text-muted-foreground text-sm sm:text-base leading-relaxed">
              {BRAND.name} verifica tu propiedad, gestiona consultas y visitas. Tú no hablas con los interesados — solo recibes información clara.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/publicar/nuevo" className="inline-flex items-center justify-center gap-2 gradient-cta text-white font-bold px-6 py-3.5 rounded-xl hover:opacity-95 transition-opacity text-sm">
                Vender mi inmueble
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#vender-form" className="inline-flex items-center justify-center gap-2 border border-border/60 bg-white font-bold px-6 py-3.5 rounded-xl hover:bg-secondary transition-colors text-sm">
                Déjanos tus datos
              </a>
            </div>
            <Link to="/anunciar" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              ¿Prefieres arrendar? Ir a anunciar
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats en tarjetas — no barra de color */}
      <section className="py-10 sm:py-12 bg-white border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="text-center p-5 sm:p-6 rounded-2xl border border-border/50 bg-[hsl(240,40%,98%)]"
            >
              <p className="text-xl sm:text-2xl font-extrabold text-foreground">{value}</p>
              <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Beneficios en grid — no filas alternadas */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Qué obtienes al vender con nosotros</h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base">
              Verificación, exposición y gestión sin que tú atiendas cada consulta.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 sm:p-6 rounded-2xl border border-border/50 bg-white card-hover"
              >
                <div className="w-11 h-11 rounded-xl bg-[hsl(265,75%,58%)]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[hsl(265,75%,50%)]" />
                </div>
                <h3 className="font-extrabold text-base mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso horizontal — no timeline vertical */}
      <section className="py-16 sm:py-20 bg-[hsl(240,40%,98%)] border-y border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Cómo funciona la venta</h2>
            <p className="mt-3 text-muted-foreground">Cuatro pasos claros de principio a fin.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PROCESS.map(({ title, desc, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative bg-white rounded-2xl border border-border/50 p-5 sm:p-6"
              >
                <span className="text-[10px] font-extrabold text-[hsl(340,82%,52%)] uppercase tracking-wider">Paso {i + 1}</span>
                <div className="w-10 h-10 rounded-xl bg-[hsl(265,35%,22%)] flex items-center justify-center mt-3 mb-4">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-extrabold text-base">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compromisos — reemplaza testimonios */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[360px]">
            <img src={INTERIORS.conjunto} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(265,35%,22%)]/70 via-[hsl(265,35%,22%)]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">Nuestro compromiso</span>
              </div>
              <p className="text-white font-extrabold text-lg sm:text-xl leading-snug">
                Gestión real por el equipo {BRAND.name} — sin promesas vacías.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Lo que puedes esperar</h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
              Transparencia desde el primer contacto. Esto es lo que hacemos por ti.
            </p>
            <ul className="mt-8 space-y-4">
              {COMMITMENTS.map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[hsl(168,72%,40%)]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[hsl(168,72%,40%)]" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold text-foreground/90">{text}</span>
                </li>
              ))}
            </ul>
            <Link to="/publicar/nuevo" className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-[hsl(265,75%,50%)] hover:underline">
              Empezar ahora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ centrado */}
      <section className="py-16 sm:py-20 bg-[hsl(240,40%,98%)] border-t border-border/40">
        <div className="max-w-2xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center">Preguntas frecuentes</h2>
          <p className="mt-3 text-muted-foreground text-center text-sm sm:text-base mb-8">
            Todo lo que necesitas saber antes de vender.
          </p>
          <div className="bg-white rounded-2xl border border-border/50 px-5 sm:px-6 shadow-sm">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Formulario en panel claro — distinto al oscuro de Anunciar */}
      <section id="vender-form" className="py-16 sm:py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
          <div className="lg:pt-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ¿Listo para vender?
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Completa tus datos y deja que {BRAND.name} gestione la venta de tu propiedad.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                { icon: Handshake, text: "Sin exclusividad obligatoria" },
                { icon: Camera, text: "Revisión de fotos y datos" },
                { icon: Shield, text: "Listado con sello verificado" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm font-semibold text-foreground/85">
                  <Icon className="w-4 h-4 text-[hsl(265,75%,50%)] shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
            <Link to="/explorar?intent=compra" className="inline-flex items-center gap-1.5 mt-8 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              ¿Buscas comprar? Ir a inmuebles
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="surface-card p-6 sm:p-8 shadow-lg border border-border/50">
            <h3 className="font-extrabold text-lg mb-1">Cuéntanos sobre tu inmueble</h3>
            <p className="text-sm text-muted-foreground mb-6">Bogotá y Barranquilla · Gratis</p>
            <LeadForm />
          </div>
        </div>
      </section>
    </div>
  );
}
