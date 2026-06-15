import { useEffect, useRef, useState } from "react";

/**
 * Monta hijos solo cuando el sentinel entra (cerca) del viewport.
 * Reduce JS e imágenes en la ruta crítica del home.
 */
export default function DeferredMount({
  children,
  fallback = null,
  onMount,
  rootMargin = "240px 0px",
  minHeight,
  className,
}) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el) return;

    const activate = () => {
      setMounted(true);
      onMount?.();
    };

    if (typeof IntersectionObserver === "undefined") {
      activate();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activate();
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, onMount, rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={!mounted && minHeight ? { minHeight } : undefined}
    >
      {mounted ? children : fallback}
    </div>
  );
}
