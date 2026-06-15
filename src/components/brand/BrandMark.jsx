import React from "react";
import { cn } from "@/lib/utils";

/** Casa + corazón — símbolo de hogar y match */
export default function BrandMark({ className, heartClassName }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M16 8.25 8.25 14.75V23.5h4.75v-4.25a1.75 1.75 0 0 1 1.75-1.75h2.5a1.75 1.75 0 0 1 1.75 1.75V23.5h4.75V14.75L16 8.25Z"
        fill="currentColor"
      />
      <path d="M19.25 8.25h2.25v4.5h-2.25V8.25Z" fill="currentColor" />
      <path
        d="M20.35 4.15c-.55-.95-2-.95-2.55 0-.55-.95-2.35-.95-2.9 0-.45.85.35 1.95 2.725 3.45 2.375-1.5 3.175-2.6 2.725-3.45Z"
        className={cn("fill-[#FFD6EC]", heartClassName)}
      />
    </svg>
  );
}
