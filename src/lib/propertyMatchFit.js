import { parseAdvancedFiltersFromUrl, hasElevator, getTotalMonthly } from "@/lib/propertyFilters";
import { EXPLORE_TYPE_LABELS } from "@/lib/siteCopy";
import {
  asSelectionList,
  propertyMatchesBedSelection,
  propertyMatchesBathSelection,
  propertyMatchesTypeSelection,
  loadPreferences,
} from "@/lib/matchPreferences";
import {
  matchesKitchenPref,
  matchesShowerPref,
  matchesFlooringPref,
  matchesBalconyPref,
  getKitchenTypeLabel,
  getShowerTypeLabel,
  getFlooringTypeLabel,
  hasBalcony,
} from "@/lib/propertyInteriorInfo";
import { hasPool, hasGym } from "@/lib/propertyBuildingInfo";

const KITCHEN_PREF_LABELS = { electrica: "Cocina eléctrica", gas: "Cocina a gas" };
const SHOWER_PREF_LABELS = { electrica: "Ducha eléctrica", gas: "Ducha a gas" };
const FLOORING_PREF_LABELS = { madera: "Piso en madera", porcelanato: "Piso en porcelanato" };

function formatMoney(value) {
  return `$${Number(value).toLocaleString("es-CO")}`;
}

function bedsLabel(selected) {
  const list = asSelectionList(selected);
  if (!list.length) return "";
  const parts = list.map((b) => (b === "5" ? "5+" : b));
  if (parts.length === 1) {
    return parts[0] === "1" ? "1 habitación" : `${parts[0]} habitaciones`;
  }
  return `${parts.join(", ")} hab.`;
}

function bathsLabel(selected) {
  const list = asSelectionList(selected);
  if (!list.length) return "";
  const parts = list.map((b) => (b === "5" ? "5+" : b));
  if (parts.length === 1) {
    return parts[0] === "1" ? "1 baño" : `${parts[0]} baños`;
  }
  return `${parts.join(", ")} baños`;
}

function typesLabel(selected) {
  const list = asSelectionList(selected);
  return list.map((t) => EXPLORE_TYPE_LABELS[t] || t).join(" o ");
}

/** Une preferencias del Match y filtros activos en Explorar */
export function collectActiveSearchCriteria(prefs, searchParams) {
  const criteria = [];
  const urlFilters = searchParams ? parseAdvancedFiltersFromUrl(searchParams) : {};

  const city = searchParams?.get("city") || prefs?.city || "";
  if (city) criteria.push({ id: "city", city });

  const zoneFromUrl = searchParams?.get("q") || "";
  const zonesFromUrl = searchParams?.get("zones")?.split(",").map((z) => z.trim()).filter(Boolean) || [];
  const zonesFromPrefs = asSelectionList(prefs?.zones?.length ? prefs.zones : prefs?.zone);
  const zones = [...new Set([zoneFromUrl, ...zonesFromUrl, ...zonesFromPrefs].filter(Boolean))];
  if (zones.length) criteria.push({ id: "zones", zones });

  const maxPriceRaw = urlFilters.priceMax || (prefs?.maxPrice && prefs.maxPrice < 10000000 ? String(prefs.maxPrice) : "");
  if (maxPriceRaw) criteria.push({ id: "maxPrice", maxPrice: parseInt(maxPriceRaw, 10) });

  const minPriceRaw = urlFilters.priceMin || "";
  if (minPriceRaw) criteria.push({ id: "minPrice", minPrice: parseInt(minPriceRaw, 10) });

  const typesRaw = searchParams?.get("type") || "";
  const typesFromPrefs = asSelectionList(prefs?.types?.length ? prefs.types : prefs?.type);
  const types = typesRaw ? asSelectionList(typesRaw) : typesFromPrefs;
  if (types.length) criteria.push({ id: "types", types });

  const bedsRaw = urlFilters.bedrooms || prefs?.beds;
  const beds = asSelectionList(bedsRaw);
  if (beds.length) criteria.push({ id: "beds", beds });

  const bathsRaw = urlFilters.bathrooms || prefs?.bathrooms;
  const baths = asSelectionList(bathsRaw);
  if (baths.length) criteria.push({ id: "baths", baths });

  const pets = urlFilters.pets || prefs?.pets || "";
  if (pets === "si") criteria.push({ id: "pets" });

  const elevator = urlFilters.elevator || prefs?.elevator || "";
  if (elevator === "si" || elevator === "no") criteria.push({ id: "elevator", elevator });

  if (prefs?.parking) criteria.push({ id: "parking" });
  if (prefs?.pool) criteria.push({ id: "pool" });
  if (prefs?.gym) criteria.push({ id: "gym" });
  if (prefs?.furnished) criteria.push({ id: "furnished" });

  if (prefs?.kitchenType) criteria.push({ id: "kitchenType", value: prefs.kitchenType });
  if (prefs?.showerType) criteria.push({ id: "showerType", value: prefs.showerType });
  if (prefs?.flooringType) criteria.push({ id: "flooringType", value: prefs.flooringType });
  if (prefs?.balcony === "si" || prefs?.balcony === "no") criteria.push({ id: "balcony", value: prefs.balcony });

  if (urlFilters.parkingSpots) criteria.push({ id: "parkingSpots", value: urlFilters.parkingSpots });
  if (urlFilters.estrato) criteria.push({ id: "estrato", value: urlFilters.estrato });
  if (urlFilters.floor) criteria.push({ id: "floor", value: urlFilters.floor });

  return criteria;
}

function evaluateCriterion(property, criterion) {
  switch (criterion.id) {
    case "city": {
      const ok = property.city?.toLowerCase() === criterion.city.toLowerCase();
      return {
        ok,
        label: ok
          ? `En ${criterion.city}`
          : `Buscas en ${criterion.city} · este está en ${property.city || "otra ciudad"}`,
      };
    }
    case "zones": {
      const ok = criterion.zones.some((zone) => {
        const z = zone.toLowerCase();
        return (
          property.locality?.toLowerCase().includes(z) ||
          property.neighborhood?.toLowerCase().includes(z)
        );
      });
      const zoneText = criterion.zones.length === 1 ? criterion.zones[0] : criterion.zones.join(", ");
      const where = property.neighborhood || property.locality || "otra zona";
      return {
        ok,
        label: ok ? `Zona ${zoneText}` : `Buscas en ${zoneText} · este está en ${where}`,
      };
    }
    case "maxPrice": {
      const total = getTotalMonthly(property);
      const ok = !property.monthly_rent || total <= criterion.maxPrice;
      return {
        ok,
        label: ok
          ? `Hasta ${formatMoney(criterion.maxPrice)}/mes · total ~${formatMoney(total)}`
          : `Supera tu tope de ${formatMoney(criterion.maxPrice)}/mes`,
      };
    }
    case "minPrice": {
      const total = getTotalMonthly(property);
      const ok = total >= criterion.minPrice;
      return {
        ok,
        label: ok
          ? `Desde ${formatMoney(criterion.minPrice)}/mes · total ~${formatMoney(total)}`
          : `Por debajo de tu mínimo (${formatMoney(criterion.minPrice)}/mes)`,
      };
    }
    case "types": {
      const wanted = typesLabel(criterion.types);
      const ok = propertyMatchesTypeSelection(property.property_type, criterion.types);
      const actual = EXPLORE_TYPE_LABELS[property.property_type] || property.property_type || "otro tipo";
      return {
        ok,
        label: ok ? wanted : `Pediste ${wanted} · es ${actual}`,
      };
    }
    case "beds": {
      const wanted = bedsLabel(criterion.beds);
      const ok = propertyMatchesBedSelection(property.bedrooms, criterion.beds);
      const n = property.bedrooms ?? 0;
      return {
        ok,
        label: ok ? wanted : `Pediste ${wanted} · tiene ${n}`,
      };
    }
    case "baths": {
      const wanted = bathsLabel(criterion.baths);
      const ok = propertyMatchesBathSelection(property.bathrooms, criterion.baths);
      const n = property.bathrooms ?? 0;
      return {
        ok,
        label: ok ? wanted : `Pediste ${wanted} · tiene ${n}`,
      };
    }
    case "pets": {
      const ok = Boolean(property.pets_allowed);
      return { ok, label: ok ? "Acepta mascotas" : "No acepta mascotas. Necesitas que las acepte." };
    }
    case "elevator": {
      const wants = criterion.elevator === "si";
      const ok = wants ? hasElevator(property) : !hasElevator(property);
      return { ok, label: wants ? "Con ascensor" : "Sin ascensor" };
    }
    case "parking":
      return { ok: Boolean(property.parking), label: "Con parqueadero" };
    case "pool":
      return { ok: hasPool(property), label: "Con piscina" };
    case "gym":
      return { ok: hasGym(property), label: "Con gimnasio" };
    case "furnished":
      return { ok: property.furnished === "amoblado", label: "Amoblado" };
    case "kitchenType": {
      const wanted = KITCHEN_PREF_LABELS[criterion.value] || criterion.value;
      const ok = matchesKitchenPref(property, criterion.value);
      const actual = getKitchenTypeLabel(property) || "otro tipo";
      return { ok, label: ok ? wanted : `Pediste ${wanted} · tiene ${actual}` };
    }
    case "showerType": {
      const wanted = SHOWER_PREF_LABELS[criterion.value] || criterion.value;
      const ok = matchesShowerPref(property, criterion.value);
      const actual = getShowerTypeLabel(property) || "otro tipo";
      return { ok, label: ok ? wanted : `Pediste ${wanted} · tiene ${actual}` };
    }
    case "flooringType": {
      const wanted = FLOORING_PREF_LABELS[criterion.value] || criterion.value;
      const ok = matchesFlooringPref(property, criterion.value);
      const actual = getFlooringTypeLabel(property) || "otro tipo";
      return { ok, label: ok ? wanted : `Pediste ${wanted} · tiene ${actual}` };
    }
    case "balcony": {
      const wants = criterion.value === "si";
      const ok = matchesBalconyPref(property, criterion.value);
      return { ok, label: wants ? "Con balcón" : "Sin balcón" };
    }
    case "parkingSpots": {
      const spots = property.parking_spots ?? (property.parking ? 1 : 0);
      const target = parseInt(criterion.value, 10);
      const ok = criterion.value === "5" ? spots >= 5 : spots === target;
      const wanted = criterion.value === "5" ? "5+ parqueaderos" : `${criterion.value} parqueadero${criterion.value === "1" ? "" : "s"}`;
      return { ok, label: ok ? wanted : `Pediste ${wanted} · tiene ${spots}` };
    }
    case "estrato":
      return {
        ok: String(property.estrato) === criterion.value,
        label: `Estrato ${criterion.value}`,
      };
    case "floor": {
      const floor = property.floor ?? 0;
      const target = parseInt(criterion.value, 10);
      const ok = criterion.value === "10" ? floor >= 10 : floor === target;
      const wanted = criterion.value === "10" ? "Piso 10+" : `Piso ${criterion.value}`;
      return { ok, label: ok ? wanted : `Pediste ${wanted} · está en piso ${floor}` };
    }
    default:
      return { ok: true, label: "" };
  }
}

export function buildPropertyMatchFit(property, prefs = null, searchParams = null) {
  if (!property) return null;

  const resolvedPrefs = prefs ?? loadPreferences();
  const criteria = collectActiveSearchCriteria(resolvedPrefs, searchParams);

  if (!criteria.length) {
    return { hasCriteria: false, score: 0, rows: [] };
  }

  const rows = criteria.map((c) => evaluateCriterion(property, c)).filter((r) => r.label);
  const matched = rows.filter((r) => r.ok).length;
  const score = rows.length ? Math.round((matched / rows.length) * 100) : 0;

  return { hasCriteria: true, score, rows, matched, total: rows.length };
}
