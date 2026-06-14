import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function BrandLogo({ className, size = "md", link = true }) {
  const sizes = {
    sm: { box: "w-8 h-8 rounded-xl", icon: "text-sm", text: "text-base" },
    md: { box: "w-9 h-9 rounded-xl", icon: "text-sm", text: "text-lg" },
    lg: { box: "w-11 h-11 rounded-2xl", icon: "text-base", text: "text-xl" },
  };
  const s = sizes[size] || sizes.md;

  const content = (
    <div className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <div className={cn(s.box, "gradient-cta flex items-center justify-center shadow-md shadow-brand-violet/25")}>
        <span className={cn("font-extrabold text-white leading-none", s.icon)}>M</span>
      </div>
      <span className={cn("font-extrabold text-foreground leading-none", s.text)}>
        <span className="text-gradient">Match</span>Colombia
      </span>
    </div>
  );

  if (!link) return content;
  return <Link to="/">{content}</Link>;
}
