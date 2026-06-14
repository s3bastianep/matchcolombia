const FURNISHED_LABELS = {
  amoblado: "Amoblado",
  semi_amoblado: "Semi-amoblado",
  sin_amoblar: "Sin amoblar",
};

export function getTotalMonthly(property) {
  return (property.monthly_rent || 0) + (property.admin_fee || 0);
}

export function getFurnishedLabel(furnished) {
  if (!furnished) return null;
  return FURNISHED_LABELS[furnished] || furnished;
}

export function formatAvailableFrom(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return null;
  }
}
