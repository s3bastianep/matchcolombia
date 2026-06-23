export const MAINTENANCE_PROBLEM_TYPES = [
  { id: "llave", label: "Llave o cerradura", title: "Llave dañada" },
  { id: "gotera", label: "Gotera / plomería", title: "Gotera o plomería" },
  { id: "electricidad", label: "Electricidad", title: "Falla eléctrica" },
  { id: "electro", label: "Electrodoméstico", title: "Electrodoméstico dañado" },
  { id: "pintura", label: "Paredes / pintura", title: "Daño en paredes" },
  { id: "otro", label: "Otro", title: "Otro daño" },
];

export const VISIT_TIME_SLOTS = [
  { id: "manana", label: "Mañana", hint: "8:00 a. m. – 12:00 m." },
  { id: "tarde", label: "Tarde", hint: "12:00 m. – 5:00 p. m." },
  { id: "noche", label: "Noche", hint: "5:00 p. m. – 8:00 p. m." },
  { id: "flexible", label: "Flexible", hint: "Cualquier horario" },
];

export function visitSlotLabel(slotId) {
  return VISIT_TIME_SLOTS.find((s) => s.id === slotId)?.label || slotId;
}

export function formatVisitDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
}

export function minVisitDateInput() {
  return new Date().toISOString().slice(0, 10);
}
