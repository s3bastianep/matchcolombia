export function getEstratoLabel(estrato) {
  if (!estrato && estrato !== 0) return null;
  const value = String(estrato).toLowerCase();
  if (value === "comercial") return "Comercial";
  if (value === "rural") return "Rural";
  return `Estrato ${estrato}`;
}

export function getEstratoChipStyle(estrato) {
  const value = String(estrato || "").toLowerCase();
  if (value === "comercial") return "bg-brand-magenta/10 text-brand-magenta border-brand-magenta/25";
  if (value === "rural") return "bg-brand-violet/10 text-brand-violet border-brand-violet/25";
  return "bg-secondary text-foreground/75 border-border/50";
}

export function formatEstratoFilterLabel(value) {
  if (value === "comercial") return "Comercial";
  if (value === "rural") return "Rural";
  return `Estrato ${value}`;
}
