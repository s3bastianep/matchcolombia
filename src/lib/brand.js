export const FAVICON_VERSION = "17";

export const BRAND = {
  name: "HABIBAR",
  short: "Habibar",
  tagline: "Donde te quedas · Bogotá",
  promise: "Arriendos verificados · Gestión completa",
  url:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
    (typeof process !== "undefined" && process.env?.VITE_SITE_URL) ||
    "https://habibar.com",
  email: "hola@habibar.com",
  phone: "+573012345678",
  phoneDisplay: "+57 301 234 5678",
  whatsapp: "573012345678",
  contactRole: "Equipo Habibar",
  contactTagline: "Nos encargamos de gestionar todo el proceso",
  quizLabel: "Match inteligente HABIBAR",
  quizShort: "Match",
  quizEvent: "open-habibar-quiz",
  logoWordmark: "/habibar-wordmark.png?v=9",
  logoWordmark2x: "/habibar-wordmark@2x.png?v=9",
  logoStacked: "/habibar-logo.png?v=9",
  logo: "/habibar-wordmark.png?v=9",
  logoIcon: `/habibar-icon.png?v=${FAVICON_VERSION}`,
  logoMark: `/habibar-mark.svg?v=${FAVICON_VERSION}`,
  splashMark: "/habibar-wordmark.png?v=9",
  social: {
    instagram: "https://instagram.com/habibar",
    tiktok: "https://tiktok.com/@habibar",
    x: "https://x.com/habibar",
  },
};
