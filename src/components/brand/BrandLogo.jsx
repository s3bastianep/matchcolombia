import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

export default function BrandLogo({ className, size = "md", link = true, variant = "color" }) {
  const onDark = variant === "onDark";

  const sizes = {
    sm: {
      primary: "text-[1.05rem]",
      secondary: "text-[0.48rem] tracking-[0.38em]",
      gap: "gap-0.5",
    },
    md: {
      primary: "text-[1.25rem]",
      secondary: "text-[0.52rem] tracking-[0.4em]",
      gap: "gap-0.5",
    },
    lg: {
      primary: "text-[1.55rem]",
      secondary: "text-[0.58rem] tracking-[0.42em]",
      gap: "gap-1",
    },
  };
  const s = sizes[size] || sizes.md;

  const content = (
    <div className={cn("group flex flex-col items-start leading-none shrink-0", s.gap, className)}>
      <span
        className={cn(
          "font-bold lowercase tracking-tight transition-opacity group-hover:opacity-85",
          s.primary,
          onDark ? "text-white" : "text-[hsl(230,28%,14%)]"
        )}
      >
        lumora
      </span>
      <span
        className={cn(
          "font-bold uppercase pl-0.5",
          s.secondary,
          onDark ? "text-[hsl(210,90%,72%)]" : "text-[hsl(220,85%,58%)]"
        )}
      >
        HOME
      </span>
    </div>
  );

  if (!link) return content;
  return <Link to="/" aria-label={`${BRAND.name} inicio`}>{content}</Link>;
}
