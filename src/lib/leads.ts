import { CONFIG } from "../data/config";
import { saveLead } from "./leadStore";
import { track, utm } from "./analytics";
import { normalizePhone, todayISO } from "./format";
import type { Lead, LeadType } from "../types";

export type LeadFields = Record<string, string>;

/**
 * Field-level validation shared by both lead forms. Returns a map of
 * field → message; an empty map means the form is valid.
 */
export function validateLead(values: LeadFields): Record<string, string> {
  const errors: Record<string, string> = {};

  if ((values.name ?? "").trim().length < 2) {
    errors.name = "Ismingizni kiriting.";
  }
  if (!normalizePhone(values.phone ?? "")) {
    errors.phone = "Telefonni to'liq kiriting: +998 90 123 45 67";
  }
  if (values.date && values.date < todayISO()) {
    errors.date = "O'tgan sanani tanlab bo'lmaydi.";
  }
  return errors;
}

/**
 * Sends a lead. While CONFIG.api.leads is null nothing is transmitted — the
 * lead is tracked and logged so the flow is testable without a backend.
 * The caller is told whether it actually reached a server.
 */
export async function submitLead(type: LeadType, values: LeadFields): Promise<{ lead: Lead; delivered: boolean }> {
  const lead: Lead = {
    type,
    name: values.name.trim(),
    phone: normalizePhone(values.phone) ?? values.phone,
    officeId: values.officeId || undefined,
    date: values.date || undefined,
    area: values.area || undefined,
    budget: values.budget || undefined,
    message: values.message?.trim() || undefined,
    page: typeof window === "undefined" ? "/" : window.location.pathname,
    utm,
    createdAt: new Date().toISOString(),
  };

  track(type === "viewing" ? "viewing_request" : "lead_form_submit", {
    leadType: type,
    officeId: lead.officeId,
  });

  // Always keep a local copy so the admin panel has something to show even
  // when no server is configured. With an API set, the server list wins there.
  saveLead(lead);

  if (!CONFIG.api.leads) {
    if (import.meta.env.DEV) console.info("[lead] API yoqilmagan — brauzerda saqlandi:", lead);
    return { lead, delivered: false };
  }

  try {
    const response = await fetch(CONFIG.api.leads, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    return { lead, delivered: response.ok };
  } catch (error) {
    console.warn("[lead] yuborilmadi", error);
    return { lead, delivered: false };
  }
}
