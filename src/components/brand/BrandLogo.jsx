import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import BrandMark from "./BrandMark";

export default function BrandLogo({ className, size = "md", link = true, variant = "color" }) {
  const onDark = variant === "onDark";

  const sizes = {
    sm: { mark: "w-7 h-7", text: "text-sm", gap: "gap-2" },
    md: { mark: "w-8 h-8", text: "text-base", gap: "gap-2.5" },
    lg: { mark: "w-10 h-10", text: "text-lg", gap: "gap-3" },
  };
  const s = sizes[size] || sizes.md;

  const content = (
    <div className={cn("group flex items-center shrink-0", s.gap, className)}>
      <BrandMark
        variant={variant}
        className={cn(s.mark, "transition-transform duration-300 group-hover:-translate-y-0.5")}
      />
      <span className={cn("font-extrabold leading-tight tracking-tight", s.text)}>
        <span className={onDark ? "text-white" : "text-gradient"}>LUMORA</span>
        <span className={onDark ? "text-white/90" : "text-foreground"}> HOME</span>
      </span>
    </div>
  );

  if (!link) return content;
  return <Link to="/" aria-label={`${BRAND.name} inicio`}>{content}</Link>;
}
