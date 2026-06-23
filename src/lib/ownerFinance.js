/** Métricas financieras del panel propietario */

export function formatCOP(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatPercent(value, digits = 1) {
  if (value == null || Number.isNaN(value)) return "N/D";
  return `${value.toFixed(digits)}%`;
}

function getPropertyValue(property) {
  return Number(property?.purchase_value) || Number(property?.monthly_rent || 0) * 200;
}

function isMaintenanceCost(ticket) {
  if (!ticket.estimated_cost || ticket.estimated_cost <= 0) return false;
  if (ticket.owner_approval === "rechazado") return false;
  return (
    ticket.owner_approval === "aprobado" ||
    ticket.status === "resuelto" ||
    ticket.status === "en_proceso"
  );
}

function ownerPropertyIds(properties, leases, ownerUserId) {
  const fromProps = properties.filter((p) => p.owner_user_id === ownerUserId).map((p) => p.id);
  const fromLeases = leases.filter((l) => l.owner_user_id === ownerUserId).map((l) => l.property_id);
  return [...new Set([...fromProps, ...fromLeases])];
}

function incomeFromPayment(payment, leaseById) {
  if (payment.status !== "pagado") return 0;
  const lease = leaseById.get(payment.lease_id);
  if (!lease) return 0;
  return Number(lease.monthly_rent) || 0;
}

export function computeOwnerFinance({ ownerUserId, properties = [], leases = [], payments = [], tickets = [] }) {
  if (!ownerUserId) {
    return { summary: null, properties: [] };
  }

  const ownerLeases = leases.filter((l) => l.owner_user_id === ownerUserId);
  const propIds = ownerPropertyIds(properties, ownerLeases, ownerUserId);
  const ownerProperties = properties.filter((p) => propIds.includes(p.id));
  const leaseById = new Map(ownerLeases.map((l) => [l.id, l]));

  const ownerPayments = payments.filter((p) => leaseById.has(p.lease_id));
  const ownerTickets = tickets.filter((t) => propIds.includes(t.property_id));

  const totalIncome = ownerPayments.reduce((sum, p) => sum + incomeFromPayment(p, leaseById), 0);
  const totalMaintenance = ownerTickets
    .filter(isMaintenanceCost)
    .reduce((sum, t) => sum + Number(t.estimated_cost || 0), 0);
  const netEarnings = totalIncome - totalMaintenance;
  const timesRented = ownerLeases.length;
  const totalPropertyValue = ownerProperties.reduce((sum, p) => sum + getPropertyValue(p), 0);

  const annualRent = ownerLeases
    .filter((l) => l.status === "activo")
    .reduce((sum, l) => sum + Number(l.monthly_rent || 0), 0) * 12;

  const grossAnnualYield = totalPropertyValue > 0 ? (annualRent / totalPropertyValue) * 100 : 0;
  const cumulativeRoi = totalPropertyValue > 0 ? (netEarnings / totalPropertyValue) * 100 : 0;
  const netAnnualYield =
    totalPropertyValue > 0 && annualRent > 0
      ? ((annualRent - totalMaintenance) / totalPropertyValue) * 100
      : grossAnnualYield;

  const byProperty = propIds.map((propertyId) => {
    const property = properties.find((p) => p.id === propertyId) || { id: propertyId, title: "Inmueble" };
    const propLeases = ownerLeases.filter((l) => l.property_id === propertyId);
    const propLeaseIds = new Set(propLeases.map((l) => l.id));
    const propPayments = ownerPayments.filter((p) => propLeaseIds.has(p.lease_id));
    const propTickets = ownerTickets.filter((t) => t.property_id === propertyId);

    const income = propPayments.reduce((sum, p) => sum + incomeFromPayment(p, leaseById), 0);
    const maintenance = propTickets.filter(isMaintenanceCost).reduce((sum, t) => sum + Number(t.estimated_cost || 0), 0);
    const value = getPropertyValue(property);
    const activeLease = propLeases.find((l) => l.status === "activo");
    const monthlyRent = activeLease?.monthly_rent || propLeases[0]?.monthly_rent || property.monthly_rent || 0;
    const annual = Number(monthlyRent) * 12;
    const net = income - maintenance;

    return {
      property,
      value,
      monthlyRent,
      timesRented: propLeases.length,
      totalIncome: income,
      maintenanceCost: maintenance,
      netEarnings: net,
      grossYield: value > 0 ? (annual / value) * 100 : 0,
      cumulativeRoi: value > 0 ? (net / value) * 100 : 0,
      incomeShare: totalIncome > 0 ? (income / totalIncome) * 100 : 0,
    };
  });

  return {
    summary: {
      totalIncome,
      totalMaintenance,
      netEarnings,
      timesRented,
      totalPropertyValue,
      annualRent,
      grossAnnualYield,
      netAnnualYield,
      cumulativeRoi,
      propertyCount: propIds.length,
      paidMonths: ownerPayments.filter((p) => p.status === "pagado").length,
    },
    properties: byProperty,
    ownerLeases,
    ownerPayments,
    ownerTickets,
    leaseById,
  };
}

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatMonthKey(iso) {
  if (!iso) return null;
  const [y, m] = iso.split("-");
  if (!y || !m) return null;
  return `${y}-${m.padStart(2, "0")}`;
}

function formatMonthLabel(period) {
  const [y, m] = period.split("-");
  const idx = Number(m) - 1;
  return `${MONTH_LABELS[idx] || m} ${y?.slice(2) || ""}`.trim();
}

/** Serie mensual de ingresos y gastos (últimos 12 meses) */
export function buildMonthlyCashflow(ownerPayments, ownerTickets, leaseById, months = 12) {
  const incomeByMonth = new Map();
  const expenseByMonth = new Map();

  ownerPayments.forEach((p) => {
    if (p.status !== "pagado") return;
    const key = formatMonthKey(p.period || p.paid_at?.slice(0, 7));
    if (!key) return;
    incomeByMonth.set(key, (incomeByMonth.get(key) || 0) + incomeFromPayment(p, leaseById));
  });

  ownerTickets.filter(isMaintenanceCost).forEach((t) => {
    const raw = t.resolved_at || t.owner_decided_at || t.created_date;
    const key = formatMonthKey(raw?.slice(0, 7));
    if (!key) return;
    expenseByMonth.set(key, (expenseByMonth.get(key) || 0) + Number(t.estimated_cost || 0));
  });

  const allKeys = [...new Set([...incomeByMonth.keys(), ...expenseByMonth.keys()])].sort();
  const recent = allKeys.slice(-months);

  return recent.map((key) => ({
    period: key,
    label: formatMonthLabel(key),
    ingresos: incomeByMonth.get(key) || 0,
    gastos: expenseByMonth.get(key) || 0,
    neto: (incomeByMonth.get(key) || 0) - (expenseByMonth.get(key) || 0),
  }));
}

/** Distribución de ingresos por inmueble */
export function buildPropertyIncomeSplit(byProperty) {
  return byProperty
    .filter((p) => p.totalIncome > 0)
    .map((p) => ({
      name: (p.property.title || "Inmueble").split(" ").slice(0, 3).join(" "),
      value: p.totalIncome,
      fullName: p.property.title,
    }));
}

/** Estado de tickets de mantenimiento */
export function buildTicketStatusSplit(tickets) {
  const labels = {
    pendiente_aprobacion: "Por aprobar",
    abierto: "Abierto",
    en_proceso: "En proceso",
    resuelto: "Finalizado",
    rechazado: "Rechazado",
  };
  const counts = {};
  tickets.forEach((t) => {
    const key = labels[t.status] ? t.status : "abierto";
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).map(([status, count]) => ({
    status,
    label: labels[status] || status,
    count,
  }));
}

/** Comparativo ingresos vs gastos vs valor (para gráfico de barras) */
export function buildPortfolioComparison(summary) {
  if (!summary) return [];
  return [
    { name: "Ingresos", value: summary.totalIncome, fill: "#10b981" },
    { name: "Mantenimiento", value: summary.totalMaintenance, fill: "#f59e0b" },
    { name: "Ganancia neta", value: Math.max(0, summary.netEarnings), fill: "#8B5CF6" },
  ];
}
