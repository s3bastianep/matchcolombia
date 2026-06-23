/** Datos demo para paneles admin, inquilino y propietario */
import { DEFAULT_WHATSAPP_TEMPLATES } from "../lib/adminConstants.js";

/** Genera historial de pagos pagados para un contrato */
function buildPaidPayments(lease, startYear, startMonth, count) {
  const payments = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date(startYear, startMonth - 1 + i, 5);
    const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    payments.push({
      id: `pay-${lease.id}-${period}`,
      lease_id: lease.id,
      user_id: lease.tenant_user_id,
      amount: lease.monthly_rent + (lease.admin_fee || 0),
      due_date: d.toISOString().slice(0, 10),
      paid_at: new Date(d.getTime() - 86400000 * 3).toISOString(),
      status: "pagado",
      period,
      created_date: new Date(d.getFullYear(), d.getMonth(), 1).toISOString(),
    });
  }
  return payments;
}

/** IDs de tickets demo obsoletos (no mantenimiento) — se eliminan al sincronizar seed */
export const OBSOLETE_DEMO_TICKET_IDS = ["ticket-seed-2", "ticket-seed-3", "ticket-seed-4"];

export function getPortalSeedData(propertyIds = []) {
  const prop1 = propertyIds[0] || "prop-seed-1";
  const prop2 = propertyIds[1] || "prop-seed-2";
  const now = new Date();

  const inquiries = [
    {
      id: "inq-seed-1",
      property_id: prop1,
      user_id: "user-seeker-demo",
      user_name: "Laura Buscadora",
      name: "Laura Méndez",
      email: "laura@email.com",
      phone: "3001234567",
      message: "Me interesa visitar este apartamento el fin de semana.",
      move_in_date: "2026-07-01",
      pipeline_stage: "nuevo",
      status: "nueva",
      source: "web",
      tags: ["presupuesto_ok"],
      internal_notes: "",
      needs_reply: true,
      created_date: new Date(now - 86400000 * 2).toISOString(),
    },
    {
      id: "inq-seed-2",
      property_id: prop2,
      user_id: "user-seeker-demo",
      user_name: "Laura Buscadora",
      name: "Carlos Ruiz",
      email: "carlos@email.com",
      phone: "3109876543",
      message: "¿Está disponible para arriendo inmediato?",
      move_in_date: "2026-06-15",
      pipeline_stage: "visita_agendada",
      status: "contactado",
      source: "whatsapp",
      tags: [],
      internal_notes: "Quiere mudarse en junio",
      needs_reply: false,
      last_reply_at: new Date(now - 86400000).toISOString(),
      created_date: new Date(now - 86400000 * 5).toISOString(),
    },
  ];

  const visits = [
    {
      id: "visit-seed-1",
      property_id: prop1,
      user_id: "user-seeker-demo",
      user_name: "Laura Méndez",
      scheduled_at: new Date(now.getTime() + 86400000 * 2).toISOString(),
      status: "confirmada",
      visit_type: "presencial",
      notes: "Visita presencial. Acompañar al edificio",
      created_date: new Date(now - 86400000).toISOString(),
    },
    {
      id: "visit-seed-2",
      property_id: prop2,
      user_id: "user-seeker-demo",
      user_name: "Carlos Ruiz",
      scheduled_at: new Date(now.getTime() + 86400000 * 4).toISOString(),
      status: "pendiente",
      visit_type: "virtual",
      notes: "",
      created_date: new Date(now - 86400000 * 3).toISOString(),
    },
  ];

  const messages = [
    {
      id: "msg-support-seeker-1",
      property_id: "support",
      user_id: "user-seeker-demo",
      user_name: "Laura Buscadora",
      user_role: "seeker",
      sender_role: "user",
      body: "Hola, ¿me pueden ayudar a comparar dos apartamentos en Chapinero?",
      created_date: new Date(now - 86400000 * 2).toISOString(),
      read: true,
    },
    {
      id: "msg-support-seeker-2",
      property_id: "support",
      user_id: "user-seeker-demo",
      user_name: "Laura Buscadora",
      sender_role: "admin",
      body: "¡Hola Laura! Claro, cuéntanos cuáles viste y te enviamos un resumen con pros y contras.",
      attachments: [],
      created_date: new Date(now - 86400000 * 1.8).toISOString(),
      read: true,
    },
    {
      id: "msg-support-tenant-1",
      property_id: "support",
      user_id: "user-tenant-demo",
      user_name: "Ana Inquilina",
      user_role: "tenant",
      sender_role: "user",
      body: "Buenos días, ¿cuándo me confirman la visita del cerrajero por la llave dañada?",
      created_date: new Date(now - 86400000 * 0.4).toISOString(),
      read: false,
    },
    {
      id: "msg-support-owner-1",
      property_id: "support",
      user_id: "user-owner-demo",
      user_name: "Pedro Propietario",
      user_role: "owner",
      sender_role: "user",
      body: "Hola, quisiera ajustar el canon de mi apartamento en Quinta Camacho. ¿Me confirman el proceso?",
      created_date: new Date(now - 86400000 * 0.2).toISOString(),
      read: false,
    },
  ];

  const applications = [
    {
      id: "app-seed-1",
      property_id: prop1,
      user_id: "user-seeker-demo",
      user_name: "Laura Méndez",
      status: "documentos_enviados",
      documents: [
        { type: "cedula", name: "Cédula.pdf", url: "#", uploaded_at: new Date(now - 86400000).toISOString() },
      ],
      created_date: new Date(now - 86400000 * 4).toISOString(),
    },
  ];

  const leases = [
    {
      id: "lease-seed-prev-1",
      property_id: prop2,
      tenant_user_id: "user-tenant-demo",
      owner_user_id: "user-owner-demo",
      start_date: "2023-06-01",
      end_date: "2024-06-01",
      monthly_rent: 2500000,
      admin_fee: 280000,
      status: "finalizado",
      contract_url: "#",
      created_date: "2023-05-15T00:00:00.000Z",
    },
    {
      id: "lease-seed-prev-2",
      property_id: prop2,
      tenant_user_id: "user-tenant-demo",
      owner_user_id: "user-owner-demo",
      start_date: "2024-06-01",
      end_date: "2025-06-01",
      monthly_rent: 2650000,
      admin_fee: 300000,
      status: "finalizado",
      contract_url: "#",
      created_date: "2024-05-10T00:00:00.000Z",
    },
    {
      id: "lease-seed-1",
      property_id: prop2,
      tenant_user_id: "user-tenant-demo",
      owner_user_id: "user-owner-demo",
      start_date: "2025-06-01",
      end_date: "2026-06-01",
      monthly_rent: 2800000,
      admin_fee: 320000,
      status: "activo",
      contract_url: "#",
      created_date: "2025-05-20T00:00:00.000Z",
    },
    {
      id: "lease-seed-prop1",
      property_id: prop1,
      tenant_user_id: "user-tenant-demo",
      owner_user_id: "user-owner-demo",
      start_date: "2024-01-01",
      end_date: "2025-01-01",
      monthly_rent: 2400000,
      admin_fee: 280000,
      status: "finalizado",
      contract_url: "#",
      created_date: "2023-12-10T00:00:00.000Z",
    },
  ];

  const payments = [
    ...buildPaidPayments(leases[0], 2023, 6, 12),
    ...buildPaidPayments(leases[1], 2024, 6, 12),
    ...buildPaidPayments(leases[2], 2025, 6, 11),
    ...buildPaidPayments(leases[3], 2024, 1, 12),
    {
      id: "pay-seed-pending",
      lease_id: "lease-seed-1",
      user_id: "user-tenant-demo",
      amount: 3120000,
      due_date: "2026-07-05",
      paid_at: null,
      status: "pendiente",
      period: "2026-07",
      created_date: "2026-06-01T00:00:00.000Z",
    },
  ];

  const tickets = [
    {
      id: "ticket-seed-1",
      property_id: prop2,
      lease_id: "lease-seed-1",
      user_id: "user-tenant-demo",
      title: "Llave dañada",
      description:
        "La llave de la puerta principal no gira bien y hoy dejó de abrir por completo. Necesito que la revisen o la cambien.",
      category: "mantenimiento",
      problem_type: "llave",
      visit_date: new Date(now.getTime() + 86400000 * 2).toISOString().slice(0, 10),
      visit_time_slot: "tarde",
      visit_note: "Prefiero después de las 2 p. m.",
      priority: "alta",
      status: "pendiente_aprobacion",
      owner_approval: "pendiente",
      estimated_cost: 75000,
      repair_summary:
        "El cerrajero revisó la cerradura: la llave está desgastada y el cilindro requiere cambio. Tiempo estimado: mismo día.",
      provider_name: "Cerrajería Segura Bogotá",
      assigned_to: "admin",
      images: [
        "https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      timeline: [
        {
          at: new Date(now - 86400000 * 2).toISOString(),
          text: "Inquilino reportó llave dañada en la puerta principal.",
          by: "inquilino",
        },
        {
          at: new Date(now - 86400000 * 1.5).toISOString(),
          text: "Cerrajero visitó el inmueble e inspeccionó la cerradura.",
          by: "admin",
        },
        {
          at: new Date(now - 86400000).toISOString(),
          text: "Cotización de $75.000 enviada al propietario para aprobación.",
          by: "admin",
        },
      ],
      created_date: new Date(now - 86400000 * 2).toISOString(),
    },
  ];

  const owners = [
    {
      id: "owner-seed-1",
      user_id: "user-owner-demo",
      name: "Pedro Propietario",
      email: "propietario@demo.co",
      phone: "3001112233",
      verification_status: "verificado",
      documents: [
        { type: "cedula", name: "Cédula.pdf", url: "#", uploaded_at: new Date(now - 86400000 * 30).toISOString() },
        { type: "propiedad", name: "Certificado tradición.pdf", url: "#", uploaded_at: new Date(now - 86400000 * 28).toISOString() },
      ],
      internal_notes: "Verificado en oficina. Propietario recurrente.",
      created_date: new Date(now - 86400000 * 60).toISOString(),
    },
    {
      id: "owner-seed-2",
      user_id: "user-owner-pending",
      name: "Ana Dueña",
      email: "ana@email.com",
      phone: "3105558899",
      verification_status: "pendiente",
      documents: [{ type: "cedula", name: "Cédula Ana.pdf", url: "#", uploaded_at: new Date(now - 86400000).toISOString() }],
      internal_notes: "Falta certificado de tradición.",
      created_date: new Date(now - 86400000 * 3).toISOString(),
    },
  ];

  const pois = [
    { id: "poi-1", city: "Bogotá", neighborhood: "Chapinero", name: "Parque 93", category: "Parque", created_date: now.toISOString() },
    { id: "poi-2", city: "Bogotá", neighborhood: "Chapinero", name: "Centro Andino", category: "Comercio", created_date: now.toISOString() },
    { id: "poi-3", city: "Bogotá", neighborhood: "Usaquén", name: "Centro comercial", category: "Comercio", created_date: now.toISOString() },
  ];

  const settings = {
    whatsapp_templates: DEFAULT_WHATSAPP_TEMPLATES,
    blocked_visit_slots: [],
    site_logo: null,
    admin_users: [
      { username: "admin", name: "Administrador", role: "super", permissions: ["all"] },
    ],
  };

  return { inquiries, visits, messages, applications, leases, payments, tickets, owners, pois, settings };
}
