import React from "react";

const STEPS = [
  { emoji: "📸", title: "Fotografía profesional" },
  { emoji: "📢", title: "Publicación" },
  { emoji: "👥", title: "Gestión de visitas" },
  { emoji: "🔎", title: "Estudio de arrendatario" },
  { emoji: "✍️", title: "Firma digital" },
  { emoji: "💰", title: "Cobro mensual" },
  { emoji: "🔧", title: "Gestión de mantenimiento" },
  { emoji: "📊", title: "Seguimiento en tiempo real" },
];

export default function AdminFlowSection() {
  return (
    <section className="py-10 sm:py-14 bg-[hsl(0,0%,98%)] border-y border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="border-l-4 border-brand-magenta pl-4 sm:pl-5 mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Así administramos tu inmueble
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            Un proceso claro de principio a fin. Tú publicas, nosotros ejecutamos cada paso.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative p-4 sm:p-5 rounded-2xl bg-white border border-border/40 text-center"
            >
              <span className="absolute top-2 left-2 text-[10px] font-extrabold text-muted-foreground/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-2xl sm:text-3xl block mb-2" role="img" aria-hidden>
                {step.emoji}
              </span>
              <p className="text-xs sm:text-sm font-bold leading-snug">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
