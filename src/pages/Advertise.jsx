import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Building2,
  Phone,
  Mail,
  User,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import OwnerDashboardScreen from "@/components/advertise/OwnerDashboardScreen";
import TenantPortalScreen from "@/components/advertise/TenantPortalScreen";
import AdminFlowSection from "@/components/advertise/AdminFlowSection";
import TraditionalVsMatch from "@/components/advertise/TraditionalVsMatch";
import AboutFounderSection from "@/components/advertise/AboutFounderSection";
import OwnerSecuritySection from "@/components/advertise/OwnerSecuritySection";
import OwnerFaqSection from "@/components/advertise/OwnerFaqSection";

const VERIFIABLE = [
  { label: "Seguimiento digital", desc: "Pagos, contratos y tickets en un solo lugar." },
  { label: "Contratos digitales", desc: "Firma y consulta sin correos ni papeles perdidos." },
  { label: "Verificación documental", desc: "Inmuebles y candidatos revisados antes de avanzar." },
  { label: "Atención centralizada", desc: "Un equipo coordina todo el proceso por ti." },
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
        href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hola, quiero publicar mi inmueble con ${BRAND.name}`)}`}
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

      <section className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-brand-magenta" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Portal propietarios</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.12] tracking-tight">
                Entrega tu apartamento. Nosotros lo administramos de punta a punta.
              </h1>
              <p className="mt-4 text-white/75 text-sm sm:text-base leading-relaxed max-w-lg">
                Publica gratis y deja en nuestras manos visitas, candidatos, contratos y cobros. Tú recibes tu dinero con tranquilidad y consultas todo desde cualquier dispositivo.
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
                <a href="#panel-real" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
                  Ver cómo se ve
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
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="color-bar">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-20 text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-[2.35rem] font-extrabold leading-[1.15] tracking-tight">
            El ciclo completo de tu arrendamiento.
            <br className="hidden sm:block" />
            {" "}Una sola administración.
          </h2>
          <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
            Desde que publicamos tu apartamento hasta que el inquilino se queda: nos encargamos de visitas, selección, contratos, cobros y mantenimiento. Mejores candidatos, arriendos más rápidos e inquilinos satisfechos que renuevan. Tú entregas el inmueble; {BRAND.name} hace el resto.
          </p>
        </div>
      </section>

      <section id="panel-real" className="py-10 sm:py-14 lg:py-16 bg-white border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center">
            <OwnerSectionTitle
              badge="Tranquilidad, no tecnología"
              title="Recibe tu dinero sin preocupaciones"
              subtitle="Consulta pagos, contratos, mantenimientos e interesados desde cualquier dispositivo. Sin depender de llamadas ni mensajes sueltos."
            />
            <OwnerDashboardScreen />
          </div>
        </div>
      </section>

      <AdminFlowSection />

      <section className="color-bar">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {VERIFIABLE.map(({ label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="text-white px-1"
            >
              <p className="text-sm sm:text-base font-extrabold leading-snug">{label}</p>
              <p className="text-[10px] sm:text-xs font-medium text-white/80 mt-1.5 leading-snug">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <TraditionalVsMatch />

      <OwnerSecuritySection />

      <section className="py-10 sm:py-14 bg-white border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center">
            <OwnerSectionTitle
              badge="También para el inquilino"
              title="Un inquilino feliz renueva, cuida y paga mejor"
              subtitle="Portal del arrendatario con historial de pagos, contrato digital, solicitudes de mantenimiento y estado de tickets."
            />
            <TenantPortalScreen />
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-start">
            <OwnerSectionTitle
              title={`Administración ${BRAND.name}`}
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

      <AboutFounderSection />

      <OwnerFaqSection />

      <section id="publicar-form" className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14 lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <OwnerSectionTitle
              light
              title="¿Listo para arrendar sin estrés?"
              subtitle={`Completa tus datos y deja que ${BRAND.name} gestione tu propiedad. Nosotros atendemos a los interesados. Tú recibes tranquilidad.`}
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
            <p className="text-sm text-white/60 mb-5">Publicación y administración incluidas</p>
            <LeadForm dark />
          </div>
        </div>
      </section>
    </div>
  );
}
