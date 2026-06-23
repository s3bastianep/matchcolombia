import React from "react";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HUMAN_SUPPORT_BADGE,
  HUMAN_SUPPORT_BODY,
  HUMAN_SUPPORT_SHORT,
  HUMAN_SUPPORT_TITLE,
} from "@/lib/siteCopy";

export default function HumanSupportBanner({ variant = "default", className }) {
  if (variant === "compact") {
    return (
      <p
        className={cn(
          "flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed",
          className
        )}
      >
        <UserRound className="size-3.5 text-brand-violet shrink-0 mt-0.5" strokeWidth={2.25} />
        <span>{HUMAN_SUPPORT_SHORT}</span>
      </p>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-violet/15 bg-gradient-to-r from-brand-violet/[0.07] to-brand-magenta/[0.04] p-4 flex gap-3",
        className
      )}
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-brand-violet/10">
        <UserRound className="size-5 text-brand-violet" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-extrabold text-foreground leading-tight">{HUMAN_SUPPORT_TITLE}</p>
          <span className="inline-flex items-center rounded-full bg-brand-violet/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-violet">
            {HUMAN_SUPPORT_BADGE}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{HUMAN_SUPPORT_BODY}</p>
      </div>
    </div>
  );
}
