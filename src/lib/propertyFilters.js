export const DEFAULT_ADVANCED_FILTERS = {
  bedrooms: "",
  bathrooms: "",
  parkingSpots: "",
  estrato: "",
  priceMin: "",
  priceMax: "",
  listingType: "",
  buildingAge: "",
  elevator: "",
  floor: "",
  pets: "",
};

export const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5"];
export const BATHROOM_OPTIONS = ["1", "2", "3", "4", "5"];
export const PARKING_OPTIONS = ["1", "2", "3", "4", "5"];
export const FLOOR_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
export const ESTRATO_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "comercial", label: "Comercial" },
  { value: "rural", label: "Rural" },
];

export const LISTING_TYPE_OPTIONS = [
  { value: "arriendo", label: "Arriendo" },
  { value: "venta", label: "Venta" },
];

export const BUILDING_AGE_OPTIONS = [
  { value: "nuevo", label: "Nuevo" },
  { value: "usado", label: "Usado" },
  { value: "reformado", label: "Reformado" },
];

export const ELEVATOR_OPTIONS = [
  { value: "si", label: "Con ascensor" },
  { value: "no", label: "Sin ascensor" },
];

export const PRICE_SLIDER_MAX = 10000000;
export const PRICE_SLIDER_STEP = 100000;

export function parseAdvancedFiltersFromUrl(params) {
  return {
    bedrooms: params.get("beds") || "",
    bathrooms: params.get("baths") || "",
    parkingSpots: params.get("spots") || "",
    estrato: params.get("estrato") || "",
    priceMin: params.get("min") || "",
    priceMax: params.get("max") || "",
    listingType: params.get("intent") === "compra" ? "venta" : params.get("listing") || "",
    buildingAge: params.get("age") || "",
    elevator: params.get("elevator") || "",
    floor: params.get("floor") || "",
    pets: params.get("pets") || "",
  };
}

export function countAdvancedFilters(filters) {
  return Object.values(filters).filter(Boolean).length;
}

export function matchNumericFilter(filterValue, actual, { minPlus = 5 } = {}) {
  if (!filterValue) return true;
  const num = Number(actual) || 0;
  const target = parseInt(filterValue, 10);
  if (filterValue === String(minPlus)) return num >= minPlus;
  return num === target;
}

export function getParkingSpots(property) {
  if (property.parking_spots != null) return property.parking_spots;
  if (property.parking) return 1;
  return 0;
}

export function getTotalMonthly(property) {
  return (property.monthly_rent || 0) + (property.admin_fee || 0);
}

export function hasElevator(property) {
  if (property.has_elevator != null) return property.has_elevator;
  return property.amenities?.some((a) => a.toLowerCase().includes("ascensor")) ?? false;
}

export function matchEstratoFilter(filterValue, property) {
  if (!filterValue) return true;
  const estrato = property.estrato;
  if (filterValue === "comercial") {
    return estrato === "comercial" || property.property_type === "comercial";
  }
  if (filterValue === "rural") {
    return estrato === "rural" || property.property_type === "rural";
  }
  return String(estrato) === filterValue;
}

export function applyAdvancedFilters(properties, filters) {
  return properties.filter((p) => {
    if (filters.bedrooms && !matchNumericFilter(filters.bedrooms, p.bedrooms)) return false;
    if (filters.bathrooms && !matchNumericFilter(filters.bathrooms, p.bathrooms)) return false;
    if (filters.parkingSpots && !matchNumericFilter(filters.parkingSpots, getParkingSpots(p))) return false;
    if (filters.floor && !matchNumericFilter(filters.floor, p.floor, { minPlus: 10 })) return false;
    if (filters.estrato && !matchEstratoFilter(filters.estrato, p)) return false;
    if (filters.elevator === "si" && !hasElevator(p)) return false;
    if (filters.elevator === "no" && hasElevator(p)) return false;
    if (filters.pets === "si" && !p.pets_allowed) return false;
    const total = getTotalMonthly(p);
    if (filters.priceMin && total < parseInt(filters.priceMin, 10)) return false;
    if (filters.priceMax && total > parseInt(filters.priceMax, 10)) return false;
    if (filters.listingType && p.listing_type !== filters.listingType) return false;
    if (filters.buildingAge && p.building_age !== filters.buildingAge) return false;
    return true;
  });
}

export function advancedFiltersToUrlParams(filters, currentParams) {
  const next = new URLSearchParams(currentParams);
  const setOrDelete = (key, val) => {
    if (val) next.set(key, val);
    else next.delete(key);
  };
  setOrDelete("beds", filters.bedrooms);
  setOrDelete("baths", filters.bathrooms);
  setOrDelete("spots", filters.parkingSpots);
  setOrDelete("estrato", filters.estrato);
  setOrDelete("min", filters.priceMin);
  setOrDelete("max", filters.priceMax);
  setOrDelete("age", filters.buildingAge);
  setOrDelete("elevator", filters.elevator);
  setOrDelete("floor", filters.floor);
  setOrDelete("pets", filters.pets);
  if (filters.listingType === "venta") next.set("intent", "compra");
  else if (filters.listingType === "arriendo") next.delete("intent");
  else next.delete("intent");
  return next;
}
