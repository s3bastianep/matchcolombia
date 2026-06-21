import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, MessageCircle, BarChart3 } from "lucide-react";
import { BRAND } from "@/lib/brand";
import VerifiedBadge from "@/components/brand/VerifiedBadge";

const PERKS = [
  "Publicación profesional con fotos",
  "Coordinamos visitas y ofertas",
  "Seguimiento en tiempo real",
  "Negociación asistida",
];

export default function SellMobile() {
  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, quiero vender mi inmueble con HABIBAR")}`;

  return (
    <div className="native-screen">
      <section className="px-4 pt-5 pb-4">
        <div className="rounded-3xl bg-brand-dark p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-brand-magenta/15 blur-3xl" />
          <TrendingUp className="w-8 h-8 text-brand-magenta mb-3 relative" />
          <h1 className="text-xl font-extrabold leading-tight relative">Vende tu inmueble</h1>
          <p className="text-sm text-white/75 mt-2 leading-relaxed relative">
            Publicamos, mostramos y negociamos mientras tú sigues el proceso desde tu panel.
          </p>
          <VerifiedBadge size="sm" className="mt-3 relative" />
        </div>
      </section>

      <section className="px-4 space-y-2">
        {PERKS.map((item) => (
          <div key={item} className="app-card-flat flex items-center gap-3 px-4 py-3.5">
            <BarChart3 className="w-4 h-4 text-brand-violet/70 shrink-0" />
            <span className="text-sm font-semibold">{item}</span>
          </div>
        ))}
      </section>

      <section className="px-4 pt-6 space-y-3">
        <Link to="/publicar/nuevo" className="app-btn-primary flex items-center justify-center gap-2 w-full py-4">
          Empezar publicación
          <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="app-btn-secondary flex items-center justify-center gap-2 w-full py-4 text-sm"
        >
          <MessageCircle className="w-4 h-4 text-[#128C7E]" />
          Consultar por WhatsApp
        </a>
      </section>

      <section className="px-4 pt-6 pb-6">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          También puedes <Link to="/anunciar" className="font-bold text-brand-violet">anunciar en arriendo</Link> con gestión completa.
        </p>
      </section>
    </div>
  );
}
