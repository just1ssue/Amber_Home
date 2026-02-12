export const DAY_MS = 24 * 60 * 60 * 1000;

export function nowMs() {
  return Date.now();
}

export function isExpired(ts, days) {
  return nowMs() - ts > days * DAY_MS;
}
