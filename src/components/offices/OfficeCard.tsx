import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { fmtSum } from "../../lib/format";
import type { Building, Office } from "../../types";

export function OfficeCard({
  office, building, onOpen, onBook,
}: {
  office: Office;
  building: Building;
  onOpen: (id: string) => void;
  onBook: (id: string) => void;
}) {
  const immediate = office.available === "Hozir";

  return (
    <article className="card card-lift office-card">
      <button
        className="office-photo"
        onClick={() => onOpen(office.id)}
        aria-label={`Ofis ${office.roomNo} — batafsil ko'rish`}
      >
        <img
          src={office.images[0]}
          alt={`${building.name}, ${office.roomNo}-ofis ichki ko'rinishi`}
          loading="lazy"
          width={800}
          height={560}
        />
        <Badge tone={immediate ? "free" : "soon"}>
          {immediate ? "Bo'sh" : office.available}
        </Badge>
      </button>

      <div className="office-body">
        <p className="eyebrow">{building.name} · {building.district}</p>
        <h3>Ofis {office.roomNo}</h3>
        <p className="office-desc">{office.description}</p>

        <ul className="amenities">
          {office.amenities.slice(0, 4).map((a) => (
            <li className="chip" key={a}>{a}</li>
          ))}
        </ul>

        <dl className="specs">
          <div><dt>Maydon</dt><dd>{office.area} m²</dd></div>
          <div><dt>Qavat</dt><dd>{office.floor}-qavat</dd></div>
          <div><dt>Holati</dt><dd>{office.furnished ? "Jihozlangan" : "Jihozsiz"}</dd></div>
        </dl>

        <p className="price">
          <b className="figure">{fmtSum(office.monthlyRent)}</b>
          <span>so'm / oy</span>
        </p>

        <div className="office-actions">
          <Button onClick={() => onOpen(office.id)}>Batafsil</Button>
          <Button variant="primary" onClick={() => onBook(office.id)}>Ko'rishga yozilish</Button>
        </div>
      </div>
    </article>
  );
}
