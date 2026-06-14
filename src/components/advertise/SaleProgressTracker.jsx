import React from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Publicado", status: "done" },
  { label: "Compradores interesados", status: "done" },
  { label: "Visitas programadas", status: "done" },
  { label: "Negociación", status: "active" },
  { label: "Cierre", status: "pending" },
];

function StatusDot({ status }) {
  return (
    <span
      className={cn(
        "w-3 h-3 rounded-full shrink-0 ring-4",
        status === "done" && "bg-[hsl(152,55%,42%)] ring-[hsl(152,55%,42%)]/15",
        status === "active" && "bg-brand-magenta ring-brand-magenta/15",
        status === "pending" && "bg-border ring-border/30"
      )}
      aria-hidden
    />
  );
}

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

        <div className="rounded-2xl border border-border/40 bg-[hsl(0,0%,98%)] p-5 sm:p-8 overflow-x-auto">
          <div className="flex min-w-[640px] sm:min-w-0 items-start justify-between gap-2">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex flex-1 flex-col items-center text-center relative">
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-[0.35rem] left-[calc(50%+0.5rem)] right-[calc(-50%+0.5rem)] h-px",
                      step.status === "pending" ? "bg-border/50" : "bg-brand-violet/25"
                    )}
                    aria-hidden
                  />
                )}
                <StatusDot status={step.status} />
                <p
                  className={cn(
                    "mt-3 text-xs sm:text-sm font-bold leading-snug max-w-[7rem]",
                    step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {step.label}
                </p>
                {step.status === "active" && (
                  <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                    En curso
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
