/** Datos demo para paneles admin, inquilino y propietario */
import { DEFAULT_WHATSAPP_TEMPLATES } from "../lib/adminConstants";

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

export function getPortalSeedData(propertyIds = []) {
  const prop1 = propertyIds[0] || "prop-seed-1";
  const prop2 = propertyIds[1] || "prop-seed-2";
  const now = new Date();

  const inquiries = [
    {
      id: "inq-seed-1",
      property_id: prop1,
      user_id: "user-seeker-demo",
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
      notes: "Visita presencial — acompañar al edificio",
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
      id: "msg-seed-1",
      property_id: prop1,
      user_id: "user-seeker-demo",
      sender_role: "user",
      body: "Hola, ¿el apartamento incluye parqueadero?",
      created_date: new Date(now - 86400000 * 1).toISOString(),
      read: true,
    },
    {
      id: "msg-seed-2",
      property_id: prop1,
      user_id: "user-seeker-demo",
      sender_role: "admin",
      body: "¡Hola Laura! Sí, incluye un parqueadero cubierto. ¿Te gustaría agendar una visita?",
      created_date: new Date(now - 86400000 * 0.5).toISOString(),
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
      title: "Nevera no enfría bien",
      description: "Desde ayer la nevera no mantiene temperatura. Adjunto foto del panel y del compartimento.",
      priority: "alta",
      status: "pendiente_aprobacion",
      owner_approval: "pendiente",
      estimated_cost: 185000,
      repair_summary: "El técnico revisó el equipo: requiere recarga de gas refrigerante y sellado del compresor. Tiempo estimado de reparación: 1 día.",
      provider_name: "Servitec Bogotá",
      assigned_to: "admin",
      images: [
        "https://images.pexels.com/photos/2343466/pexels-photo-2343466.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/4099237/pexels-photo-4099237.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      timeline: [
        { at: new Date(now - 86400000 * 2).toISOString(), text: "Inquilino reportó que la nevera no enfría.", by: "inquilino" },
        { at: new Date(now - 86400000 * 1.5).toISOString(), text: "Técnico visitó el inmueble e inspeccionó el equipo.", by: "admin" },
        { at: new Date(now - 86400000).toISOString(), text: "Cotización de $185.000 enviada al propietario para aprobación.", by: "admin" },
      ],
      created_date: new Date(now - 86400000 * 2).toISOString(),
    },
    {
      id: "ticket-seed-2",
      property_id: prop2,
      lease_id: "lease-seed-1",
      user_id: "user-tenant-demo",
      title: "Renovación de contrato",
      description: "Quiero renovar por 12 meses más bajo las mismas condiciones.",
      priority: "media",
      status: "abierto",
      owner_approval: null,
      estimated_cost: 0,
      images: [],
      timeline: [
        { at: new Date(now - 86400000).toISOString(), text: "Inquilino solicitó renovación del contrato por 12 meses.", by: "inquilino" },
      ],
      created_date: new Date(now - 86400000).toISOString(),
    },
    {
      id: "ticket-seed-3",
      property_id: prop2,
      lease_id: "lease-seed-1",
      user_id: "user-tenant-demo",
      title: "Grifería cocina con goteo",
      description: "La llave de la cocina gotea desde hace una semana.",
      priority: "media",
      status: "en_proceso",
      owner_approval: "aprobado",
      owner_decided_at: new Date(now - 86400000 * 4).toISOString(),
      estimated_cost: 95000,
      repair_summary: "Cambio de empaques y válvula interna. Reparación aprobada y programada.",
      provider_name: "Plomería Express",
      assigned_to: "admin",
      images: [
        "https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      timeline: [
        { at: new Date(now - 86400000 * 5).toISOString(), text: "Inquilino reportó goteo en grifería.", by: "inquilino" },
        { at: new Date(now - 86400000 * 4.5).toISOString(), text: "Cotización de $95.000 presentada al propietario.", by: "admin" },
        { at: new Date(now - 86400000 * 4).toISOString(), text: "Propietario aprobó la reparación.", by: "propietario" },
        { at: new Date(now - 86400000 * 2).toISOString(), text: "Proveedor confirmó visita para el arreglo.", by: "admin" },
      ],
      created_date: new Date(now - 86400000 * 5).toISOString(),
    },
    {
      id: "ticket-seed-4",
      property_id: prop1,
      lease_id: "lease-seed-1",
      user_id: "user-tenant-demo",
      title: "Pintura hall de entrada",
      description: "Manchas y desgaste en la pared del hall. Ya quedó repintado.",
      priority: "baja",
      status: "resuelto",
      owner_approval: "aprobado",
      owner_decided_at: new Date(now - 86400000 * 12).toISOString(),
      estimated_cost: 320000,
      repair_summary: "Retoque de pintura en hall y esquinas. Trabajo completado.",
      provider_name: "Pinturas DC",
      images: [
        "https://images.pexels.com/photos/584399/living-room-584399.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      timeline: [
        { at: new Date(now - 86400000 * 14).toISOString(), text: "Solicitud de retoque de pintura.", by: "inquilino" },
        { at: new Date(now - 86400000 * 12).toISOString(), text: "Propietario aprobó cotización de $320.000.", by: "propietario" },
        { at: new Date(now - 86400000 * 8).toISOString(), text: "Reparación ejecutada y verificada.", by: "admin" },
      ],
      resolved_at: new Date(now - 86400000 * 8).toISOString(),
      created_date: new Date(now - 86400000 * 14).toISOString(),
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
    { id: "poi-3", city: "Barranquilla", neighborhood: "Riomar", name: "Buenavista", category: "Comercio", created_date: now.toISOString() },
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
