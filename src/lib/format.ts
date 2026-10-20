/** 5000000 → "5 000 000" */
export const fmtSum = (n: number): string =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** 5000000 → "5 mln" for compact contexts. */
export const fmtShort = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")} mln`;
  if (n >= 1_000) return `${Math.round(n / 1000)} ming`;
  return String(n);
};

/**
 * Accepts "901234567", "+998 90 123 45 67", "998901234567".
 * Returns E.164 or null — the single source of truth for phone validity.
 */
export function normalizePhone(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 9) digits = "998" + digits;
  return /^998\d{9}$/.test(digits) ? "+" + digits : null;
}

/** +998901234567 → "+998 90 123 45 67" */
export function prettyPhone(value: string): string {
  const e164 = normalizePhone(value);
  if (!e164) return value;
  const d = e164.slice(4);
  return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
}

export const todayISO = (): string => new Date().toISOString().slice(0, 10);
