import { useMemo } from "react";
import { Filters } from "./Filters";
import { OfficeCard } from "./OfficeCard";
import { Button } from "../ui/Button";
import { applyFilters, countActive } from "../../lib/filters";
import { EMPTY_FILTERS, type Building, type FilterState, type Office } from "../../types";

export function OfficeSection({
  offices, buildings, filters, onFilters, onOpen, onBook, onAskHelp,
}: {
  offices: Office[];
  buildings: Building[];
  filters: FilterState;
  onFilters: (next: FilterState) => void;
  onOpen: (id: string) => void;
  onBook: (id: string) => void;
  onAskHelp: () => void;
}) {
  const byId = useMemo(
    () => Object.fromEntries(buildings.map((b) => [b.id, b])) as Record<string, Building>,
    [buildings],
  );
  const visible = useMemo(() => applyFilters(offices, filters), [offices, filters]);
  const active = countActive(filters);

  // Re-keying the grid replays the reveal animation whenever the result set changes.
  const gridKey = `${filters.building}|${filters.area}|${filters.price}|${filters.floor}|${filters.furnished}`;

  return (
    <section className="section" id="ofislar" aria-labelledby="t-off">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Inventar</p>
            <h2 className="display" id="t-off">Bo'sh ofislar</h2>
            <p className="lede" style={{ marginTop: 10 }}>
              Narx va maydon har bir kartada ko'rsatilgan. Band ofislar bu ro'yxatga umuman chiqmaydi.
            </p>
          </div>
        </div>

        <Filters value={filters} onChange={onFilters} buildings={buildings} />

        <div className="result-bar">
          <p aria-live="polite">
            <b>{visible.length}</b> ta ofis topildi
            {active > 0 && <span style={{ color: "var(--dim)" }}> · {active} ta filtr yoqilgan</span>}
          </p>
          {active > 0 && (
            <button className="link-btn" type="button" onClick={() => onFilters(EMPTY_FILTERS)}>
              Filtrni tozalash
            </button>
          )}
        </div>

        <div className="office-grid reveal" key={gridKey}>
          {visible.map((office) => (
            <OfficeCard
              key={office.id}
              office={office}
              building={byId[office.buildingId]}
              onOpen={onOpen}
              onBook={onBook}
            />
          ))}

          {visible.length === 0 && (
            <div className="empty">
              <h3>Bu shartlarga mos ofis yo'q</h3>
              <p>
                Filtrni biroz kengaytiring yoki talablaringizni qoldiring — mos variant
                chiqqanda o'zimiz bog'lanamiz.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <Button onClick={() => onFilters(EMPTY_FILTERS)}>Filtrni tozalash</Button>
                <Button variant="primary" onClick={onAskHelp}>Talab qoldirish</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
