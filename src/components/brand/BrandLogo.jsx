import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { getSiteBranding, subscribeSiteBranding } from "@/lib/siteBranding";

/**
 * layout:
 * - lockup: wordmark horizontal (navbar, footer)
 * - icon: solo ícono H
 * - full: logo apilado o imagen personalizada del admin
 */
export default function BrandLogo({
  className,
  size = "md",
  link = true,
  variant = "color",
  layout = "lockup",
}) {
  const onDark = variant === "onDark";
  const [customLogoUrl, setCustomLogoUrl] = useState(() => getSiteBranding().logoUrl);

  useEffect(() => {
    return subscribeSiteBranding(() => {
      setCustomLogoUrl(getSiteBranding().logoUrl);
    });
  }, []);

  /* Wordmark: ancho fijo; `nav` usa altura fija para alinear con el menú */
  const sizes = {
    nav: {
      icon: "h-7 w-7",
      wordmark: "h-8 sm:h-9 w-auto max-w-[9.5rem] sm:max-w-[10.5rem] lg:max-w-[11.5rem]",
      full: "h-8 sm:h-9 w-auto",
    },
    sm: { icon: "h-10 w-10", wordmark: "h-11 w-auto max-w-[12rem] sm:max-w-[14rem]", full: "h-14 w-auto" },
    md: { icon: "h-11 w-11", wordmark: "h-12 w-auto max-w-[14rem] sm:max-w-[16rem]", full: "h-16 w-auto" },
    lg: { icon: "h-12 w-12", wordmark: "h-11 w-auto max-w-[14rem] sm:max-w-[15.5rem]", full: "h-20 w-auto" },
    xl: { icon: "h-14 w-14", wordmark: "h-12 w-auto max-w-[16rem] sm:max-w-[18rem]", full: "h-24 w-auto" },
    hero: { icon: "h-16 w-16", wordmark: "h-14 w-auto max-w-[min(90vw,20rem)]", full: "h-28 w-auto" },
  };
  const s = sizes[size] || sizes.md;

  const wordmarkSrc = customLogoUrl || BRAND.logoWordmark;
  const wordmarkSrcSet =
    !customLogoUrl && BRAND.logoWordmark2x
      ? `${BRAND.logoWordmark} 1x, ${BRAND.logoWordmark2x} 2x`
      : undefined;
  const iconSrc = BRAND.logoIcon;
  const stackedSrc = customLogoUrl || BRAND.logoStacked;

  let content;

  if (layout === "icon") {
    content = (
      <div className="shrink-0">
        <img
          src={iconSrc}
          alt={BRAND.name}
          className={cn("object-contain select-none", s.icon)}
          decoding="async"
        />
      </div>
    );
  } else if (layout === "full") {
    content = (
      <div className="shrink-0">
        <img
          src={stackedSrc}
          alt={BRAND.name}
          className={cn(
            "object-contain object-left select-none",
            s.full,
            onDark && "brightness-0 invert"
          )}
          decoding="async"
        />
      </div>
    );
  } else {
    content = (
      <div className="shrink-0">
        <img
          src={wordmarkSrc}
          srcSet={wordmarkSrcSet}
          alt={BRAND.name}
          className={cn(
            "block max-h-full object-contain object-left select-none",
            s.wordmark,
            onDark && "brightness-0 invert"
          )}
          decoding="async"
        />
      </div>
    );
  }

  if (!link) {
    if (!className) return content;
    return <div className={className}>{content}</div>;
  }
  return (
    <Link
      to="/"
      aria-label={`${BRAND.name} inicio`}
      className={cn("inline-flex items-center shrink-0 leading-none", className)}
    >
      {content}
    </Link>
  );
}
