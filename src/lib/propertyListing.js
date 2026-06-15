/** Fecha efectiva en que un inmueble quedó visible al público. */
export function getPropertyListedAt(property) {
  if (!property) return 0;
  const raw =
    property.published_at ||
    property.reviewed_at ||
    property.updated_date ||
    property.created_date;
  const time = new Date(raw || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function sortPropertiesByLatestListed(properties = []) {
  return [...properties].sort((a, b) => getPropertyListedAt(b) - getPropertyListedAt(a));
}

export function getLatestPublishedProperties(properties = [], { type, limit = 8 } = {}) {
  let list = sortPropertiesByLatestListed(properties);
  if (type && type !== "all") {
    list = list.filter((p) => p.property_type === type);
  }
  return list.slice(0, limit);
}
