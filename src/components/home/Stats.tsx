import { CONFIG } from "../../data/config";

export function Stats({ buildings, total, vacant }: { buildings: number; total: number; vacant: number }) {
  const items: [string, string][] = [
    [String(buildings), "Biznes markaz"],
    [String(total), "Jami ofis"],
    [String(vacant), "Hozir bo'sh"],
    [CONFIG.tenants, "Faol kompaniya"],
  ];

  return (
    <div className="wrap">
      <div className="stats" aria-label="Qisqacha raqamlar">
        {items.map(([value, label]) => (
          <div className="stat" key={label}>
            <b className="figure">{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
