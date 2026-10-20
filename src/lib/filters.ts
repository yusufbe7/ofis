import type { FilterState, Office } from "../types";

export interface RangeOption {
  value: string;
  label: string;
}

export const AREA_OPTIONS: RangeOption[] = [
  { value: "0-29", label: "30 m² gacha" },
  { value: "30-49", label: "30–50 m²" },
  { value: "50-79", label: "50–80 m²" },
  { value: "80-9999", label: "80 m² dan katta" },
];

export const PRICE_OPTIONS: RangeOption[] = [
  { value: "6000000", label: "6 mln gacha" },
  { value: "8000000", label: "8 mln gacha" },
  { value: "10000000", label: "10 mln gacha" },
  { value: "15000000", label: "15 mln gacha" },
];

export const FLOOR_OPTIONS: RangeOption[] = [
  { value: "1-2", label: "1–2-qavat" },
  { value: "3-4", label: "3–4-qavat" },
  { value: "5-99", label: "5-qavat va yuqori" },
];

/** "30-49" against a number. An empty filter always matches. */
const inRange = (range: string, value: number): boolean => {
  if (!range) return true;
  const [min, max] = range.split("-").map(Number);
  return value >= min && value <= max;
};

export function applyFilters(offices: Office[], f: FilterState): Office[] {
  return offices.filter(
    (o) =>
      (!f.building || o.buildingId === f.building) &&
      inRange(f.area, o.area) &&
      (!f.price || o.monthlyRent <= Number(f.price)) &&
      inRange(f.floor, o.floor) &&
      (!f.furnished || o.furnished),
  );
}

export const countActive = (f: FilterState): number =>
  [f.building, f.area, f.price, f.floor].filter(Boolean).length + (f.furnished ? 1 : 0);
