import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import BrandMark from "./BrandMark";
import { applySiteFavicon, getSiteBranding, subscribeSiteBranding } from "@/lib/siteBranding";

export default function BrandLogo({ className, size = "md", link = true, variant = "color" }) {
  const onDark = variant === "onDark";
  const [logoUrl, setLogoUrl] = useState(() => getSiteBranding().logoUrl);

  useEffect(() => {
    return subscribeSiteBranding(() => {
      const next = getSiteBranding().logoUrl;
      setLogoUrl(next);
      applySiteFavicon(next);
    });
  }, []);

  useEffect(() => {
    applySiteFavicon(logoUrl);
  }, [logoUrl]);

  const sizes = {
    sm: { mark: "w-7 h-7", text: "text-sm", gap: "gap-2", custom: "h-7" },
    md: { mark: "w-8 h-8", text: "text-base", gap: "gap-2.5", custom: "h-8" },
    lg: { mark: "w-10 h-10", text: "text-lg", gap: "gap-3", custom: "h-10" },
  };
  const s = sizes[size] || sizes.md;

  const content = logoUrl ? (
    <div className={cn("shrink-0", className)}>
      <img
        src={logoUrl}
        alt={BRAND.name}
        className={cn("w-auto max-w-[180px] object-contain object-left", s.custom)}
      />
    </div>
  ) : (
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
