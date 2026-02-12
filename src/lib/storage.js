import { isExpired } from "./time.js";

const KEY_FAV = "amber_home:favorites:v1";
const KEY_RECENT = "amber_home:recent:v1";

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(KEY_FAV);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids) {
  localStorage.setItem(KEY_FAV, JSON.stringify(ids));
}

export function toggleFavorite(id) {
  const favs = loadFavorites();
  const exists = favs.includes(id);
  // “移動なし”：追加は末尾、削除は除外
  const next = exists ? favs.filter((x) => x !== id) : [...favs, id];
  saveFavorites(next);
  return next;
}

export function loadRecent({ maxKeep = 20, expireDays = 90 } = {}) {
  try {
    const raw = localStorage.getItem(KEY_RECENT);
    const arr = raw ? JSON.parse(raw) : [];
    const safe = Array.isArray(arr) ? arr : [];

    // cleanup: invalid + expired
    const filtered = safe
      .filter((x) => x && typeof x.id === "string" && typeof x.ts === "number")
      .filter((x) => !isExpired(x.ts, expireDays));

    // sort desc by last access
    filtered.sort((a, b) => b.ts - a.ts);

    // keep max
    const clamped = filtered.slice(0, maxKeep);

    // persist cleaned
    localStorage.setItem(KEY_RECENT, JSON.stringify(clamped));
    return clamped;
  } catch {
    return [];
  }
}

export function pushRecent(id, { maxKeep = 20 } = {}) {
  const ts = Date.now();
  const current = loadRecent({ maxKeep }); // includes cleanup
  const deduped = current.filter((x) => x.id !== id);
  const next = [{ id, ts }, ...deduped].slice(0, maxKeep);
  localStorage.setItem(KEY_RECENT, JSON.stringify(next));
  return next;
}
