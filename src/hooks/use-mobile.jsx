import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const APP_BREAKPOINT = 1024;

function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    setMatches(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return !!matches;
}

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}

/** App shell (bottom nav) — aligns with Tailwind `lg` breakpoint */
export function useIsApp() {
  return useMediaQuery(`(max-width: ${APP_BREAKPOINT - 1}px)`);
}
