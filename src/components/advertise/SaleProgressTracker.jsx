import React from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Publicado", status: "done" },
  { label: "Compradores interesados", status: "done" },
  { label: "Visitas programadas", status: "done" },
  { label: "Negociación", status: "active" },
  { label: "Cierre", status: "pending" },
];

const DOT = {
  done: "🟢",
  active: "🟡",
  pending: "⚪",
};

export default function SaleProgressTracker() {
  return (
    <section className="py-10 sm:py-14 bg-white border-y border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="border-l-4 border-brand-magenta pl-4 sm:pl-5 mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Así sigue tu venta paso a paso
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            Transparencia total: sabes en qué etapa está tu inmueble sin llamar a nadie.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-[hsl(0,0%,98%)] p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex sm:flex-1 items-center gap-3 sm:flex-col sm:text-center sm:gap-2">
                <div className="flex items-center gap-3 sm:flex-col sm:gap-2 w-full sm:w-auto">
                  <span className="text-xl shrink-0" role="img" aria-hidden>{DOT[step.status]}</span>
                  <p className={cn(
                    "text-sm font-bold leading-snug",
                    step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {step.label}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block flex-1 h-px bg-border/60 mx-2 mt-[-1.5rem]" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
