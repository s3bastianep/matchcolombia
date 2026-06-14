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
} from "lucide-react";
const STEPS = [
  { icon: Camera, title: "Fotografía profesional", desc: "Imágenes que destacan tu inmueble." },
  { icon: Megaphone, title: "Publicación", desc: "Listado verificado en MatchColombia." },
  { icon: Users, title: "Gestión de visitas", desc: "Coordinamos horarios y confirmaciones." },
  { icon: Search, title: "Estudio de arrendatario", desc: "Evaluación documental del candidato." },
  { icon: FilePenLine, title: "Firma digital", desc: "Contrato sin papeles ni correos." },
  { icon: Banknote, title: "Cobro mensual", desc: "Seguimiento de cada canon." },
  { icon: Wrench, title: "Gestión de mantenimiento", desc: "Tickets con trazabilidad clara." },
  { icon: LineChart, title: "Seguimiento en tiempo real", desc: "Todo visible en tu panel." },
];

export default function AdminFlowSection() {
  return (
    <section className="py-10 sm:py-14 bg-white border-y border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="border-l-4 border-brand-magenta pl-4 sm:pl-5 mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Así administramos tu inmueble
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            Un proceso claro de principio a fin. Tú publicas, nosotros ejecutamos cada paso.
          </p>
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
                  className="group relative flex gap-3.5 sm:flex-col sm:items-start p-4 sm:p-5 rounded-2xl bg-[hsl(0,0%,98%)] border border-border/40 hover:border-brand-violet/25 hover:shadow-sm transition-all"
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-border/50 shadow-sm flex items-center justify-center group-hover:border-brand-violet/30 transition-colors">
                      <Icon className="w-5 h-5 text-brand-violet" strokeWidth={2} />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 rounded-full bg-brand-dark text-white text-[10px] font-extrabold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0 pt-0.5 sm:pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta mb-1">
                      Paso {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="text-sm font-extrabold leading-snug text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed hidden sm:block">{step.desc}</p>
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
