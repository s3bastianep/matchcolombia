import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const PROCESS_STEPS = [
  { key: "solicitud", label: "Solicitud enviada" },
  { key: "revision", label: "En revisión" },
  { key: "visita", label: "Visita agendada" },
  { key: "aprobado", label: "Aprobado" },
];

export default function ProcessStepper({ currentStep = "visita", compact = false, prominent = false, preview = false }) {
  const currentIdx = preview ? -1 : PROCESS_STEPS.findIndex((s) => s.key === currentStep);
  const isProminent = prominent || !compact;

  const circleSize = isProminent ? "w-10 h-10" : "w-7 h-7";
  const numberSize = isProminent ? "text-sm" : "text-[10px]";
  const labelSize = isProminent
    ? "text-[11px] sm:text-xs leading-snug"
    : compact
      ? "text-[9px]"
      : "text-[10px] sm:text-xs";

  return (
    <div className={cn("w-full", isProminent ? "mt-2" : compact ? "mt-4" : "mt-6")}>
      <div className="flex items-start justify-between gap-0.5 sm:gap-1">
        {PROCESS_STEPS.map((step, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          const pending = !done && !active;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center min-w-0">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={cn(
                      "h-0.5 sm:h-1 flex-1 -mr-0.5",
                      done || active
                        ? "bg-[hsl(var(--brand-violet))]"
                        : preview
                          ? "bg-[hsl(var(--brand-violet)/0.35)]"
                          : "bg-border"
                    )}
                  />
                )}
                <div
                  className={cn(
                    circleSize,
                    "rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
                    done && "bg-[hsl(var(--brand-violet))] border-[hsl(var(--brand-violet))] text-white",
                    active && "bg-[hsl(var(--brand-violet))] border-[hsl(var(--brand-violet))] text-white ring-4 ring-[hsl(var(--brand-violet)/0.2)]",
                    pending && !preview && "bg-white border-border text-muted-foreground",
                    pending && preview && "bg-[hsl(var(--brand-violet)/0.08)] border-[hsl(var(--brand-violet)/0.55)] text-brand-violet"
                  )}
                >
                  {done ? (
                    <Check className={isProminent ? "w-4 h-4" : "w-3.5 h-3.5"} strokeWidth={3} />
                  ) : (
                    <span className={cn(numberSize, "font-bold tabular-nums")}>{i + 1}</span>
                  )}
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 sm:h-1 flex-1 -ml-0.5",
                      done
                        ? "bg-[hsl(var(--brand-violet))]"
                        : preview
                          ? "bg-[hsl(var(--brand-violet)/0.35)]"
                          : "bg-border"
                    )}
                  />
                )}
              </div>
              <p
                className={cn(
                  "text-center mt-2.5 px-0.5",
                  labelSize,
                  active && "font-bold text-brand-violet",
                  done && "font-semibold text-foreground/75",
                  pending && preview && "font-semibold text-foreground/80",
                  pending && !preview && "text-subtle font-medium"
                )}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
