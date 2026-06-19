import React, { useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticLight } from "@/lib/haptics";

const THRESHOLD = 68;
const MAX_PULL = 96;

export default function PullToRefresh({ onRefresh, children, className, disabled = false }) {
  const scrollRef = useRef(null);
  const startY = useRef(0);
  const pulling = useRef(false);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const offset = refreshing ? 52 : pull;

  const handleTouchStart = useCallback((e) => {
    if (disabled || refreshing) return;
    const el = scrollRef.current;
    if (el && el.scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  }, [disabled, refreshing]);

  const handleTouchMove = useCallback((e) => {
    if (!pulling.current || disabled || refreshing) return;
    const el = scrollRef.current;
    if (!el || el.scrollTop > 0) {
      pulling.current = false;
      setPull(0);
      return;
    }
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      setPull(Math.min(dy * 0.5, MAX_PULL));
    }
  }, [disabled, refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current || disabled) return;
    pulling.current = false;

    if (pull >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      hapticLight();
      try {
        await onRefresh?.();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  }, [pull, refreshing, disabled, onRefresh]);

  return (
    <div
      ref={scrollRef}
      className={cn("overflow-y-auto native-scroll-y relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="sticky top-0 z-20 flex items-end justify-center pointer-events-none overflow-hidden"
        style={{ height: offset, marginBottom: offset > 0 ? -offset : 0, transition: refreshing ? "height 0.2s ease" : undefined }}
      >
        <div className={cn("pb-2 flex items-center justify-center", (pull > 0 || refreshing) && "opacity-100")}>
          <Loader2
            className={cn(
              "w-5 h-5 text-brand-violet",
              (refreshing || pull >= THRESHOLD) && "animate-spin"
            )}
            style={{ opacity: Math.min(1, pull / THRESHOLD) }}
          />
        </div>
      </div>
      <div style={{ transform: offset ? `translateY(0)` : undefined }}>{children}</div>
    </div>
  );
}
