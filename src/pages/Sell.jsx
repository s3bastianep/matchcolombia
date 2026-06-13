import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  ChevronDown,
  Handshake,
  Home,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  FileText,
  Calculator,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { CITIES } from "@/lib/colombia";
import { INTERIORS, CITIES_IMG } from "@/lib/colombiaImages";

const SHOWCASE_STATS = [
  { value: "2×", label: "más consultas calificadas" },
  { value: "14 días", label: "promedio hasta oferta" },
  { value: "Verificado", label: "listado premium" },
];

const SELL_OPTIONS = [
  {
    icon: Handshake,
    title: "Arrienda con gestión",
    desc: "Publica gratis y deja que gestionemos consultas, visitas y candidatos por ti.",
    cta: "Ir a anunciar",
    to: "/anunciar",
    external: false,
  },
  {
    icon: Home,
    title: "Publica tú mismo",
    desc: "Crea tu anuncio en minutos. Nosotros revisamos y activamos tu inmueble.",
    cta: "Crear anuncio",
    to: "/publicar/nuevo",
    external: false,
  },
  {
    icon: MessageCircle,
    title: "Habla con el equipo",
    desc: "Cuéntanos tu situación por WhatsApp y te guiamos al mejor camino.",
    cta: "Escribir por WhatsApp",
    href: `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, quiero vender mi inmueble con MatchColombia")}`,
    external: true,
  },
];

const RESOURCES = [
  {
    icon: Calculator,
    title: "Planifica tu venta",
    desc: "Define precio, tiempos y expectativas antes de publicar.",
  },
  {
    icon: Camera,
    title: "Fotos que venden",
    desc: "Buenas imágenes aumentan consultas y visitas calificadas.",
  },
  {
    icon: ClipboardList,
    title: "Documentos listos",
    desc: "Certificados, escrituras y avalúo para cerrar sin sorpresas.",
  },
  {
    icon: FileText,
    title: "Guía para vender",
    desc: "Pasos claros para vender en Bogotá y Barranquilla con confianza.",
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
    q: "¿Puedo vender y arrendar al mismo tiempo?",
    a: "Sí. Indica el tipo de operación al registrar tu inmueble y te asesoramos según tu objetivo.",
  },
  {
    q: "¿En qué ciudades operan?",
    a: "Bogotá y Barranquilla, con cobertura en las principales zonas residenciales.",
  },
  {
    q: "¿Qué es un listado verificado?",
    a: "Revisamos datos, fotos y documentación básica antes de activar tu anuncio. Los compradores ven el sello de confianza MatchColombia.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-bold text-sm sm:text-base text-foreground pr-4">{q}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </div>
  );
}

function AddressHero() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bogotá");

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (address.trim()) params.set("neighborhood", address.trim());
    if (city) params.set("city", city);
    navigate(`/publicar/nuevo${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 p-1.5 sm:p-2 bg-white rounded-2xl sm:rounded-full border border-border/60 shadow-lg shadow-black/[0.04]">
        <div className="relative flex-1 flex items-center">
          <MapPin className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Barrio o dirección de tu inmueble"
            className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-full bg-transparent text-sm font-semibold placeholder:text-muted-foreground/70 focus:outline-none"
          />
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="sm:w-40 px-4 py-3.5 sm:py-4 rounded-xl sm:rounded-full bg-secondary/80 sm:bg-transparent text-sm font-bold border-0 focus:outline-none focus:ring-0 cursor-pointer"
        >
          {CITIES.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="gradient-cta text-white font-bold px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-full hover:opacity-95 transition-opacity text-sm whitespace-nowrap"
        >
          Comenzar
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Gratis · Sin compromiso · Bogotá y Barranquilla
      </p>
    </form>
  );
}

export default function Sell() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* Hero — estilo Zillow: limpio, centrado, CTA con dirección */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24 bg-[hsl(210,25%,98%)] border-b border-border/40">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(265,75%,58%)]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(340,82%,52%)]/5 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-widest text-[hsl(265,75%,50%)] mb-4">
              Vender en Colombia
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold text-foreground leading-[1.1] tracking-tight">
              Vende tu inmueble con{" "}
              <span className="text-gradient">confianza</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Te damos opciones claras para vender en Bogotá y Barranquilla — con la flexibilidad de elegir el camino que mejor se adapte a tu situación y tus tiempos.
            </p>
            <AddressHero />
          </motion.div>
        </div>
      </section>

      {/* Opción principal — "Sell with partner agent" */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(265,75%,58%)]/10 text-[hsl(265,75%,45%)] text-xs font-bold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Recomendado
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Vende con {BRAND.name}
              </h2>
              <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                Nuestro equipo verifica tu inmueble, lo promociona a compradores calificados y gestiona consultas y visitas. Listados verificados con mayor exposición — sin que tú atiendas cada mensaje.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Listado verificado con sello de confianza",
                  "Gestión de consultas y visitas por nuestro equipo",
                  "Compradores filtrados según tu inmueble",
                  "Seguimiento claro hasta cerrar la operación",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-semibold text-foreground/90">
                    <BadgeCheck className="w-5 h-5 text-[hsl(168,72%,40%)] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/publicar/nuevo"
                className="inline-flex items-center gap-2 mt-8 gradient-cta text-white font-bold px-7 py-3.5 rounded-xl hover:opacity-95 transition-opacity"
              >
                Empezar con {BRAND.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 aspect-[4/3]">
                <img src={INTERIORS.casa} alt="Inmueble en venta" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {SHOWCASE_STATS.map(({ value, label }) => (
                      <div key={label} className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm">
                        <p className="text-lg font-extrabold text-foreground">{value}</p>
                        <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-white text-sm font-semibold drop-shadow">
                    Listados verificados · Mayor visibilidad en tu zona
                  </p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 sm:-right-6 w-20 h-20 rounded-2xl gradient-cta flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-9 h-9 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Más opciones — grid de 3 tarjetas */}
      <section className="py-16 sm:py-20 bg-[hsl(240,40%,98%)] border-y border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Explora más opciones</h2>
            <p className="mt-3 text-muted-foreground">
              Vende a tu manera. Elige el camino que mejor se adapte a tus necesidades.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            {SELL_OPTIONS.map(({ icon: Icon, title, desc, cta, to, href, external }, i) => {
              const card = (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group flex flex-col h-full bg-white rounded-2xl border border-border/50 p-6 sm:p-7 card-hover"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[hsl(265,75%,58%)]/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[hsl(265,75%,50%)]" />
                  </div>
                  <h3 className="font-extrabold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
                  <span className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold text-[hsl(265,75%,50%)] group-hover:gap-2.5 transition-all">
                    {cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.article>
              );

              if (external && href) {
                return (
                  <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {card}
                  </a>
                );
              }
              return (
                <Link key={title} to={to} className="block h-full">
                  {card}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Showcase — listados premium */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl overflow-hidden bg-[hsl(265,35%,22%)] text-white grid lg:grid-cols-2">
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[hsl(340,82%,60%)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Listados premium</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Destaca tu inmueble con verificación MatchColombia
              </h2>
              <p className="mt-4 text-white/75 text-sm sm:text-base leading-relaxed">
                Fotos organizadas, datos verificados y mayor exposición frente a compradores que buscan en tu zona. Diseñado para que tu propiedad se vea profesional desde el primer clic.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {[
                  { icon: Camera, label: "Fotos profesionales" },
                  { icon: Users, label: "Compradores filtrados" },
                  { icon: Building2, label: "Mapa interactivo" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm font-semibold text-white/90">
                    <Icon className="w-4 h-4 text-[hsl(168,72%,55%)]" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[280px] lg:min-h-full">
              <img src={CITIES_IMG.skyline} alt="Bogotá" className="absolute inset-0 w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(265,35%,22%)] via-transparent to-transparent lg:bg-gradient-to-l" />
            </div>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section className="py-16 sm:py-20 bg-[hsl(240,40%,98%)] border-y border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Recursos para una venta exitosa</h2>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Herramientas y guías para vender al mejor precio en Colombia.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {RESOURCES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-border/50 p-5 sm:p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[hsl(265,75%,50%)]" />
                </div>
                <h3 className="font-extrabold text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-14 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Preguntas frecuentes</h2>
            <p className="mt-3 text-muted-foreground">
              Todo lo que necesitas saber antes de vender con {BRAND.name}.
            </p>
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, tengo una pregunta sobre vender mi inmueble")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-[hsl(265,75%,50%)] hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              ¿Más dudas? Escríbenos
            </a>
          </div>
          <div className="bg-[hsl(240,40%,98%)] rounded-2xl border border-border/50 px-5 sm:px-7">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 sm:py-20 bg-[hsl(210,25%,98%)] border-t border-border/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Encuentra tu camino ideal en minutos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ingresa la ubicación de tu inmueble y te guiamos al mejor proceso de venta.
          </p>
          <div className="mt-8">
            <AddressHero />
          </div>
        </div>
      </section>
    </div>
  );
}
