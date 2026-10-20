/**
 * Everything a non-developer needs to change lives here.
 * Replace the placeholders before going live — nothing else requires editing.
 */
export const CONFIG = {
  brand: "Prime Ofis",
  tagline: "Toshkentda biznes markaz ofislari",

  /** Shown to visitors. */
  phoneLabel: "+998 XX XXX XX XX",
  /** Dialled by the phone link — digits only, with country code. */
  phoneTel: "+998000000000",

  telegramLabel: "@telegram_username",
  telegramUrl: "https://t.me/telegram_username",
  whatsappUrl: "https://wa.me/998000000000",

  address: "Toshkent shahri, [manzil kiritiladi]",
  hours: "Dushanba–Juma, 09:00–18:00",

  /** A real figure the owner can vouch for. Remove the stat if there isn't one. */
  tenants: "23+",

  /**
   * Point these at a backend when one exists. While they are null the app reads
   * the bundled data in src/data/offices.ts and logs leads to the console.
   *   offices:   GET  → Office[]
   *   buildings: GET  → Building[]
   *   leads:     POST → { ok: boolean }
   */
  api: {
    offices: null as string | null,
    buildings: null as string | null,
    leads: null as string | null,
  },
} as const;

/** Only offices with this status are ever rendered publicly. */
export const PUBLIC_STATUS = "Bo'sh";

/**
 * Admin gate. The default password is "prime2026" — change it before launch.
 *
 * To set a new one, open the site, press F12 and run in the console:
 *   await (await import("/src/lib/auth.ts")).hashFor("yangi-parol")
 * then paste the result into passwordHash below. On a built site use the
 * one-liner in the README instead.
 *
 * This check happens in the browser, so it keeps casual visitors out but is not
 * real security. The README explains how to add proper protection.
 */
export const ADMIN = {
  salt: "prime-ofis-2026",
  passwordHash: "74d9c06134b933c9d7907d270ce10cb10f753695329cb27b328e4f5f004afd34",
} as const;
