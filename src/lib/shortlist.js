import { getCurrentUserId } from "./authUser";

const GUEST_KEY = "matchbogota_shortlist";

function getShortlistKey() {
  const userId = getCurrentUserId();
  return userId ? `habibar_shortlist_${userId}` : GUEST_KEY;
}

export function getShortlist() {
  try {
    return JSON.parse(localStorage.getItem(getShortlistKey()) || "[]");
  } catch {
    return [];
  }
}

export function isInShortlist(id) {
  return getShortlist().includes(id);
}

export function toggleShortlist(id) {
  const key = getShortlistKey();
  const list = getShortlist();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("shortlist-updated", { detail: { propertyId: id } }));
  return next.includes(id);
}

/** Fusiona favoritos de invitado al iniciar sesión. */
export function mergeGuestShortlistIntoUser(userId) {
  if (!userId) return;
  try {
    const guestRaw = localStorage.getItem(GUEST_KEY);
    if (!guestRaw) return;
    const guestIds = JSON.parse(guestRaw);
    if (!Array.isArray(guestIds) || !guestIds.length) return;

    const userKey = `habibar_shortlist_${userId}`;
    const userIds = JSON.parse(localStorage.getItem(userKey) || "[]");
    const merged = [...new Set([...userIds, ...guestIds])];
    localStorage.setItem(userKey, JSON.stringify(merged));
    localStorage.removeItem(GUEST_KEY);
    window.dispatchEvent(new CustomEvent("shortlist-updated", { detail: { all: true } }));
  } catch {
    /* ignore corrupt storage */
  }
}
