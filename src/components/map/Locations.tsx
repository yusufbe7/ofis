import { useState } from "react";
import { LocationMap } from "./LocationMap";
import type { Building } from "../../types";

export function Locations({
  buildings, vacancies, onShowOffices,
}: {
  buildings: Building[];
  vacancies: Record<string, number>;
  onShowOffices: (buildingId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState(buildings[0]?.id ?? "");
  const selected = buildings.find((b) => b.id === selectedId);

  return (
    <section className="section" id="lokatsiya" aria-labelledby="t-loc">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Lokatsiyalar</p>
            <h2 className="display" id="t-loc">Binolarimiz xaritada</h2>
            <p className="lede" style={{ marginTop: 10 }}>
              Binoni tanlang — xarita o'sha joyga suriladi. Belgini bosib ham ko'rish mumkin.
            </p>
          </div>
        </div>

        <div className="locations">
          <div className="location-list" role="group" aria-label="Binolar ro'yxati">
            {buildings.map((b, i) => (
              <button
                key={b.id}
                type="button"
                className="location-item"
                aria-pressed={b.id === selectedId}
                onClick={() => setSelectedId(b.id)}
              >
                <b>{String.fromCharCode(65 + i)} · {b.name}</b>
                <span>{b.district}</span>
                <br />
                <em>{vacancies[b.id] ?? 0} ta bo'sh ofis</em>
              </button>
            ))}

            {selected && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: 6 }}
                onClick={() => onShowOffices(selected.id)}
              >
                {selected.name} ofislarini ko'rish
              </button>
            )}
          </div>

          <div className="map-shell">
            <LocationMap
              buildings={buildings}
              selectedId={selectedId}
              onSelect={setSelectedId}
              vacancies={vacancies}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
