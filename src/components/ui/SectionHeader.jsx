import React from "react";
import { cn } from "@/lib/utils";

export default function SectionHeader({ eyebrow, title, subtitle, className, align = "left" }) {
  return (
    <div className={cn(align === "center" && "text-center mx-auto max-w-2xl", className)}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-widest text-[hsl(265,75%,50%)] mb-2">{eyebrow}</p>
      )}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
