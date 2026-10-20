import { useEffect, useState } from "react";
import { CONFIG, PUBLIC_STATUS } from "../data/config";
import { BUILDINGS, OFFICES } from "../data/offices";
import type { Building, DataSet, Office } from "../types";

interface State {
  data: DataSet;
  loading: boolean;
  /** Set when a configured API failed — the UI still renders the bundled data. */
  error: string | null;
}

const BUNDLED: DataSet = { buildings: BUILDINGS, offices: OFFICES };

/**
 * Loads the inventory. With CONFIG.api.offices set it fetches live data and
 * falls back to the bundled set on failure, so a broken endpoint degrades to a
 * stale listing rather than an empty page.
 */
export function useInventory(): State {
  const [state, setState] = useState<State>({
    data: BUNDLED,
    loading: Boolean(CONFIG.api.offices),
    error: null,
  });

  useEffect(() => {
    const { offices, buildings } = CONFIG.api;
    if (!offices || !buildings) return;

    let cancelled = false;
    (async () => {
      try {
        const [o, b] = await Promise.all([
          fetch(offices).then((r) => r.json() as Promise<Office[]>),
          fetch(buildings).then((r) => r.json() as Promise<Building[]>),
        ]);
        if (!cancelled) setState({ data: { offices: o, buildings: b }, loading: false, error: null });
      } catch {
        if (!cancelled) {
          setState({ data: BUNDLED, loading: false, error: "Ma'lumotni yuklab bo'lmadi — namunaviy ro'yxat ko'rsatilmoqda." });
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return state;
}

/** Offices visible to the public. Anything not vacant never leaves this function. */
export const publicOffices = (offices: Office[]): Office[] =>
  offices.filter((o) => o.status === PUBLIC_STATUS);

export const vacancyByBuilding = (offices: Office[]): Record<string, number> =>
  publicOffices(offices).reduce<Record<string, number>>((acc, o) => {
    acc[o.buildingId] = (acc[o.buildingId] ?? 0) + 1;
    return acc;
  }, {});
