import { ADMIN } from "../data/config";

/**
 * Admin gate.
 *
 * IMPORTANT: this runs entirely in the browser. The password hash ships inside
 * the JavaScript bundle, so a determined visitor can extract and brute-force it.
 * It keeps casual visitors out of /admin; it is NOT real access control.
 *
 * For genuine protection use one of:
 *   - your host's own password protection (Netlify, Vercel, Cloudflare Access)
 *   - a backend that checks the password server-side
 * Both are described in the README.
 */

const SESSION_KEY = "po_admin_session";
const SESSION_HOURS = 12;

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signIn(password: string): Promise<boolean> {
  const hash = await sha256(password + ADMIN.salt);
  if (hash !== ADMIN.passwordHash) return false;
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  try {
    sessionStorage.setItem(SESSION_KEY, String(expires));
  } catch {
    /* session still valid in memory for this page view */
  }
  return true;
}

export function isSignedIn(): boolean {
  try {
    const expires = Number(sessionStorage.getItem(SESSION_KEY) ?? 0);
    return expires > Date.now();
  } catch {
    return false;
  }
}

export function signOut(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* nothing to clear */
  }
}

/** Helper for the owner: prints the hash for a chosen password. */
export async function hashFor(password: string): Promise<string> {
  return sha256(password + ADMIN.salt);
}
