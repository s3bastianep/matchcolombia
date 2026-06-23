import React, { useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticLight } from "@/lib/haptics";

const THRESHOLD = 68;
const MAX_PULL = 96;

export default function PullToRefresh({ onRefresh, children, className, disabled = false }) {
  const scrollRef = useRef(null);
  const indicatorRef = useRef(null);
  const startY = useRef(0);
  const pulling = useRef(false);
  const pullRef = useRef(0);
  const rafRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const applyPullVisual = useCallback((value, animate = false) => {
    const el = indicatorRef.current;
    if (!el) return;
    el.style.height = `${value}px`;
    el.style.marginBottom = value > 0 ? `-${value}px` : "0px";
    el.style.transition = animate ? "height 0.2s ease, margin-bottom 0.2s ease" : "";
    const icon = el.querySelector("[data-pull-icon]");
    if (icon) {
      icon.style.opacity = String(Math.min(1, value / THRESHOLD));
    }
  }, []);

  const handleTouchStart = useCallback(
    (e) => {
      if (disabled || refreshing) return;
      const el = scrollRef.current;
      if (el && el.scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    },
    [disabled, refreshing]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!pulling.current || disabled || refreshing) return;
      const el = scrollRef.current;
      if (!el || el.scrollTop > 0) {
        pulling.current = false;
        pullRef.current = 0;
        applyPullVisual(0);
        return;
      }
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0) {
        const next = Math.min(dy * 0.5, MAX_PULL);
        pullRef.current = next;
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
          applyPullVisual(pullRef.current);
          rafRef.current = null;
        });
      }
    },
    [disabled, refreshing, applyPullVisual]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current || disabled) return;
    pulling.current = false;

    const pull = pullRef.current;

    if (pull >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      applyPullVisual(52, true);
      hapticLight();
      try {
        await onRefresh?.();
      } finally {
        setRefreshing(false);
        pullRef.current = 0;
        applyPullVisual(0, true);
      }
    } else {
      pullRef.current = 0;
      applyPullVisual(0, true);
    }
  }, [refreshing, disabled, onRefresh, applyPullVisual]);

  return (
    <div
      ref={scrollRef}
      className={cn("overflow-y-auto native-scroll-y relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={indicatorRef}
        className="sticky top-0 z-20 flex items-end justify-center pointer-events-none overflow-hidden"
        style={{ height: 0, marginBottom: 0 }}
      >
        <div className="pb-2 flex items-center justify-center">
          <Loader2
            data-pull-icon
            className={cn("w-5 h-5 text-brand-violet", refreshing && "animate-spin")}
            style={{ opacity: 0 }}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
