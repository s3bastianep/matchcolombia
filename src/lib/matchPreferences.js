const PREFS_KEY = "matchcolombia_preferences";

export const defaultPreferences = {
  city: "",
  zone: "",
  type: "all",
  beds: "all",
  maxPrice: 10000000,
  parking: false,
  pets: false,
  furnished: false,
};

export function savePreferences(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify({ ...prefs, savedAt: Date.now() }));
}

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY) || localStorage.getItem("matchbogota_preferences");
    return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

export function clearPreferences() {
  localStorage.removeItem(PREFS_KEY);
  localStorage.removeItem("matchbogota_preferences");
}

export function scoreProperty(property, prefs) {
  if (!prefs) return 0;

  let score = 0;

  if (prefs.city) {
    const match = property.city?.toLowerCase() === prefs.city.toLowerCase();
    score += match ? 30 : 0;
  } else {
    score += 10;
  }

  if (prefs.zone) {
    const z = prefs.zone.toLowerCase();
    const match =
      property.locality?.toLowerCase().includes(z) ||
      property.neighborhood?.toLowerCase().includes(z);
    score += match ? 25 : 0;
  } else {
    score += 10;
  }

  if (!prefs.type || prefs.type === "all" || property.property_type === prefs.type) {
    score += 25;
  }

  if (prefs.beds && prefs.beds !== "all") {
    const beds = parseInt(prefs.beds);
    const match = beds === 5 ? property.bedrooms >= 5 : property.bedrooms === beds;
    score += match ? 15 : 0;
  } else {
    score += 8;
  }

  if (property.monthly_rent <= (prefs.maxPrice || 10000000)) {
    score += 15;
  }

  if (prefs.parking && property.parking) score += 3;
  if (prefs.pets && property.pets_allowed) score += 3;
  if (prefs.furnished && property.furnished === "amoblado") score += 3;

  return Math.min(100, score);
}

export function buildExploreUrl(prefs) {
  const params = new URLSearchParams();
  if (prefs.city) params.set("city", prefs.city);
  if (prefs.zone) params.set("q", prefs.zone);
  if (prefs.type && prefs.type !== "all") params.set("type", prefs.type);
  if (prefs.beds && prefs.beds !== "all") params.set("beds", prefs.beds);
  if (prefs.maxPrice < 10000000) params.set("max", String(prefs.maxPrice));
  params.set("matched", "1");
  return `/explorar?${params}`;
}
