import React from "react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

/** Ícono H de Habibar — usa el SVG oficial */
export default function BrandMark({ className, variant = "color" }) {
  const onDark = variant === "onDark";

  return (
    <img
      src={BRAND.logoMark}
      alt=""
      aria-hidden="true"
      className={cn("shrink-0 object-contain", onDark && "brightness-0 invert", className)}
    />
  );
}
