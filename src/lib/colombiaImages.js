/** URLs fiables — Pexels (estables en producción) */
export function pexels(id, w = 1200, h) {
  const params = new URLSearchParams({ auto: "compress", cs: "tinysrgb", w: String(w), fit: "crop" });
  if (h) params.set("h", String(h));
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?${params}`;
}

// Interiores — apartamentos reales
export const INTERIORS = {
  sala: pexels(439391, 1200, 800),
  sala2: pexels(1571460, 1200, 800),
  cocina: pexels(2062432, 1200, 800),
  dormitorio: pexels(1643384, 1200, 800),
  dormitorio2: pexels(271624, 1200, 800),
  estudio: pexels(276724, 1200, 800),
  balcon: pexels(1080721, 1200, 800),
  bano: pexels(1457842, 1200, 800),
  conjunto: pexels(667838, 1200, 800),
  conjunto2: pexels(259588, 1200, 800),
  casa: pexels(1918291, 1200, 800),
  casa2: pexels(1571463, 1200, 800),
  habitacion: pexels(271624, 1200, 800),
  comedor: pexels(1571460, 1200, 800),
  vista: pexels(1080721, 1200, 800),
};

export const CITIES_IMG = {
  bogota: pexels(3136818, 900, 600),
  barranquilla: pexels(1486222, 900, 600),
  skyline: pexels(2373710, 1400, 900),
  hero: pexels(439391, 1920, 1080),
};

/** Collage hero — 3 apartamentos distintos */
export const PEOPLE = {
  collageMain: pexels(439391, 1400, 1200),
  collageBedroom: pexels(1643384, 900, 1100),
  collageKitchen: pexels(2062432, 900, 900),
};

export const BOGOTA = {
  skyline: CITIES_IMG.skyline,
  cerros: CITIES_IMG.bogota,
  chapinero: pexels(439391, 900, 600),
  usaquen: pexels(1571460, 900, 600),
  candelaria: pexels(276724, 900, 600),
  suba: pexels(667838, 900, 600),
};

export const GALLERY_SETS = {
  apartamento: [INTERIORS.sala, INTERIORS.cocina, INTERIORS.dormitorio, INTERIORS.balcon, INTERIORS.comedor, INTERIORS.bano],
  casa: [INTERIORS.casa, INTERIORS.sala2, INTERIORS.cocina, INTERIORS.dormitorio2, INTERIORS.casa2, INTERIORS.vista],
  estudio: [INTERIORS.estudio, INTERIORS.cocina, INTERIORS.bano, INTERIORS.balcon, INTERIORS.sala2],
  habitacion: [INTERIORS.habitacion, INTERIORS.estudio, INTERIORS.cocina, INTERIORS.conjunto],
  duplex: [INTERIORS.vista, INTERIORS.sala, INTERIORS.dormitorio, INTERIORS.cocina, INTERIORS.balcon],
  penthouse: [INTERIORS.vista, INTERIORS.sala2, INTERIORS.comedor, INTERIORS.dormitorio, INTERIORS.balcon, INTERIORS.bano],
  default: [INTERIORS.conjunto, INTERIORS.sala, INTERIORS.cocina, INTERIORS.dormitorio, INTERIORS.balcon],
};

export const ROOM_LABELS = ["Sala", "Cocina", "Habitación", "Balcón", "Comedor", "Baño", "Vista", "Exterior"];

export function getPropertyImages(property) {
  if (property?.images?.length >= 3) return property.images;
  const set = GALLERY_SETS[property?.property_type] || GALLERY_SETS.default;
  return set;
}

export const FALLBACK_IMAGE = INTERIORS.conjunto;
