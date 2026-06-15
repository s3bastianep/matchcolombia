import { hasElevator } from "@/lib/propertyFilters";
import { hasPool, hasGym } from "@/lib/propertyBuildingInfo";
import {
  matchesKitchenPref,
  matchesShowerPref,
  matchesFlooringPref,
  matchesBalconyPref,
} from "@/lib/propertyInteriorInfo";

const PREFS_KEY = "matchcolombia_preferences";

export const defaultPreferences = {
  city: "",
  zone: "",
  type: "all",
  beds: "all",
  bathrooms: "all",
  maxPrice: 10000000,
  elevator: "",
  pets: "",
  parking: false,
  furnished: false,
  pool: false,
  gym: false,
  kitchenType: "",
  showerType: "",
  flooringType: "",
  balcony: "",
};

export function savePreferences(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify({ ...prefs, savedAt: Date.now() }));
}

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY) || localStorage.getItem("matchbogota_preferences");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const pets =
      parsed.pets === true ? "si" : parsed.pets === false ? "" : parsed.pets ?? "";
    return { ...defaultPreferences, ...parsed, pets };
  } catch {
    return null;
  }
}

export function clearPreferences() {
  localStorage.removeItem(PREFS_KEY);
  localStorage.removeItem("matchbogota_preferences");
}

function normalizePetsPref(pets) {
  if (pets === true) return "si";
  if (pets === false) return "";
  return pets || "";
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
    const beds = parseInt(prefs.beds, 10);
    const match = beds === 5 ? property.bedrooms >= 5 : property.bedrooms === beds;
    score += match ? 15 : 0;
  } else {
    score += 8;
  }

  if (prefs.bathrooms && prefs.bathrooms !== "all") {
    const baths = parseInt(prefs.bathrooms, 10);
    const match = baths === 5 ? property.bathrooms >= 5 : property.bathrooms === baths;
    score += match ? 10 : 0;
  } else {
    score += 5;
  }

  if (property.monthly_rent <= (prefs.maxPrice || 10000000)) {
    score += 15;
  }

  if (prefs.elevator === "si" && hasElevator(property)) score += 5;
  if (prefs.elevator === "no" && !hasElevator(property)) score += 5;

  const petsPref = normalizePetsPref(prefs.pets);
  if (petsPref === "si" && property.pets_allowed) score += 5;

  if (prefs.parking && property.parking) score += 3;
  if (prefs.furnished && property.furnished === "amoblado") score += 3;
  if (prefs.pool && hasPool(property)) score += 3;
  if (prefs.gym && hasGym(property)) score += 3;

  if (prefs.kitchenType && matchesKitchenPref(property, prefs.kitchenType)) score += 4;
  if (prefs.showerType && matchesShowerPref(property, prefs.showerType)) score += 4;
  if (prefs.flooringType && matchesFlooringPref(property, prefs.flooringType)) score += 4;
  if (prefs.balcony && matchesBalconyPref(property, prefs.balcony)) score += 4;

  return Math.min(100, score);
}

export function buildExploreUrl(prefs) {
  const params = new URLSearchParams();
  if (prefs.city) params.set("city", prefs.city);
  if (prefs.zone) params.set("q", prefs.zone);
  if (prefs.type && prefs.type !== "all") params.set("type", prefs.type);
  if (prefs.beds && prefs.beds !== "all") params.set("beds", prefs.beds);
  if (prefs.bathrooms && prefs.bathrooms !== "all") params.set("baths", prefs.bathrooms);
  if (prefs.maxPrice < 10000000) params.set("max", String(prefs.maxPrice));
  if (prefs.elevator) params.set("elevator", prefs.elevator);
  const petsPref = normalizePetsPref(prefs.pets);
  if (petsPref === "si") params.set("pets", "si");
  params.set("matched", "1");
  return `/explorar?${params}`;
}
