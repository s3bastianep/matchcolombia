import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  describeClickTarget,
  initAnalyticsTransport,
  trackClick,
  trackPageView,
} from "@/lib/analytics";

const INTERACTIVE_SELECTOR = "a[href], button, [role='button'], [data-track]";

export default function AnalyticsTracker() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => initAnalyticsTransport(), []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    if (path === lastPath.current) return;
    lastPath.current = path;
    trackPageView(path);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented) return;
      const el = event.target.closest(INTERACTIVE_SELECTOR);
      if (!el) return;
      if (el.closest("[data-analytics-ignore]")) return;
      if (window.location.pathname.startsWith("/admin")) return;

      const { label, target } = describeClickTarget(el);
      trackClick({ label, target });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
