import { getCurrentUserId } from "./localAuth";

const GUEST_KEY = "matchbogota_shortlist";

function getShortlistKey() {
  const userId = getCurrentUserId();
  return userId ? `matchcolombia_shortlist_${userId}` : GUEST_KEY;
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
  window.dispatchEvent(new Event("shortlist-updated"));
  return next.includes(id);
}
