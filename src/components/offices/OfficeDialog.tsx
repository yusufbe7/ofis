import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";
import { Button, ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { DetailMap } from "../map/LocationMap";
import { CONFIG } from "../../data/config";
import { track } from "../../lib/analytics";
import { fmtSum } from "../../lib/format";
import type { Building, Office } from "../../types";

export function OfficeDialog({
  office, building, onClose, onBook,
}: {
  office: Office | null;
  building: Building | null;
  onClose: () => void;
  onBook: (id: string) => void;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => { setActive(0); }, [office?.id]);

  return (
    <Modal open={Boolean(office && building)} onClose={onClose} label="Ofis tafsilotlari">
      {office && building && (
        <div className="detail">
          <div>
            <img
              className="detail-main"
              src={office.images[active]}
              alt={`${building.name}, ${office.roomNo}-ofis — ${active + 1}-rasm`}
            />
            <div className="thumbs">
              {office.images.map((src, i) => (
                <button
                  key={src.slice(-24) + i}
                  type="button"
                  aria-current={i === active}
                  aria-label={`${i + 1}-rasm`}
                  onClick={() => setActive(i)}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>

            <div className="detail-map">
              <DetailMap building={building} />
            </div>
            <p className="field-hint" style={{ marginTop: 8 }}>
              {building.district} · {building.address}
            </p>
          </div>

          <div>
            <Badge tone={office.available === "Hozir" ? "free" : "soon"}>
              {office.available === "Hozir" ? "Hozir bo'sh" : office.available}
            </Badge>

            <h2 className="dialog-title detail-title" style={{ marginTop: 10 }}>
              Ofis {office.roomNo}
            </h2>
            <p className="eyebrow">{building.name} · {building.district}</p>

            <p className="detail-price">
              <b className="figure">{fmtSum(office.monthlyRent)}</b>
              <span>so'm / oy</span>
            </p>

            <dl className="specs">
              <div><dt>Maydon</dt><dd>{office.area} m²</dd></div>
              <div><dt>Qavat</dt><dd>{office.floor}-qavat</dd></div>
              <div><dt>Holati</dt><dd>{office.furnished ? "Jihozlangan" : "Jihozsiz"}</dd></div>
            </dl>

            <p style={{ color: "var(--muted)", margin: "16px 0", fontSize: 14.5 }}>
              {office.description}
            </p>

            <ul className="amenities">
              {office.amenities.map((a) => <li className="chip" key={a}>{a}</li>)}
            </ul>

            <Button
              variant="primary"
              block
              style={{ marginTop: 20 }}
              onClick={() => onBook(office.id)}
            >
              <Icon name="calendar" size={16} />Shu ofisni ko'rishga yozilish
            </Button>

            <div className="contact-row">
              <ButtonLink
                size="sm"
                href={`tel:${CONFIG.phoneTel}`}
                onClick={() => track("phone_click", { place: "office_dialog", officeId: office.id })}
              >
                <Icon name="phone" size={15} />Qo'ng'iroq
              </ButtonLink>
              <ButtonLink
                size="sm"
                href={CONFIG.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("telegram_click", { place: "office_dialog", officeId: office.id })}
              >
                <Icon name="send" size={15} />Telegram
              </ButtonLink>
              <ButtonLink
                size="sm"
                href={CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { place: "office_dialog", officeId: office.id })}
              >
                WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
