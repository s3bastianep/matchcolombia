/** URLs fiables — Pexels (estables en producción) */
export function pexels(id, w = 800, h) {
  const params = new URLSearchParams({ auto: "compress", cs: "tinysrgb", w: String(w), fit: "crop" });
  if (h) params.set("h", String(h));
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?${params}`;
}

/**
 * Solo inmuebles vacíos — sin personas, carros ni tiendas.
 * Cada propiedad tiene portada única (UNIQUE_COVERS).
 */
const UNIQUE_COVERS = {
  "prop-1": 439391,
  "prop-2": 1571460,
  "prop-3": 2062432,
  "prop-4": 1643384,
  "prop-5": 271624,
  "prop-10": 276724,
  "prop-11": 1080721,
  "prop-12": 1457842,
  "prop-13": 1571453,
  "prop-14": 1571455,
  "prop-15": 1571458,
  "prop-16": 1571461,
  "prop-17": 1571463,
  "prop-18": 1571468,
  "prop-19": 1743229,
  "prop-20": 1457841,
  "prop-21": 1918291,
  "prop-22": 259588,
  "prop-23": 259960,
};

/** Galerías fijas para inmuebles que necesitan fotos específicas */
const GALLERY_OVERRIDES = {
  "prop-19": [1743229, 3962285, 1029599, 4391475, 1571461, 1643384],
};

/** Fotos adicionales para galería (interiores). La portada nunca se repite entre inmuebles. */
const GALLERY_FILL_POOL = [
  439391, 1571460, 2062432, 1643384, 271624, 276724, 1080721, 1457842,
  1571453, 1571455, 1571458, 1571461, 1571463, 1571468,
  3962285, 1454360, 1029599, 4391475, 5843404, 6195806, 269135, 2724749,
  1743229, 259960, 6785153, 1918292, 534228, 323780,
];

const PROPERTY_IDS = [
  "prop-1", "prop-2", "prop-3", "prop-4", "prop-5",
  "prop-10", "prop-11", "prop-12", "prop-13",
  "prop-14", "prop-15", "prop-16", "prop-17", "prop-18", "prop-19",
  "prop-20", "prop-21", "prop-22", "prop-23",
];

const GALLERY_SIZES = [6, 6, 6, 5, 6, 6, 5, 6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6];

function buildPropertyGalleries() {
  const galleries = {};
  const allCovers = new Set(Object.values(UNIQUE_COVERS));

  PROPERTY_IDS.forEach((propId, propIndex) => {
    if (GALLERY_OVERRIDES[propId]) {
      galleries[propId] = GALLERY_OVERRIDES[propId].map((id) => pexels(id, 1200, 800));
      return;
    }

    const size = GALLERY_SIZES[propIndex] || 6;
    const coverId = UNIQUE_COVERS[propId];
    const used = new Set();
    const images = [];

    if (coverId) {
      images.push(pexels(coverId, 1200, 800));
      used.add(coverId);
    }

    let cursor = propIndex * 5 + 1;
    while (images.length < size) {
      const id = GALLERY_FILL_POOL[cursor % GALLERY_FILL_POOL.length];
      cursor += 1;
      if (used.has(id)) continue;
      if (allCovers.has(id) && id !== coverId) continue;
      used.add(id);
      images.push(pexels(id, 1200, 800));
    }

    galleries[propId] = images;
  });

  return galleries;
}

export const INTERIORS = {
  sala: pexels(439391, 1200, 800),
  sala2: pexels(1571460, 1200, 800),
  cocina: pexels(2062432, 1200, 800),
  dormitorio: pexels(1643384, 1200, 800),
  dormitorio2: pexels(271624, 1200, 800),
  estudio: pexels(276724, 1200, 800),
  balcon: pexels(1080721, 1200, 800),
  bano: pexels(1457842, 1200, 800),
  conjunto: pexels(1571461, 1200, 800),
  conjunto2: pexels(1571463, 1200, 800),
  casa: pexels(1918291, 1200, 800),
  casa2: pexels(1571463, 1200, 800),
  habitacion: pexels(1571468, 1200, 800),
  comedor: pexels(1571458, 1200, 800),
  vista: pexels(1080721, 1200, 800),
};

export const CITIES_IMG = {
  bogota: pexels(439391, 900, 600),
  skyline: pexels(2062432, 1400, 900),
  hero: pexels(439391, 1920, 1080),
};

export const HERO_COLLAGE = {
  collageMain: pexels(439391, 800, 700),
  collageBedroom: pexels(1643384, 500, 600),
  collageKitchen: pexels(2062432, 500, 500),
};

/** @deprecated Usar HERO_COLLAGE */
export const PEOPLE = HERO_COLLAGE;

export const BOGOTA = {
  skyline: INTERIORS.casa,
  cerros: INTERIORS.sala,
  chapinero: INTERIORS.sala,
  usaquen: INTERIORS.sala2,
  candelaria: INTERIORS.estudio,
  suba: INTERIORS.dormitorio,
};

export const GALLERY_SETS = {
  apartamento: [INTERIORS.sala, INTERIORS.cocina, INTERIORS.dormitorio, INTERIORS.balcon, INTERIORS.comedor, INTERIORS.bano],
  casa: [INTERIORS.casa, INTERIORS.sala2, INTERIORS.cocina, INTERIORS.dormitorio2, INTERIORS.casa2, INTERIORS.vista],
  estudio: [INTERIORS.estudio, INTERIORS.cocina, INTERIORS.bano, INTERIORS.balcon, INTERIORS.sala2],
  habitacion: [INTERIORS.habitacion, INTERIORS.estudio, INTERIORS.cocina, INTERIORS.conjunto],
  duplex: [INTERIORS.vista, INTERIORS.sala, INTERIORS.dormitorio, INTERIORS.cocina, INTERIORS.balcon],
  penthouse: [INTERIORS.vista, INTERIORS.sala2, INTERIORS.comedor, INTERIORS.dormitorio, INTERIORS.balcon, INTERIORS.bano],
  default: [INTERIORS.sala, INTERIORS.cocina, INTERIORS.dormitorio, INTERIORS.balcon, INTERIORS.bano],
};

export const PROPERTY_GALLERIES = buildPropertyGalleries();

export const IMAGES_VERSION = 5;

export const ROOM_LABELS = ["Sala", "Cocina", "Habitación", "Balcón", "Comedor", "Baño", "Vista", "Exterior"];

export function getGalleryForProperty(propertyId, propertyType) {
  return PROPERTY_GALLERIES[propertyId] || GALLERY_SETS[propertyType] || GALLERY_SETS.default;
}

export function getPropertyImages(property) {
  if (!property) return GALLERY_SETS.default;
  return getGalleryForProperty(property.id, property.property_type);
}

export const FALLBACK_IMAGE = INTERIORS.sala;
