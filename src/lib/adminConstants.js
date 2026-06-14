export const PROPERTY_WORKFLOW = [
  { key: "borrador", label: "Borrador" },
  { key: "en_revision", label: "En revisión" },
  { key: "publicada", label: "Publicada" },
  { key: "en_proceso", label: "En proceso" },
  { key: "arrendada", label: "Arrendada" },
  { key: "archivada", label: "Archivada" },
];

export const LEAD_PIPELINE = [
  { key: "nuevo", label: "Nuevo" },
  { key: "contactado", label: "Contactado" },
  { key: "visita_agendada", label: "Visita agendada" },
  { key: "visitado", label: "Visitado" },
  { key: "aplicacion_enviada", label: "Aplicación enviada" },
  { key: "revision_documentos", label: "Revisión docs" },
  { key: "aprobado", label: "Aprobado" },
  { key: "cerrado", label: "Cerrado" },
  { key: "perdido", label: "Perdido" },
];

export const OWNER_VERIFICATION = [
  { key: "pendiente", label: "Pendiente" },
  { key: "en_revision", label: "En revisión" },
  { key: "verificado", label: "Verificado" },
  { key: "rechazado", label: "Rechazado" },
];

export const APPLICATION_STATUSES = [
  { key: "interesado", label: "Interesado" },
  { key: "documentos_enviados", label: "Docs enviados" },
  { key: "en_revision", label: "En evaluación" },
  { key: "aprobado", label: "Aprobado" },
  { key: "rechazado", label: "Rechazado" },
];

export const APPLICATION_DOC_TYPES = [
  { key: "cedula", label: "Cédula" },
  { key: "ingresos", label: "Certificado laboral / ingresos" },
  { key: "referencias", label: "Referencias" },
];

export const PHOTO_CATEGORIES = ["Sala", "Cocina", "Habitación", "Baño", "Balcón", "Exterior", "Otro"];

export const VISIT_TYPES = [
  { key: "presencial", label: "Presencial" },
  { key: "virtual", label: "Virtual" },
];

export const DEFAULT_WHATSAPP_TEMPLATES = [
  { id: "tpl-1", name: "Confirmar visita", body: "Hola {{nombre}}, confirmamos tu visita el {{fecha}} a las {{hora}}. Te esperamos." },
  { id: "tpl-2", name: "Solicitar documentos", body: "Hola {{nombre}}, para continuar con tu aplicación necesitamos tus documentos. ¿Puedes subirlos en tu portal?" },
  { id: "tpl-3", name: "Aprobación", body: "¡Buenas noticias {{nombre}}! Tu aplicación fue aprobada. Te contactamos para firmar." },
];

export function workflowToPublicStatus(workflow) {
  const map = {
    publicada: "disponible",
    en_proceso: "en_proceso",
    arrendada: "arrendado",
    archivada: "vendido",
    borrador: "borrador",
    en_revision: "en_revision",
  };
  return map[workflow] || workflow;
}
