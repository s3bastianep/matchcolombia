const NOTIF_KEY = "matchcolombia_unread_updates";

function load() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("process-notifications-updated"));
}

export function getUnreadCount() {
  return load().filter((n) => !n.read).length;
}

export function pushProcessUpdate({ propertyId, propertyTitle, type = "visit", message }) {
  const items = load();
  items.unshift({
    id: `notif-${Date.now()}`,
    property_id: propertyId,
    property_title: propertyTitle,
    type,
    message,
    read: false,
    created_at: new Date().toISOString(),
  });
  save(items.slice(0, 50));
}

export function markAllRead() {
  save(load().map((n) => ({ ...n, read: true })));
}

export function markPropertyRead(propertyId) {
  save(load().map((n) => (n.property_id === propertyId ? { ...n, read: true } : n)));
}
