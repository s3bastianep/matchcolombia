const BUILDING_AMENITY_MATCHERS = [
  "gimnasio",
  "piscina",
  "salón comunal",
  "salon comunal",
  "zona bbq",
  "bbq",
  "seguridad 24h",
  "portería",
  "porteria",
  "ascensor",
  "zona verde",
  "lavandería",
  "lavanderia",
  "depósito",
  "deposito",
  "citófono",
  "citofono",
  "cancha",
  "parqueadero visitantes",
];

const DEFAULT_ADMIN_INCLUDES = [
  "Vigilancia y control de acceso",
  "Aseo de zonas comunes",
  "Mantenimiento de ascensores y servicios básicos del conjunto",
];

const BUILDING_AGE_LABELS = {
  nuevo: "Edificio nuevo",
  reformado: "Edificio reformado recientemente",
  usado: "Edificio usado en buen estado",
};

function normalizeAmenity(value) {
  return String(value || "").trim().toLowerCase();
}

function isBuildingAmenity(name) {
  const key = normalizeAmenity(name);
  return BUILDING_AMENITY_MATCHERS.some((m) => key.includes(m));
}

function dedupeList(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = normalizeAmenity(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getBuildingAmenities(property) {
  if (property?.building_amenities?.length) {
    return dedupeList(property.building_amenities);
  }
  return dedupeList((property?.amenities || []).filter(isBuildingAmenity));
}

export function getUnitAmenities(property) {
  if (property?.unit_amenities?.length) {
    return dedupeList(property.unit_amenities);
  }
  const building = new Set(getBuildingAmenities(property).map(normalizeAmenity));
  return dedupeList(
    (property?.amenities || []).filter((a) => !building.has(normalizeAmenity(a)))
  );
}

export function getAdminFeeIncludes(property) {
  if (property?.admin_fee_includes?.length) {
    return property.admin_fee_includes;
  }
  if ((property?.admin_fee || 0) > 0) {
    return DEFAULT_ADMIN_INCLUDES;
  }
  return [];
}

export function getBuildingYearInfo(property) {
  const year = property?.year_built;
  if (year) {
    const age = new Date().getFullYear() - year;
    const ageLabel = age <= 1 ? "menos de 1 año" : age === 1 ? "1 año" : `${age} años`;
    return {
      year,
      ageYears: age,
      label: `Construido en ${year}`,
      detail: `${ageLabel} de antigüedad`,
    };
  }

  const ageKey = property?.building_age;
  if (ageKey && BUILDING_AGE_LABELS[ageKey]) {
    return {
      label: BUILDING_AGE_LABELS[ageKey],
      detail: ageKey === "nuevo" ? "Entrega reciente" : ageKey === "reformado" ? "Renovación en los últimos años" : "Antigüedad verificada por MatchColombia",
    };
  }

  return null;
}

export function hasBuildingDetails(property) {
  return (
    getBuildingAmenities(property).length > 0 ||
    getAdminFeeIncludes(property).length > 0 ||
    !!getBuildingYearInfo(property)
  );
}

const INTERIOR_DEFAULTS = {
  apartamento: ["Cocina integral", "Closets empotrados"],
  estudio: ["Cocina integrada", "Escritorio amoblado"],
  casa: ["Jardín o patio"],
  habitacion: ["Habitación privada"],
};

export function getInteriorCharacteristics(property) {
  const tags = [];

  if (property.interior_features?.length) {
    tags.push(...property.interior_features);
  } else if (INTERIOR_DEFAULTS[property.property_type]) {
    tags.push(...INTERIOR_DEFAULTS[property.property_type]);
  }

  getUnitAmenities(property).forEach((item) => tags.push(item));

  return dedupeList(tags);
}

export function getCommonAreaAmenities(property) {
  return getBuildingAmenities(property).filter((item) => {
    const key = normalizeAmenity(item);
    return !key.includes("ascensor") && !key.includes("elevator");
  });
}

export function getExteriorCharacteristics(property) {
  return getCommonAreaAmenities(property);
}

export function hasPropertyCharacteristics(property) {
  return (
    getInteriorCharacteristics(property).length > 0 ||
    getExteriorCharacteristics(property).length > 0
  );
}
