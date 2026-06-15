import React, { useId } from "react";
import { cn } from "@/lib/utils";

/** Casa + L en un solo trazo — estilo monoline */
export default function BrandMark({ className, variant = "color" }) {
  const gradientId = useId().replace(/:/g, "");
  const onDark = variant === "onDark";
  const stroke = onDark ? "#fff" : `url(#${gradientId})`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {!onDark && (
        <defs>
          <linearGradient id={gradientId} x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E91E7A" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      )}

      <path
        d="M8 28H26V20M24 17L20 7.5L8 14.5V28"
        stroke={stroke}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
