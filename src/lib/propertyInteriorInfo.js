/** Cocina, ducha y piso — usados en match y detalle */

const INTERIOR_BY_PROPERTY = {
  "prop-1": { kitchen_type: "gas", shower_type: "gas", flooring_type: "porcelanato", has_balcony: true },
  "prop-2": { kitchen_type: "gas", shower_type: "electrica", flooring_type: "madera", has_balcony: true },
  "prop-3": { kitchen_type: "gas", shower_type: "gas", flooring_type: "madera", has_balcony: false },
  "prop-4": { kitchen_type: "electrica", shower_type: "electrica", flooring_type: "porcelanato", has_balcony: false },
  "prop-5": { kitchen_type: "electrica", shower_type: "gas", flooring_type: "porcelanato", has_balcony: false },
  "prop-10": { kitchen_type: "gas", shower_type: "electrica", flooring_type: "porcelanato", has_balcony: true },
  "prop-11": { kitchen_type: "electrica", shower_type: "electrica", flooring_type: "madera", has_balcony: true },
  "prop-12": { kitchen_type: "gas", shower_type: "gas", flooring_type: "porcelanato", has_balcony: false },
  "prop-13": { kitchen_type: "electrica", shower_type: "gas", flooring_type: "madera", has_balcony: false },
};

const KITCHEN_LABELS = { electrica: "Cocina eléctrica", gas: "Cocina a gas" };
const SHOWER_LABELS = { electrica: "Ducha eléctrica", gas: "Ducha a gas" };
const FLOORING_LABELS = { madera: "Piso en madera", porcelanato: "Piso en porcelanato" };

function fallbackForProperty(property) {
  return INTERIOR_BY_PROPERTY[property?.id] || {
    kitchen_type: "electrica",
    shower_type: "electrica",
    flooring_type: "porcelanato",
    has_balcony: false,
  };
}

export function getKitchenType(property) {
  return property?.kitchen_type || fallbackForProperty(property).kitchen_type;
}

export function getShowerType(property) {
  return property?.shower_type || fallbackForProperty(property).shower_type;
}

export function getFlooringType(property) {
  return property?.flooring_type || fallbackForProperty(property).flooring_type;
}

export function getKitchenTypeLabel(property) {
  return KITCHEN_LABELS[getKitchenType(property)] || null;
}

export function getShowerTypeLabel(property) {
  return SHOWER_LABELS[getShowerType(property)] || null;
}

export function getFlooringTypeLabel(property) {
  return FLOORING_LABELS[getFlooringType(property)] || null;
}

export function matchesKitchenPref(property, pref) {
  return !pref || pref === getKitchenType(property);
}

export function matchesShowerPref(property, pref) {
  return !pref || pref === getShowerType(property);
}

export function matchesFlooringPref(property, pref) {
  return !pref || pref === getFlooringType(property);
}

export function hasBalcony(property) {
  if (property?.has_balcony != null) return property.has_balcony;
  return fallbackForProperty(property).has_balcony;
}

export function matchesBalconyPref(property, pref) {
  if (!pref) return true;
  if (pref === "si") return hasBalcony(property);
  if (pref === "no") return !hasBalcony(property);
  return true;
}
