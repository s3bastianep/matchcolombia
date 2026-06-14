import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/colombiaImages";

export default function SmartImage({ src, alt, className, fallback = FALLBACK_IMAGE, priority = false, ...props }) {
  const imgRef = useRef(null);
  const [current, setCurrent] = useState(src || fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrent(src || fallback);
    setLoaded(false);
  }, [src, fallback]);

  useEffect(() => {
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, [current]);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && <div className="absolute inset-0 shimmer" />}
      <img
        ref={imgRef}
        {...props}
        src={current}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== fallback) {
            setCurrent(fallback);
            setLoaded(false);
          }
        }}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          props.imgClassName
        )}
      />
    </div>
  );
}
