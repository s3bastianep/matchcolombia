import { hasElevator } from "@/lib/propertyFilters";
import { hasPool, hasGym } from "@/lib/propertyBuildingInfo";
import {
  matchesKitchenPref,
  matchesShowerPref,
  matchesFlooringPref,
  matchesBalconyPref,
} from "@/lib/propertyInteriorInfo";

const PREFS_KEY = "habibar_preferences";

export const defaultPreferences = {
  city: "",
  zone: "",
  zones: [],
  type: "all",
  types: [],
  beds: [],
  bathrooms: [],
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
    return normalizeStoredPreferences(parsed);
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

/** Convierte valor legacy (string) o array a lista de opciones seleccionadas */
export function asSelectionList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (!value || value === "all") return [];
  if (typeof value === "string" && value.includes(",")) {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [String(value)];
}

export function propertyMatchesBedSelection(bedrooms, selected) {
  const list = asSelectionList(selected);
  if (!list.length) return true;
  const n = Number(bedrooms) || 0;
  return list.some((b) => {
    const target = parseInt(b, 10);
    return target === 5 ? n >= 5 : n === target;
  });
}

export function propertyMatchesBathSelection(bathrooms, selected) {
  const list = asSelectionList(selected);
  if (!list.length) return true;
  const n = Number(bathrooms) || 0;
  return list.some((b) => {
    const target = parseInt(b, 10);
    return target === 5 ? n >= 5 : n === target;
  });
}

export function propertyMatchesTypeSelection(propertyType, selected) {
  const list = asSelectionList(selected);
  if (!list.length) return true;
  return list.includes(propertyType);
}

function normalizeStoredPreferences(parsed) {
  const pets =
    parsed.pets === true ? "si" : parsed.pets === false ? "" : parsed.pets ?? "";

  const types = asSelectionList(parsed.types?.length ? parsed.types : parsed.type);
  const beds = asSelectionList(parsed.beds);
  const bathrooms = asSelectionList(parsed.bathrooms);
  const zones = asSelectionList(parsed.zones?.length ? parsed.zones : parsed.zone);

  return {
    ...defaultPreferences,
    ...parsed,
    pets,
    types,
    type: types.length === 1 ? types[0] : types.length ? types.join(",") : "all",
    beds,
    bathrooms,
    zones,
    zone: zones.length === 1 ? zones[0] : "",
  };
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
  } else if (prefs.zones?.length) {
    const match = prefs.zones.some((zone) => {
      const z = zone.toLowerCase();
      return (
        property.locality?.toLowerCase().includes(z) ||
        property.neighborhood?.toLowerCase().includes(z)
      );
    });
    score += match ? 25 : 0;
  } else {
    score += 10;
  }

  const types = asSelectionList(prefs.types?.length ? prefs.types : prefs.type);
  if (!types.length || propertyMatchesTypeSelection(property.property_type, types)) {
    score += 25;
  }

  const bedsList = asSelectionList(prefs.beds);
  if (bedsList.length) {
    if (propertyMatchesBedSelection(property.bedrooms, bedsList)) score += 15;
  } else {
    score += 8;
  }

  const bathsList = asSelectionList(prefs.bathrooms);
  if (bathsList.length) {
    if (propertyMatchesBathSelection(property.bathrooms, bathsList)) score += 10;
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

  const zones = asSelectionList(prefs.zones?.length ? prefs.zones : prefs.zone);
  if (zones.length === 1) params.set("q", zones[0]);
  else if (zones.length > 1) params.set("zones", zones.join(","));

  const types = asSelectionList(prefs.types?.length ? prefs.types : prefs.type);
  if (types.length === 1) params.set("type", types[0]);
  else if (types.length > 1) params.set("type", types.join(","));

  const beds = asSelectionList(prefs.beds);
  if (beds.length) params.set("beds", beds.join(","));

  const baths = asSelectionList(prefs.bathrooms);
  if (baths.length) params.set("baths", baths.join(","));

  if (prefs.maxPrice < 10000000) params.set("max", String(prefs.maxPrice));
  if (prefs.elevator) params.set("elevator", prefs.elevator);
  const petsPref = normalizePetsPref(prefs.pets);
  if (petsPref === "si") params.set("pets", "si");
  params.set("matched", "1");
  return `/explorar?${params}`;
}
