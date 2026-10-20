import { Button } from "../ui/Button";
import type { Building } from "../../types";

export function Buildings({
  buildings, vacancies, onSelect,
}: {
  buildings: Building[];
  vacancies: Record<string, number>;
  onSelect: (buildingId: string) => void;
}) {
  return (
    <section className="section" id="binolar" aria-labelledby="t-bld">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Binolar</p>
            <h2 className="display" id="t-bld">To'rtta biznes markaz</h2>
            <p className="lede" style={{ marginTop: 10 }}>
              Har biri shaharning ish yurituvchi tumanida. Binoni bosing — ofislari filtrlanadi.
            </p>
          </div>
        </div>

        <div className="building-grid">
          {buildings.map((b) => (
            <article className="building-card" key={b.id}>
              <img src={b.image} alt={`${b.name} binosi`} loading="lazy" width={400} height={500} />
              <h3>{b.name}</h3>
              <p>{b.district}</p>
              <p>{b.description}</p>
              <p className="building-vacancy">{vacancies[b.id] ?? 0} ta bo'sh ofis</p>
              <Button size="sm" onClick={() => onSelect(b.id)}>Ofislarini ko'rish</Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
