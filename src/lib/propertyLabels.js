export function getEstratoLabel(estrato) {
  if (!estrato && estrato !== 0) return null;
  const value = String(estrato).toLowerCase();
  if (value === "comercial") return "Comercial";
  if (value === "rural") return "Rural";
  return `Estrato ${estrato}`;
}

export function getEstratoChipStyle(estrato) {
  const value = String(estrato || "").toLowerCase();
  if (value === "comercial") return "bg-[hsl(32,95%,54%)]/12 text-[hsl(32,95%,38%)] border-[hsl(32,95%,54%)]/25";
  if (value === "rural") return "bg-[hsl(168,72%,40%)]/12 text-[hsl(168,72%,32%)] border-[hsl(168,72%,40%)]/25";
  return "bg-[hsl(200,90%,50%)]/10 text-[hsl(200,90%,38%)] border-[hsl(200,90%,50%)]/20";
}

export function formatEstratoFilterLabel(value) {
  if (value === "comercial") return "Comercial";
  if (value === "rural") return "Rural";
  return `Estrato ${value}`;
}
