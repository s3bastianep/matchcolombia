export const DEFAULT_ADVANCED_FILTERS = {
  bedrooms: "",
  bathrooms: "",
  parkingSpots: "",
  estrato: "",
};

export const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5"];
export const BATHROOM_OPTIONS = ["1", "2", "3", "4", "5"];
export const PARKING_OPTIONS = ["1", "2", "3", "4", "5"];
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

export function parseAdvancedFiltersFromUrl(params) {
  return {
    bedrooms: params.get("beds") || "",
    bathrooms: params.get("baths") || "",
    parkingSpots: params.get("spots") || "",
    estrato: params.get("estrato") || "",
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
    if (filters.estrato && !matchEstratoFilter(filters.estrato, p)) return false;
    return true;
  });
}
