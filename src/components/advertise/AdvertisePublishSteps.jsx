import React from "react";
import { FileText, Camera, Heart, Info } from "lucide-react";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { ADVERTISE_PUBLISH_STEPS_TITLE } from "@/lib/siteCopy";
import ExpertVisitsDialog from "@/components/advertise/ExpertVisitsDialog";

const STEPS = [
  {
    icon: FileText,
    title: "Registra tus datos y la información de tu propiedad en menos de 10 minutos.",
    desc: "El anuncio es totalmente gratuito.",
  },
  {
    icon: Camera,
    title: "Coordinamos fotografías profesionales de tu inmueble.",
    desc: "Imágenes bien tomadas aumentan el valor percibido y atraen más interesados.",
  },
  {
    icon: Heart,
    title: "¡Listo! Tu propiedad queda preparada para recibir visitas y ofertas.",
    desc: "Acompañamos a los interesados para que visiten con claridad y sin fricción.",
    expertLink: true,
  },
];

export default function AdvertisePublishSteps() {
  return (
    <section id="como-publicar" className="py-10 sm:py-14 bg-white border-b border-border/40 scroll-mt-24">
      <div className="site-container max-w-3xl">
        <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-extrabold tracking-tight text-foreground leading-snug mb-8 sm:mb-10">
          {ADVERTISE_PUBLISH_STEPS_TITLE.replace("HABIBAR", BRAND.name)}
        </h2>

        <ol className="space-y-8 sm:space-y-10">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-4 sm:gap-5"
              >
                <span className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary flex items-center justify-center">
                  <Icon className="size-5 sm:size-6 text-foreground/70" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-extrabold text-sm sm:text-base text-foreground leading-snug">{step.title}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  {step.expertLink && (
                    <ExpertVisitsDialog>
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-brand-violet hover:underline"
                      >
                        <Info className="size-3.5" />
                        ¿Quién acompaña las visitas?
                      </button>
                    </ExpertVisitsDialog>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
