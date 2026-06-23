const SETTINGS_KEY = "habibar_admin_settings";
const LOGO_KEY = "habibar_site_logo";

export const SITE_BRANDING_EVENT = "site-branding-updated";
export const DEFAULT_FAVICON = "/habibar-icon.png?v=10";
export const MAX_LOGO_BYTES = 400 * 1024;

function readLogoFromSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    const settings = JSON.parse(raw);
    return settings.site_logo || null;
  } catch {
    return null;
  }
}

/** Migra logos guardados en settings al almacén dedicado (una sola vez). */
function migrateLegacyLogo() {
  try {
    if (localStorage.getItem(LOGO_KEY)) return;
    const legacy = readLogoFromSettings();
    if (legacy) localStorage.setItem(LOGO_KEY, legacy);
  } catch {
    /* ignore */
  }
}

export function getSiteBranding() {
  migrateLegacyLogo();
  try {
    const logoUrl = localStorage.getItem(LOGO_KEY);
    if (logoUrl) return { logoUrl };
  } catch {
    /* ignore */
  }
  return { logoUrl: null };
}

export function setSiteLogo(dataUrl) {
  try {
    if (!dataUrl) {
      localStorage.removeItem(LOGO_KEY);
    } else {
      localStorage.setItem(LOGO_KEY, dataUrl);
    }
    notifySiteBrandingUpdated();
  } catch (err) {
    if (err?.name === "QuotaExceededError") {
      throw new Error("No hay espacio en el navegador. Usa una imagen más pequeña (idealmente PNG bajo 200 KB).");
    }
    throw new Error("No se pudo guardar el logo.");
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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo procesar la imagen."));
    img.src = src;
  });
}

/** Comprime raster (PNG/JPG/WebP) para caber en localStorage. SVG se deja igual. */
async function optimizeLogoDataUrl(dataUrl, mimeType) {
  if (mimeType === "image/svg+xml") return dataUrl;

  const img = await loadImage(dataUrl);
  const maxW = 520;
  const maxH = 240;
  let { width, height } = img;
  const ratio = Math.min(maxW / width, maxH / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, width, height);

  const preferPng = mimeType === "image/png";
  const optimized = canvas.toDataURL(preferPng ? "image/png" : "image/jpeg", 0.88);
  return optimized.length < dataUrl.length ? optimized : dataUrl;
}

export async function readImageFile(file) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Selecciona un archivo de imagen (PNG, JPG o SVG).");
  }
  if (file.size > MAX_LOGO_BYTES) {
    throw new Error("La imagen es muy pesada. Máximo 400 KB.");
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });

  return optimizeLogoDataUrl(dataUrl, file.type);
}
