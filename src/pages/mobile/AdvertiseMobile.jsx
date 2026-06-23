import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Check, MessageCircle, Phone, FileText, Camera, Heart } from "lucide-react";
import { BRAND } from "@/lib/brand";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import { ADVERTISE_EXPERT_CTA_BODY, ADVERTISE_EXPERT_CTA_TITLE, ADVERTISE_FREE_SUBTITLE } from "@/lib/siteCopy";

const BENEFITS = [
  "Publicación verificada",
  "Gestión de visitas",
  "Contratos digitales",
  "Cobro de cánones",
];

const PUBLISH_STEPS = [
  { icon: FileText, text: "Registra tu inmueble en minutos. Es gratis." },
  { icon: Camera, text: "Coordinamos fotos profesionales." },
  { icon: Heart, text: "Listo para recibir visitas y ofertas." },
];

export default function AdvertiseMobile() {
  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, quiero publicar mi inmueble en HABIBAR")}`;

  return (
    <div className="native-screen">
      <section className="px-4 pt-5 pb-4">
        <div className="rounded-3xl gradient-cta p-5 text-white relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <Building2 className="w-8 h-8 mb-3 opacity-90 relative" />
          <h1 className="text-xl font-extrabold leading-tight relative">Publica tu inmueble</h1>
          <p className="text-sm text-white/80 mt-2 leading-relaxed relative">
            Arrienda o vende con verificación, visitas coordinadas y panel de seguimiento.
          </p>
          <VerifiedBadge size="sm" className="mt-3 relative" />
        </div>
      </section>

      <section className="px-4 space-y-2">
        {BENEFITS.map((item) => (
          <div key={item} className="app-card-flat flex items-center gap-3 px-4 py-3.5">
            <span className="w-8 h-8 rounded-xl bg-brand-violet/8 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-brand-violet/80" />
            </span>
            <span className="text-sm font-semibold">{item}</span>
          </div>
        ))}
      </section>

      <section className="px-4 pt-2 pb-2">
        <p className="app-section-label mb-3">Cómo publicar</p>
        <div className="space-y-2">
          {PUBLISH_STEPS.map(({ icon: Icon, text }) => (
            <div key={text} className="app-card-flat flex items-start gap-3 px-4 py-3.5">
              <span className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-foreground/70" />
              </span>
              <span className="text-sm font-medium leading-snug pt-1.5">{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-4">
        <div className="rounded-2xl bg-brand-dark text-white p-5">
          <h2 className="text-base font-extrabold">{ADVERTISE_EXPERT_CTA_TITLE}</h2>
          <p className="text-xs text-white/75 mt-2 leading-relaxed">{ADVERTISE_EXPERT_CTA_BODY}</p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-white/15 text-white font-bold text-xs px-5 py-2.5 rounded-full"
          >
            <MessageCircle className="w-4 h-4" />
            Anúnciate vía WhatsApp
          </a>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3 px-2">
          {ADVERTISE_FREE_SUBTITLE.replace(/HABIBAR/g, BRAND.name)}
        </p>
      </section>

      <section className="px-4 pt-6 space-y-3">
        <Link to="/publicar/nuevo" className="app-btn-primary flex items-center justify-center gap-2 w-full py-4">
          Registrar inmueble
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/publicar" className="app-btn-secondary flex items-center justify-center gap-2 w-full py-4 text-sm">
          Vender inmueble
        </Link>
      </section>

      <section className="px-4 pt-6 pb-4">
        <p className="app-section-label mb-3">¿Necesitas ayuda?</p>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="app-action-tile text-[#128C7E]"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-bold">WhatsApp</span>
          </a>
          <a href={`tel:${BRAND.phone}`} className="app-action-tile">
            <Phone className="w-5 h-5 text-brand-violet/80" />
            <span className="text-sm font-bold">Llamar</span>
          </a>
        </div>
      </section>
    </div>
  );
}
