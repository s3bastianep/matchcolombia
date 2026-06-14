/** Código operativo REF#######, estable por inmueble */
const KNOWN_CODES = {
  "prop-4": "REF4281956",
};

export function getPropertyReferenceCode(property) {
  if (!property) return null;
  if (property.reference_code) return property.reference_code;
  if (KNOWN_CODES[property.id]) return KNOWN_CODES[property.id];

  const id = property.id || "";
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 33 + id.charCodeAt(i)) >>> 0;
  }
  const digits = String(1000000 + (hash % 8999999));
  return `REF${digits}`;
}

export function referenceLine(property) {
  const code = getPropertyReferenceCode(property);
  return code ? `Ref. ${code}` : "";
}
