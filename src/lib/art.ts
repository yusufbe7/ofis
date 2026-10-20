/**
 * Placeholder imagery, generated as SVG data URIs so the project ships with no
 * binary assets. Tuned for the dark palette: architectural line work rather than
 * flat clipart, so an empty listing still looks deliberate.
 *
 * Replace `images` in src/data/offices.ts with real photo URLs when you have them —
 * nothing else needs to change.
 */

const svg = (body: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560">${body}</svg>`,
  );

const base = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#23232a"/>
      <stop offset="1" stop-color="#15151a"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d6ae6b" stop-opacity=".18"/>
      <stop offset="1" stop-color="#d6ae6b" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="560" fill="url(#g)"/>`;

/** Exterior: a facade with a lit window grid. `seed` varies which windows are lit. */
export function facade(seed = 0): string {
  let windows = "";
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 7; c++) {
      const lit = (r * 7 + c * 3 + seed * 5) % 4 === 0;
      windows += `<rect x="${212 + c * 54}" y="${72 + r * 44}" width="38" height="28" rx="1" fill="${
        lit ? "#d6ae6b" : "#2a2a31"
      }" opacity="${lit ? 0.5 : 1}"/>`;
    }
  }
  return svg(`${base}
    <rect x="190" y="44" width="420" height="472" fill="#17171c"/>
    <rect x="190" y="44" width="420" height="472" fill="url(#glow)"/>
    ${windows}
    <rect x="190" y="44" width="420" height="472" fill="none" stroke="#33333c" stroke-width="1.5"/>
    <rect y="508" width="800" height="52" fill="#0d0d10"/>
    <path d="M0 508h800" stroke="#2a2a31" stroke-width="1.5"/>`);
}

/** Interior: desks, a window wall and a plant — the shapes a viewer expects. */
export function interior(seed = 0): string {
  const desks = 2 + (seed % 2);
  let furniture = "";
  for (let i = 0; i < desks; i++) {
    const x = 96 + i * 250;
    furniture += `
      <rect x="${x}" y="336" width="208" height="12" rx="2" fill="#464651"/>
      <rect x="${x + 16}" y="348" width="9" height="84" fill="#383842"/>
      <rect x="${x + 183}" y="348" width="9" height="84" fill="#383842"/>
      <rect x="${x + 72}" y="296" width="64" height="40" rx="3" fill="#2a2a33" stroke="#4d4d58"/>
      <circle cx="${x + 104}" cy="${452}" r="22" fill="#32323b"/>`;
  }
  return svg(`${base}
    <rect x="60" y="56" width="680" height="248" fill="#1a2028" stroke="#3d3d48"/>
    <rect x="60" y="56" width="680" height="248" fill="url(#glow)"/>
    <path d="M287 56v248M513 56v248M60 180h680" stroke="#3d3d48" stroke-width="2"/>
    <rect y="432" width="800" height="128" fill="#1b1b21"/>
    ${furniture}
    <rect x="690" y="392" width="40" height="54" rx="4" fill="#3a3a44"/>
    <circle cx="710" cy="376" r="32" fill="#3c4d40"/>`);
}

/** Floor plan: a schematic, used as the third gallery image. */
export function plan(seed = 0): string {
  const split = 300 + (seed % 3) * 60;
  return svg(`${base}
    <rect x="80" y="70" width="640" height="420" fill="#121216" stroke="#3a3a44" stroke-width="2"/>
    <path d="M${split} 70v420M80 300h${split - 80}" stroke="#3a3a44" stroke-width="2"/>
    <path d="M80 190h60M${split} 400h80" stroke="#d6ae6b" stroke-width="3" opacity=".5"/>
    <rect x="${split + 40}" y="110" width="150" height="90" rx="2" fill="none" stroke="#2f2f38" stroke-dasharray="6 5"/>
    <rect x="130" y="110" width="120" height="70" rx="2" fill="none" stroke="#2f2f38" stroke-dasharray="6 5"/>
    <rect x="130" y="350" width="120" height="70" rx="2" fill="none" stroke="#2f2f38" stroke-dasharray="6 5"/>`);
}

export const galleryFor = (seed: number): string[] => [
  interior(seed),
  interior(seed + 1),
  facade(seed),
  plan(seed),
];
