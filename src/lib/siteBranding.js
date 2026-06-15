const SETTINGS_KEY = "matchcolombia_admin_settings";
export const SITE_BRANDING_EVENT = "site-branding-updated";
export const DEFAULT_FAVICON = "/brand-mark.svg";
export const MAX_LOGO_BYTES = 400 * 1024;

export function getSiteBranding() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { logoUrl: null };
    const settings = JSON.parse(raw);
    return { logoUrl: settings.site_logo || null };
  } catch {
    return { logoUrl: null };
  }
}

export function notifySiteBrandingUpdated() {
  window.dispatchEvent(new Event(SITE_BRANDING_EVENT));
}

export function subscribeSiteBranding(handler) {
  window.addEventListener(SITE_BRANDING_EVENT, handler);
  return () => window.removeEventListener(SITE_BRANDING_EVENT, handler);
}

export function applySiteFavicon(url) {
  const href = url || DEFAULT_FAVICON;
  document.querySelectorAll("link[rel='icon'], link[rel='apple-touch-icon']").forEach((link) => {
    link.setAttribute("href", href);
  });
}

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith("image/")) {
      reject(new Error("Selecciona un archivo de imagen (PNG, JPG o SVG)."));
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      reject(new Error("La imagen es muy pesada. Máximo 400 KB."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}
