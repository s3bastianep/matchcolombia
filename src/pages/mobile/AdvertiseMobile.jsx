import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Check, MessageCircle, Phone } from "lucide-react";
import { BRAND } from "@/lib/brand";
import VerifiedBadge from "@/components/brand/VerifiedBadge";

const BENEFITS = [
  "Publicación verificada",
  "Gestión de visitas",
  "Contratos digitales",
  "Cobro de cánones",
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
