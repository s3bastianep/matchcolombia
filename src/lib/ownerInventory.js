export const INVENTORY_KINDS = [
  {
    id: "entrega",
    label: "Entrega al inquilino",
    description: "Documenta cómo se entrega el inmueble al firmar el arriendo.",
  },
  {
    id: "recepcion",
    label: "Recepción del inmueble",
    description: "Documenta el estado al recibir el apartamento de vuelta.",
  },
];

export const DEFAULT_INVENTORY_ROOMS = [
  "Sala y comedor",
  "Cocina",
  "Baño principal",
  "Habitación principal",
  "Habitación 2",
  "Balcón / terraza",
  "Zona de lavado",
  "Estado general",
];

function slugify(value) {
  return String(value || "room")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildInventoryRooms(names = DEFAULT_INVENTORY_ROOMS) {
  return names.map((name, index) => ({
    id: `room-${slugify(name)}-${index}`,
    name,
    notes: "",
    photos: [],
  }));
}

export function buildEmptyInventory({ propertyId, ownerUserId, kind, propertyTitle }) {
  const kindMeta = INVENTORY_KINDS.find((k) => k.id === kind) || INVENTORY_KINDS[0];
  return {
    property_id: propertyId,
    owner_user_id: ownerUserId,
    kind: kindMeta.id,
    title: `${kindMeta.label} — ${propertyTitle}`,
    general_notes: "",
    rooms: buildInventoryRooms(),
    status: "borrador",
  };
}

export function inventoryKindLabel(kind) {
  return INVENTORY_KINDS.find((k) => k.id === kind)?.label || kind;
}

export function countInventoryPhotos(inventory) {
  return (inventory?.rooms || []).reduce((sum, room) => sum + (room.photos?.length || 0), 0);
}
