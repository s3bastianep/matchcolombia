import React from "react";
import { motion } from "framer-motion";
import { Check, Shield } from "lucide-react";

const SAFEGUARDS = [
  {
    title: "Verificación documental",
    desc: "Revisamos escrituras, certificados y datos del inmueble antes de publicar.",
  },
  {
    title: "Validación de identidad",
    desc: "Confirmamos quién es cada interesado antes de avanzar en el proceso.",
  },
  {
    title: "Estudio de arrendatarios",
    desc: "Evaluamos ingresos, referencias y historial antes de presentarte candidatos.",
  },
  {
    title: "Contratos digitales",
    desc: "Acuerdos firmados y archivados, sin papeles sueltos ni versiones perdidas.",
  },
  {
    title: "Historial centralizado",
    desc: "Pagos, contratos, tickets y comunicaciones en un solo registro trazable.",
  },
];

const FEARS = ["Morosos", "Daños", "Fraudes"];

export default function OwnerSecuritySection() {
  return (
    <section className="py-10 sm:py-14 bg-[hsl(0,0%,98%)] border-y border-border/40">
      <div className="site-container">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-12 items-start">
          <div className="border-l-4 border-brand-magenta pl-4 sm:pl-5">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-brand-magenta mb-2">
              Seguridad
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Cómo protegemos tu inmueble
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
              Sabemos que un propietario piensa en lo que puede salir mal. Por eso cada arriendo pasa por controles
              reales, no solo por un anuncio publicado.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {FEARS.map((fear) => (
                <span
                  key={fear}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-border/50 text-muted-foreground"
                >
                  <Shield className="w-3 h-3 text-brand-violet" />
                  {fear}
                </span>
              ))}
            </div>
          </div>

          <ul className="space-y-3">
            {SAFEGUARDS.map(({ title, desc }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-border/40"
              >
                <span className="w-8 h-8 rounded-lg bg-brand-violet/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-brand-violet" strokeWidth={2.5} />
                </span>
                <div>
                  <p className="text-sm sm:text-base font-extrabold text-foreground">{title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
