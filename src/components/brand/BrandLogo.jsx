import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import BrandMark from "./BrandMark";

export default function BrandLogo({ className, size = "md", link = true }) {
  const sizes = {
    sm: { box: "w-8 h-8 rounded-xl", mark: "w-[1.35rem] h-[1.35rem]", text: "text-sm" },
    md: { box: "w-9 h-9 rounded-xl", mark: "w-6 h-6", text: "text-base" },
    lg: { box: "w-11 h-11 rounded-2xl", mark: "w-7 h-7", text: "text-lg" },
  };
  const s = sizes[size] || sizes.md;

  const content = (
    <div className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <div className={cn(s.box, "gradient-cta flex items-center justify-center shadow-md shadow-brand-violet/25 text-white")}>
        <BrandMark className={s.mark} />
      </div>
      <span className={cn("font-extrabold leading-tight tracking-tight", s.text)}>
        <span className="text-gradient">LUMORA</span>
        <span className="text-foreground"> HOME</span>
      </span>
    </div>
  );

  if (!link) return content;
  return <Link to="/">{content}</Link>;
}
