import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { ADVERTISE_EXPERT_CTA_BODY, ADVERTISE_EXPERT_CTA_TITLE } from "@/lib/siteCopy";

const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
  `Hola, quiero publicar mi inmueble con ${BRAND.name}`
)}`;

export default function AdvertiseExpertCta() {
  return (
    <section className="py-10 sm:py-12 bg-[hsl(0,0%,98%)] border-y border-border/40">
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-brand-dark text-white p-6 sm:p-8 lg:p-10 max-w-3xl"
        >
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{ADVERTISE_EXPERT_CTA_TITLE}</h2>
          <p className="mt-2 text-sm sm:text-base text-white/75 leading-relaxed max-w-lg">
            {ADVERTISE_EXPERT_CTA_BODY}
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 bg-white/15 hover:bg-white/20 text-white font-bold text-sm px-6 py-3 rounded-full transition-colors"
          >
            <MessageCircle className="size-4" strokeWidth={2.25} />
            Anúnciate vía WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
