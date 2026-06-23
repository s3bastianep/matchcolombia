import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Check, MessageCircle, MapPin } from "lucide-react";
import { BRAND } from "@/lib/brand";
import {
  OWNER_PERKS,
  OWNER_PROMO_BODY,
  OWNER_PROMO_TITLE,
  OWNER_WHATSAPP_BODY,
  OWNER_WHATSAPP_TITLE,
} from "@/lib/siteCopy";
import { INTERIORS } from "@/lib/colombiaImages";

const ownerWaHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
  `Hola, quiero publicar mi inmueble con ${BRAND.name}`
)}`;

export default function OwnerCTA() {
  return (
    <section className="section-pad bg-background border-b border-border/40">
      <div className="site-container">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
            className="relative rounded-3xl overflow-hidden border border-border/50 bg-white shadow-sm card-hover order-2 lg:order-1"
          >
            <div className="relative h-52 sm:h-60 lg:h-72">
              <img
                src={INTERIORS.conjunto}
                alt="Conjunto residencial en Bogotá"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-magenta to-brand-violet" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1 text-white text-[10px] font-bold drop-shadow">
                  <MapPin className="size-3" />
                  Bogotá
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-foreground shadow-sm">
                  Publicación gratis
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <p className="text-eyebrow mb-3">Propietarios</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              {OWNER_PROMO_TITLE}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              {OWNER_PROMO_BODY}
            </p>

            <ul className="mt-6 grid sm:grid-cols-2 gap-2.5 max-w-lg">
              {OWNER_PERKS.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-[hsl(0,0%,99%)] px-3.5 py-3"
                >
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-brand-violet/10 text-brand-violet">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-foreground/85 leading-snug">{perk}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                to="/anunciar"
                className="inline-flex items-center justify-center gap-2 gradient-cta text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md hover:opacity-95 transition-opacity"
              >
                <Building2 className="size-4" strokeWidth={2.25} />
                Registra tu inmueble
              </Link>
              <Link
                to="/anunciar#como-publicar"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-violet hover:underline group"
              >
                Ver cómo publicar
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="mt-6 max-w-lg rounded-2xl border border-border/50 bg-white p-4 sm:p-5 shadow-sm">
              <h3 className="font-extrabold text-sm text-foreground">{OWNER_WHATSAPP_TITLE}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {OWNER_WHATSAPP_BODY}
              </p>
              <a
                href={ownerWaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-sm font-bold text-brand-violet hover:underline group"
              >
                <MessageCircle className="size-4" />
                Escribir por WhatsApp
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
