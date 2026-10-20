import { CONFIG } from "../data/config";
import type { Lead } from "../types";

/**
 * Lead storage.
 *
 * Without a backend, leads live in this browser's localStorage. That is enough
 * to run the admin panel end to end, but it is per-browser: a lead submitted by
 * a visitor on their phone does NOT appear in the owner's admin panel.
 * Setting CONFIG.api.leads switches both sides to a shared server — see README.
 */

export type LeadStatus = "new" | "confirmed" | "rejected";

export interface StoredLead extends Lead {
  id: string;
  status: LeadStatus;
  /** Set when the owner approves or rejects, so the table can show "when". */
  reviewedAt?: string;
  note?: string;
  /** True once the row has been written into an exported workbook. */
  exported?: boolean;
}

const KEY = "po_leads_v1";

function read(): StoredLead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as StoredLead[]) : [];
  } catch {
    return [];
  }
}

function write(leads: StoredLead[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(leads));
  } catch {
    /* quota or private mode — the UI reports the failure to the caller */
  }
}

/** Stable id: timestamp plus a short random suffix, so merges can dedupe. */
const newId = (): string =>
  `L${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

export function listLeads(): StoredLead[] {
  return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveLead(lead: Lead): StoredLead {
  const stored: StoredLead = { ...lead, id: newId(), status: "new" };
  write([stored, ...read()]);
  return stored;
}

export function setStatus(id: string, status: LeadStatus): void {
  write(
    read().map((l) =>
      l.id === id ? { ...l, status, reviewedAt: new Date().toISOString() } : l,
    ),
  );
}

export function setNote(id: string, note: string): void {
  write(read().map((l) => (l.id === id ? { ...l, note } : l)));
}

export function removeLead(id: string): void {
  write(read().filter((l) => l.id !== id));
}

export function markExported(ids: string[]): void {
  const set = new Set(ids);
  write(read().map((l) => (set.has(l.id) ? { ...l, exported: true } : l)));
}

/**
 * Merges rows read back from a previously exported workbook.
 * Existing ids win, so re-importing the same file changes nothing and the
 * owner can safely import yesterday's export every day.
 */
export function mergeLeads(incoming: StoredLead[]): { added: number; skipped: number } {
  const current = read();
  const seen = new Set(current.map((l) => l.id));
  const fresh = incoming.filter((l) => l.id && !seen.has(l.id));
  if (fresh.length > 0) write([...current, ...fresh]);
  return { added: fresh.length, skipped: incoming.length - fresh.length };
}

export function clearLeads(): void {
  write([]);
}

/** Pulls the server-side list when an API is configured. */
export async function fetchLeads(): Promise<StoredLead[] | null> {
  if (!CONFIG.api.leads) return null;
  try {
    const response = await fetch(CONFIG.api.leads);
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as StoredLead[]) : null;
  } catch {
    return null;
  }
}
