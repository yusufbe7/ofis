import { useMemo, useState } from "react";
import { Button } from "../ui/Button";
import { fmtShort } from "../../lib/format";
import type { Building, Office } from "../../types";

/**
 * Isometric floor stack, built with CSS 3D transforms.
 *
 * Why this and not a decorative render: "which floor has space, and how much?"
 * is the question every tenant asks first. Each slab is one floor; floors with
 * vacancies carry the brass edge, empty ones stay dark. Clicking a floor filters
 * the listing, so the drawing is a control, not an illustration.
 */

interface FloorInfo {
  floor: number;
  offices: Office[];
  minArea: number;
  maxArea: number;
  fromRent: number;
}

export function BuildingExplorer({
  buildings, offices, onPickFloor,
}: {
  buildings: Building[];
  offices: Office[];
  onPickFloor: (buildingId: string, floor: number) => void;
}) {
  const [buildingId, setBuildingId] = useState(buildings[0]?.id ?? "");
  const [hovered, setHovered] = useState<number | null>(null);

  const building = buildings.find((b) => b.id === buildingId) ?? buildings[0];

  /** Floors are derived from the inventory, so the drawing can never drift from the data. */
  const floors = useMemo<FloorInfo[]>(() => {
    const mine = offices.filter((o) => o.buildingId === buildingId);
    const top = Math.max(6, ...mine.map((o) => o.floor));
    return Array.from({ length: top }, (_, i) => {
      const floor = top - i; // top floor first — the stack renders downward
      const onFloor = mine.filter((o) => o.floor === floor);
      return {
        floor,
        offices: onFloor,
        minArea: onFloor.length ? Math.min(...onFloor.map((o) => o.area)) : 0,
        maxArea: onFloor.length ? Math.max(...onFloor.map((o) => o.area)) : 0,
        fromRent: onFloor.length ? Math.min(...onFloor.map((o) => o.monthlyRent)) : 0,
      };
    });
  }, [offices, buildingId]);

  const vacant = floors.reduce((sum, f) => sum + f.offices.length, 0);
  const active = hovered !== null ? floors.find((f) => f.floor === hovered) ?? null : null;

  return (
    <section className="section explorer-section" aria-labelledby="t-exp">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Qavatlar</p>
            <h2 className="display" id="t-exp">Qaysi qavatda joy bor</h2>
            <p className="lede" style={{ marginTop: 10 }}>
              Yoritilgan qavatlarda bo'sh ofis bor. Qavat ustiga bosing — o'sha
              qavatdagi ofislar ro'yxatda ochiladi.
            </p>
          </div>

          <div className="explorer-switch" role="group" aria-label="Binoni tanlash">
            {buildings.map((b, i) => (
              <button
                key={b.id}
                type="button"
                className="explorer-tab"
                aria-pressed={b.id === buildingId}
                onClick={() => { setBuildingId(b.id); setHovered(null); }}
              >
                {String.fromCharCode(65 + i)}
              </button>
            ))}
          </div>
        </div>

        <div className="explorer">
          <div className="explorer-stage">
            <div className="stack" role="list" aria-label={`${building?.name} qavatlari`}>
              {floors.map((f, index) => {
                const has = f.offices.length > 0;
                return (
                  <button
                    key={f.floor}
                    type="button"
                    role="listitem"
                    className={`slab ${has ? "slab-free" : ""} ${hovered === f.floor ? "slab-hover" : ""}`}
                    style={{ ["--i" as string]: index }}
                    onMouseEnter={() => setHovered(f.floor)}
                    onFocus={() => setHovered(f.floor)}
                    onMouseLeave={() => setHovered(null)}
                    onBlur={() => setHovered(null)}
                    onClick={() => has && onPickFloor(buildingId, f.floor)}
                    disabled={!has}
                    aria-label={
                      has
                        ? `${f.floor}-qavat, ${f.offices.length} ta bo'sh ofis`
                        : `${f.floor}-qavat, bo'sh ofis yo'q`
                    }
                  >
                    <span className="slab-face">
                      <span className="slab-no">{f.floor}</span>
                      {has && (
                        <span className="slab-count">{f.offices.length} ta bo'sh</span>
                      )}
                      <span className="slab-windows" aria-hidden="true">
                        {Array.from({ length: 9 }, (_, w) => (
                          <i key={w} className={has && (w + f.floor) % 3 !== 0 ? "lit" : ""} />
                        ))}
                      </span>
                    </span>
                    <span className="slab-edge" aria-hidden="true" />
                  </button>
                );
              })}
              <div className="stack-ground" aria-hidden="true" />
            </div>
          </div>

          <aside className="explorer-info" aria-live="polite">
            <p className="eyebrow">{building?.district}</p>
            <h3 className="explorer-name">{building?.name}</h3>
            <p className="explorer-desc">{building?.description}</p>

            <dl className="explorer-stats">
              <div>
                <dt>Bo'sh ofis</dt>
                <dd className="figure">{vacant}</dd>
              </div>
              <div>
                <dt>Qavatlar</dt>
                <dd className="figure">{floors.length}</dd>
              </div>
            </dl>

            <div className={`explorer-peek ${active ? "is-on" : ""}`}>
              {active && active.offices.length > 0 ? (
                <>
                  <p className="eyebrow">{active.floor}-qavat</p>
                  <p className="explorer-peek-main">
                    {active.offices.length} ta ofis ·{" "}
                    {active.minArea === active.maxArea
                      ? `${active.minArea} m²`
                      : `${active.minArea}–${active.maxArea} m²`}
                  </p>
                  <p className="explorer-peek-sub">
                    {fmtShort(active.fromRent)} so'mdan boshlab
                  </p>
                </>
              ) : active ? (
                <>
                  <p className="eyebrow">{active.floor}-qavat</p>
                  <p className="explorer-peek-main">Hozircha bo'sh ofis yo'q</p>
                  <p className="explorer-peek-sub">Bo'shaganda xabar beramiz</p>
                </>
              ) : (
                <p className="explorer-peek-sub">
                  Qavat ustiga sichqonchani olib boring
                </p>
              )}
            </div>

            <Button
              variant="primary"
              block
              style={{ marginTop: 18 }}
              onClick={() => onPickFloor(buildingId, 0)}
            >
              {building?.name} ofislarini ko'rish
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
