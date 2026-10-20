import * as XLSX from "xlsx";
import { prettyPhone } from "./format";
import type { StoredLead } from "./leadStore";

/**
 * Excel export and import.
 *
 * Export always writes the COMPLETE list, so each day's file supersedes the
 * previous one rather than sitting beside it. Import reads a file back and
 * merges by id, which is what makes "add today's lead to yesterday's file"
 * work: import yesterday's workbook, then export again.
 */

const SHEET = "Arizalar";

const STATUS_LABEL: Record<StoredLead["status"], string> = {
  new: "Yangi",
  confirmed: "Tasdiqlangan",
  rejected: "Rad etilgan",
};

const TYPE_LABEL: Record<string, string> = {
  viewing: "Ko'rishga yozildi",
  finder: "Ofis topib berish",
};

/** Column order is the contract with the import side — keep them in sync. */
const HEADERS = [
  "ID", "Sana", "Vaqt", "Ism", "Telefon", "Holati", "Ariza turi",
  "Ofis", "Ofis ID", "Qulay sana", "Maydon", "Budjet", "Izoh", "Manba", "Kampaniya", "Menejer izohi",
] as const;

function toRow(lead: StoredLead, officeLabel: (id?: string) => string) {
  const created = new Date(lead.createdAt);
  return {
    ID: lead.id,
    Sana: created.toLocaleDateString("uz-UZ"),
    Vaqt: created.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
    Ism: lead.name,
    Telefon: prettyPhone(lead.phone),
    Holati: STATUS_LABEL[lead.status],
    "Ariza turi": TYPE_LABEL[lead.type] ?? lead.type,
    Ofis: officeLabel(lead.officeId),
    "Ofis ID": lead.officeId ?? "",
    "Qulay sana": lead.date ?? "",
    Maydon: lead.area ?? "",
    Budjet: lead.budget ?? "",
    Izoh: lead.message ?? "",
    Manba: lead.utm?.utm_source ?? "To'g'ridan-to'g'ri",
    Kampaniya: lead.utm?.utm_campaign ?? "",
    "Menejer izohi": lead.note ?? "",
  };
}

export function exportLeads(
  leads: StoredLead[],
  officeLabel: (id?: string) => string,
  fileName = "arizalar",
): void {
  const rows = leads
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((l) => toRow(l, officeLabel));

  const sheet = XLSX.utils.json_to_sheet(rows, { header: [...HEADERS] });

  // Column widths, so the file is readable the moment it opens.
  sheet["!cols"] = [
    { wch: 14 }, { wch: 11 }, { wch: 7 }, { wch: 18 }, { wch: 18 }, { wch: 14 },
    { wch: 20 }, { wch: 30 }, { wch: 9 }, { wch: 12 }, { wch: 14 }, { wch: 14 },
    { wch: 40 }, { wch: 16 }, { wch: 16 }, { wch: 30 },
  ];
  sheet["!autofilter"] = { ref: XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: rows.length, c: HEADERS.length - 1 },
  }) };

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, SHEET);
  XLSX.writeFile(book, `${fileName}-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/** Reverse of toRow. Unknown or malformed rows are dropped rather than guessed. */
export async function importLeads(file: File): Promise<StoredLead[]> {
  const buffer = await file.arrayBuffer();
  const book = XLSX.read(buffer, { type: "array" });
  const sheet = book.Sheets[SHEET] ?? book.Sheets[book.SheetNames[0]];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  const statusFrom = (value: string): StoredLead["status"] =>
    value === "Tasdiqlangan" ? "confirmed" : value === "Rad etilgan" ? "rejected" : "new";

  return rows.flatMap<StoredLead>((row) => {
    const id = String(row.ID ?? "").trim();
    const name = String(row.Ism ?? "").trim();
    const phone = String(row.Telefon ?? "").trim();
    if (!id || !name || !phone) return [];

    // Reconstruct an ISO timestamp from the date and time columns when possible.
    const date = String(row.Sana ?? "");
    const time = String(row.Vaqt ?? "00:00");
    const parts = date.split(/[./-]/).map(Number);
    const iso = parts.length === 3 && parts.every((n) => !Number.isNaN(n))
      ? new Date(
          parts[2] > 31 ? parts[2] : parts[0],
          (parts[2] > 31 ? parts[1] : parts[1]) - 1,
          parts[2] > 31 ? parts[0] : parts[2],
          Number(time.split(":")[0]) || 0,
          Number(time.split(":")[1]) || 0,
        ).toISOString()
      : new Date().toISOString();

    return [{
      id,
      name,
      phone,
      status: statusFrom(String(row.Holati ?? "")),
      type: String(row["Ariza turi"] ?? "") === "Ofis topib berish" ? "finder" : "viewing",
      officeId: String(row["Ofis ID"] ?? "").trim() || undefined,
      date: String(row["Qulay sana"] ?? "") || undefined,
      area: String(row.Maydon ?? "") || undefined,
      budget: String(row.Budjet ?? "") || undefined,
      message: String(row.Izoh ?? "") || undefined,
      note: String(row["Menejer izohi"] ?? "") || undefined,
      utm: {
        utm_source: String(row.Manba ?? ""),
        utm_campaign: String(row.Kampaniya ?? ""),
      },
      page: "/",
      createdAt: iso,
      exported: true,
    }];
  });
}
