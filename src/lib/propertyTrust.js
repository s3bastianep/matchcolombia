/** Inmueble con revisión Habibar (no mostrar "Verificado" sin respaldo). */
export function isPropertyVerified(property) {
  if (!property) return false;
  if (property.verified === false) return false;
  if (property.verified === true) return true;
  if (property.photos_by_team || property.team_visit_date) return true;
  if (property.status && property.status !== "disponible") return false;
  return false;
}
