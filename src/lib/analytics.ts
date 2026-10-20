/**
 * Campaign attribution and event tracking.
 *
 * UTM parameters are captured once per session so a lead submitted three pages
 * later still carries the campaign that brought the visitor in.
 *
 * Events go to window.dataLayer, which GTM reads. To use GA4 or Meta Pixel
 * directly, add the call inside `track` — the rest of the app is unaffected.
 */

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STORAGE_KEY = "po_utm";

function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    stored = {};
  }
  const params = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) stored[key] = value;
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* private mode — attribution is best-effort */
  }
  return stored;
}

export const utm = readUtm();

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, data: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });
  if (import.meta.env.DEV) console.debug("[track]", event, data);
}
