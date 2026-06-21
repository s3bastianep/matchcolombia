const KEY = "habibar_admin_notifications";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("admin-notifications-updated"));
}

export function getAdminNotifications() {
  return load();
}

export function getUnreadAdminCount() {
  return load().filter((n) => !n.read).length;
}

export function pushAdminNotification({ type, title, message, link, entityId }) {
  const items = load();
  items.unshift({
    id: `adm-notif-${Date.now()}`,
    type,
    title,
    message,
    link: link || null,
    entity_id: entityId || null,
    read: false,
    created_at: new Date().toISOString(),
  });
  save(items.slice(0, 100));
}

export function markAdminNotificationRead(id) {
  save(load().map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllAdminNotificationsRead() {
  save(load().map((n) => ({ ...n, read: true })));
}

const SEEDED_KEY = "habibar_admin_notif_seeded";

export function seedAdminNotificationsIfNeeded() {
  if (localStorage.getItem(SEEDED_KEY)) return;
  pushAdminNotification({ type: "lead", title: "Nuevo lead sin responder", message: "Laura Méndez espera respuesta.", link: "/admin/leads" });
  pushAdminNotification({ type: "owner", title: "Verificación pendiente", message: "Ana Dueña envió documentos.", link: "/admin/propietarios" });
  pushAdminNotification({ type: "visit", title: "Visita pendiente", message: "Carlos Ruiz — confirmar visita virtual.", link: "/admin/visitas" });
  localStorage.setItem(SEEDED_KEY, "1");
}
