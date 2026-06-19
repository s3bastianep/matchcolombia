export const BRAND = {
  name: "LUMORA HOME",
  short: "Lumora",
  tagline: "Arrienda fácil en Colombia",
  promise: "Gestión completa · Match inteligente",
  url:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
    (typeof process !== "undefined" && process.env?.VITE_SITE_URL) ||
    "https://matchcolombia.co",
  email: "hola@matchcolombia.co",
  phone: "+573012345678",
  phoneDisplay: "+57 301 234 5678",
  whatsapp: "573012345678",
  contactRole: "Equipo Lumora Home",
  contactTagline: "Nos encargamos de gestionar todo el proceso",
  social: {
    instagram: "https://instagram.com/lumorahome",
    tiktok: "https://tiktok.com/@lumorahome",
    x: "https://x.com/lumorahome",
  },
};
