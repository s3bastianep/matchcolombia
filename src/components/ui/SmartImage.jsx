import React, { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/colombiaImages";

function optimizeSrc(src, variant) {
  if (!src || variant !== "card" || !src.includes("pexels.com")) return src;
  try {
    const url = new URL(src);
    url.searchParams.set("w", "480");
    url.searchParams.set("h", "360");
    url.searchParams.set("fit", "crop");
    return url.toString();
  } catch {
    return src;
  }
}

export default function SmartImage({ src, alt, className, fallback = FALLBACK_IMAGE, variant = "default", ...props }) {
  const imgRef = useRef(null);
  const resolvedSrc = useMemo(() => optimizeSrc(src || fallback, variant), [src, fallback, variant]);
  const [current, setCurrent] = useState(resolvedSrc);
  const [loaded, setLoaded] = useState(false);
  const useStaticPlaceholder = variant === "card";

  useEffect(() => {
    setCurrent(resolvedSrc);
    setLoaded(false);
  }, [resolvedSrc]);

  useEffect(() => {
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, [current]);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && !useStaticPlaceholder && <div className="absolute inset-0 shimmer" />}
      <img
        ref={imgRef}
        loading="lazy"
        decoding="async"
        fetchPriority={variant === "card" ? "low" : undefined}
        {...props}
        src={current}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== fallback) {
            setCurrent(fallback);
            setLoaded(false);
          }
        }}
        className={cn(
          "w-full h-full object-cover",
          !useStaticPlaceholder && "transition-opacity duration-300",
          loaded ? "opacity-100" : useStaticPlaceholder ? "opacity-0" : "opacity-0",
          props.imgClassName
        )}
      />
    </div>
  );
}
