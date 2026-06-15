/** Datos demo para paneles admin, inquilino y propietario */
import { DEFAULT_WHATSAPP_TEMPLATES } from "../lib/adminConstants";

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
  ];

  const payments = [
    {
      id: "pay-seed-1",
      lease_id: "lease-seed-1",
      user_id: "user-tenant-demo",
      amount: 3120000,
      due_date: "2026-06-05",
      paid_at: "2026-05-28T00:00:00.000Z",
      status: "pagado",
      period: "2026-06",
      created_date: "2026-05-01T00:00:00.000Z",
    },
    {
      id: "pay-seed-2",
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
      description: "Desde ayer la nevera no mantiene temperatura. Adjunto foto.",
      priority: "alta",
      status: "en_proceso",
      assigned_to: "admin",
      images: [],
      created_date: new Date(now - 86400000 * 2).toISOString(),
    },
    {
      id: "ticket-seed-2",
      property_id: prop2,
      lease_id: "lease-seed-1",
      user_id: "user-tenant-demo",
      title: "Renovación de contrato",
      description: "Quiero renovar por 12 meses más.",
      priority: "media",
      status: "abierto",
      images: [],
      created_date: new Date(now - 86400000).toISOString(),
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
