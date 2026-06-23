import React from "react";
import {
  Camera,
  Megaphone,
  Users,
  Search,
  FilePenLine,
  Banknote,
  Wrench,
  LineChart,
  ShieldCheck,
  Clock,
  Smartphone,
} from "lucide-react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Inquilinos verificados", desc: "Menos riesgo, más tranquilidad" },
  { icon: Clock, label: "Canon a tiempo", desc: "Seguimiento de cada pago" },
  { icon: Smartphone, label: "Panel en tu celular", desc: "Todo visible, sin llamadas" },
];

const STEPS = [
  {
    icon: Camera,
    title: "Fotografía profesional",
    desc: "Sesión y edición de imágenes que destacan lo mejor de tu inmueble.",
    benefit: "Más visitas y mejor primera impresión online.",
  },
  {
    icon: Megaphone,
    title: "Publicación verificada",
    desc: `Listado revisado y visible en ${BRAND.name} con datos reales.`,
    benefit: "Llegas a interesados serios, no solo curiosos.",
  },
  {
    icon: Users,
    title: "Gestión de visitas",
    desc: "Coordinamos horarios, confirmaciones y asistencia en sitio.",
    benefit: "No atiendes llamadas ni persigues a desconocidos.",
  },
  {
    icon: Search,
    title: "Estudio de arrendatario",
    desc: "Revisión documental y evaluación del candidato antes de firmar.",
    benefit: "Arriendas con respaldo, no a ciegas.",
  },
  {
    icon: FilePenLine,
    title: "Firma digital",
    desc: "Contrato claro, firmado en línea y archivado.",
    benefit: "Sin papeles perdidos ni idas al notario innecesarias.",
  },
  {
    icon: Banknote,
    title: "Cobro mensual",
    desc: "Seguimiento de cada canon y reporte de pagos.",
    benefit: "Recibes tu dinero con orden y constancia.",
  },
  {
    icon: Wrench,
    title: "Mantenimiento",
    desc: "Tickets con trazabilidad para arreglos y proveedores.",
    benefit: "Problemas resueltos sin que tú seas el intermediario.",
  },
  {
    icon: LineChart,
    title: "Seguimiento en tiempo real",
    desc: "Estado del arriendo, pagos e interesados en un solo lugar.",
    benefit: "Control total desde tu panel, cuando quieras.",
  },
];

export default function AdminFlowSection() {
  return (
    <section className="py-10 sm:py-14 bg-[hsl(0,0%,98%)] border-y border-border/40">
      <div className="site-container">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-magenta mb-2">
            Beneficios para ti
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Lo que ganas al confiarnos tu inmueble
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Publica gratis. Nosotros nos encargamos del proceso completo. Tú ganas tiempo, orden y tranquilidad en cada etapa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 sm:mb-10">
          {HIGHLIGHTS.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-brand-violet/15 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-violet/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand-violet" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground leading-snug">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative">
          <div
            className="hidden lg:block absolute top-[1.65rem] left-[6%] right-[6%] h-px bg-gradient-to-r from-brand-violet/15 via-brand-magenta/25 to-brand-violet/15"
            aria-hidden
          />

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="group relative flex flex-col p-4 sm:p-5 rounded-2xl bg-white border border-border/40 hover:border-brand-violet/25 hover:shadow-md transition-all"
                >
                  <div className="flex gap-3.5 sm:flex-col sm:items-start">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[hsl(0,0%,98%)] border border-border/50 flex items-center justify-center group-hover:border-brand-violet/30 transition-colors">
                        <Icon className="w-5 h-5 text-brand-violet" strokeWidth={2} />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 rounded-full bg-brand-dark text-white text-[10px] font-extrabold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta mb-1">
                        Paso {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="text-sm font-extrabold leading-snug text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "mt-3 pt-3 border-t border-border/30 text-xs leading-relaxed",
                      i % 2 === 0 ? "text-brand-violet" : "text-brand-magenta"
                    )}
                  >
                    <span className="font-extrabold">Tu beneficio: </span>
                    <span className="font-semibold text-foreground/90">{step.benefit}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
