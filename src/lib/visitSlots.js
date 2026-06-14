export const VISIT_TYPES = [
  { id: "presencial", label: "Visita presencial" },
  { id: "virtual", label: "Visita virtual" },
];

export const TIME_SLOTS_PRESENCIAL = [
  { id: "09:00", label: "09:00am", hour: 9 },
  { id: "10:00", label: "10:00am", hour: 10 },
  { id: "11:00", label: "11:00am", hour: 11 },
  { id: "12:00", label: "12:00pm", hour: 12 },
  { id: "13:00", label: "01:00pm", hour: 13 },
  { id: "14:00", label: "02:00pm", hour: 14 },
  { id: "15:00", label: "03:00pm", hour: 15 },
  { id: "16:00", label: "04:00pm", hour: 16 },
  { id: "17:00", label: "05:00pm", hour: 17 },
  { id: "18:00", label: "06:00pm", hour: 18 },
];

export const TIME_SLOTS_VIRTUAL = [
  { id: "10:00", label: "10:00am", hour: 10 },
  { id: "11:00", label: "11:00am", hour: 11 },
  { id: "12:00", label: "12:00pm", hour: 12 },
  { id: "14:00", label: "02:00pm", hour: 14 },
  { id: "15:00", label: "03:00pm", hour: 15 },
  { id: "16:00", label: "04:00pm", hour: 16 },
  { id: "17:00", label: "05:00pm", hour: 17 },
  { id: "18:00", label: "06:00pm", hour: 18 },
  { id: "19:00", label: "07:00pm", hour: 19 },
];

/** @deprecated use getTimeSlotsForType */
export const TIME_SLOTS = TIME_SLOTS_PRESENCIAL;

export function getTimeSlotsForType(visitType) {
  return visitType === "virtual" ? TIME_SLOTS_VIRTUAL : TIME_SLOTS_PRESENCIAL;
}

/** Próximos días disponibles (lun–sáb), ~3 semanas */
export function getAvailableVisitDays(count = 21) {
  const days = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (new Date().getHours() >= 17) cursor.setDate(cursor.getDate() + 1);

  while (days.length < count) {
    if (cursor.getDay() !== 0) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function formatVisitDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const weekday = cap(d.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", ""));
  const dayNum = d.getDate();
  const month = cap(d.toLocaleDateString("es-CO", { month: "short" }).replace(".", ""));

  return {
    full: d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" }),
    iso: d.toISOString().slice(0, 10),
    month,
    dayNum,
    weekday,
  };
}

export function getSlotById(slotId, visitType = "presencial") {
  return getTimeSlotsForType(visitType).find((s) => s.id === slotId);
}

export function buildScheduledAt(isoDate, slotId, visitType = "presencial") {
  const slot = getSlotById(slotId, visitType);
  const d = new Date(`${isoDate}T12:00:00`);
  d.setHours(slot?.hour ?? 10, 0, 0, 0);
  return d.toISOString();
}

export function formatVisitSummary(isoDate, slotId, visitType = "presencial") {
  const day = formatVisitDay(new Date(`${isoDate}T12:00:00`));
  const slot = getSlotById(slotId, visitType);
  const typeLabel = visitType === "virtual" ? "Visita virtual" : "Visita presencial";
  return {
    dayLabel: day.full,
    slotLabel: slot?.label ?? "",
    typeLabel,
  };
}
