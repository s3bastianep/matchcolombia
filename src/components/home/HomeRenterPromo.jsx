import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound, MapPin } from "lucide-react";
import { INTERIORS } from "@/lib/colombiaImages";
import { RENTER_PROMO_BODY, RENTER_PROMO_TITLE } from "@/lib/siteCopy";
import { BRAND } from "@/lib/brand";
import VerifiedBadge from "@/components/brand/VerifiedBadge";

export default function HomeRenterPromo() {
  return (
    <section className="section-pad section-pad-tight-top bg-background border-b border-border/40">
      <div className="site-container">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-8 lg:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-eyebrow mb-3">Para quien busca arriendo</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              {RENTER_PROMO_TITLE}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              {RENTER_PROMO_BODY}
            </p>
            <div className="mt-4">
              <VerifiedBadge size="sm" />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                to="/explorar"
                className="inline-flex items-center justify-center gap-2 gradient-cta text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md hover:opacity-95 transition-opacity"
              >
                <KeyRound className="size-4" strokeWidth={2.25} />
                Ver inmuebles en arriendo
              </Link>
              <Link
                to="#como-funciona"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-violet hover:underline group"
              >
                Cómo arrendar en {BRAND.name}
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="relative rounded-3xl overflow-hidden border border-border/50 bg-white shadow-sm card-hover"
          >
            <div className="relative h-52 sm:h-60 lg:h-72">
              <img
                src={INTERIORS.sala2}
                alt="Sala de apartamento en arriendo en Bogotá"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-violet to-brand-magenta" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1 text-white text-[10px] font-bold drop-shadow">
                  <MapPin className="size-3" />
                  Bogotá
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-foreground shadow-sm">
                  Verificado
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
