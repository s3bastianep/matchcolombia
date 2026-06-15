export const VISIT_TYPES = [
  { id: "presencial", label: "Visita presencial" },
  { id: "virtual", label: "Visita virtual" },
];

export const SLOT_DURATION_MIN = 25;
export const MIN_LEAD_MINUTES = 75;
export const MAX_VISITS_PER_SLOT = 2;

const ACTIVE_VISIT_STATUSES = new Set(["pendiente", "confirmada", "reprogramada"]);

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatSlotLabel(hour, minute) {
  const h12 = hour % 12 || 12;
  const suffix = hour < 12 ? "am" : "pm";
  return minute === 0 ? `${h12}:00${suffix}` : `${h12}:${pad2(minute)}${suffix}`;
}

function generateSlots(startHour, startMin, endHour, endMin, skipHours = []) {
  const slots = [];
  let cursor = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;

  while (cursor + SLOT_DURATION_MIN <= end) {
    const hour = Math.floor(cursor / 60);
    const minute = cursor % 60;
    if (!skipHours.includes(hour)) {
      const id = `${pad2(hour)}:${pad2(minute)}`;
      slots.push({ id, label: formatSlotLabel(hour, minute), hour, minute });
    }
    cursor += SLOT_DURATION_MIN;
  }
  return slots;
}

export const TIME_SLOTS_PRESENCIAL = generateSlots(9, 0, 18, 0);
export const TIME_SLOTS_VIRTUAL = generateSlots(10, 0, 19, 0, [13]);

/** @deprecated use getTimeSlotsForType */
export const TIME_SLOTS = TIME_SLOTS_PRESENCIAL;

export function getTimeSlotsForType(visitType) {
  return visitType === "virtual" ? TIME_SLOTS_VIRTUAL : TIME_SLOTS_PRESENCIAL;
}

/** Próximos días disponibles (lun–sáb), ~3 semanas */
export function getAvailableVisitDays(count = 21, now = new Date()) {
  const days = [];
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (now.getHours() >= 17) cursor.setDate(cursor.getDate() + 1);

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
  const [h, m] = (slot?.id || slotId || "10:00").split(":").map(Number);
  const d = new Date(`${isoDate}T12:00:00`);
  d.setHours(h, m || 0, 0, 0);
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

export function isActiveVisitStatus(status) {
  return ACTIVE_VISIT_STATUSES.has(status);
}

export function countPropertyVisitsAtSlot(visits, propertyId, scheduledAtIso) {
  const target = new Date(scheduledAtIso).getTime();
  return (visits || []).filter((v) => {
    if (v.property_id !== propertyId) return false;
    if (!isActiveVisitStatus(v.status)) return false;
    return new Date(v.scheduled_at).getTime() === target;
  }).length;
}

export function isSlotTooSoon(scheduledAtIso, now = new Date()) {
  const scheduled = new Date(scheduledAtIso).getTime();
  return scheduled - now.getTime() < MIN_LEAD_MINUTES * 60 * 1000;
}

export function getSlotAvailability(visits, propertyId, isoDate, slotId, visitType, now = new Date()) {
  const scheduledAt = buildScheduledAt(isoDate, slotId, visitType);
  const scheduled = new Date(scheduledAt);

  if (scheduled.getDay() === 0) {
    return { available: false, reason: "domingo", spotsLeft: 0, booked: 0 };
  }

  if (isSlotTooSoon(scheduledAt, now)) {
    return { available: false, reason: "anticipacion", spotsLeft: 0, booked: 0 };
  }

  const booked = countPropertyVisitsAtSlot(visits, propertyId, scheduledAt);
  const spotsLeft = Math.max(0, MAX_VISITS_PER_SLOT - booked);

  return {
    available: spotsLeft > 0,
    reason: spotsLeft === 0 ? "completo" : null,
    spotsLeft,
    booked,
    scheduledAt,
  };
}

/** Horarios disponibles para una fecha, propiedad y tipo de visita */
export function getAvailableSlotsForDate(visits, propertyId, isoDate, visitType, now = new Date()) {
  return getTimeSlotsForType(visitType).map((slot) => {
    const meta = getSlotAvailability(visits, propertyId, isoDate, slot.id, visitType, now);
    return { ...slot, ...meta };
  });
}

export function validateVisitBooking({ scheduledAt, propertyId, existingVisits, now = new Date() }) {
  const scheduled = new Date(scheduledAt);
  if (Number.isNaN(scheduled.getTime())) {
    throw new Error("Fecha u hora de visita inválida.");
  }
  if (scheduled.getDay() === 0) {
    throw new Error("No agendamos visitas los domingos.");
  }
  if (isSlotTooSoon(scheduledAt, now)) {
    throw new Error("Debes agendar con al menos 1 hora y 15 minutos de anticipación.");
  }
  const booked = countPropertyVisitsAtSlot(existingVisits, propertyId, scheduledAt);
  if (booked >= MAX_VISITS_PER_SLOT) {
    throw new Error("Este horario ya está completo (máximo 2 personas por franja de 25 min).");
  }
}

export const VISIT_RULES_HINT =
  "Cada visita dura 25 min. Mínimo 1 h 15 min de anticipación. Hasta 2 personas por horario.";
