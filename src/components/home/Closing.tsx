import { CONFIG } from "../../data/config";
import { track } from "../../lib/analytics";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

export function Closing({ onBook }: { onBook: () => void }) {
  return (
    <section className="closing" id="aloqa" aria-labelledby="t-cta">
      <div className="wrap">
        <p className="eyebrow">Aloqa</p>
        <h2 className="display" id="t-cta" style={{ maxWidth: "18ch" }}>
          Yangi ofisni bugun ko'rib chiqing
        </h2>

        <div className="hero-cta">
          <a className="btn btn-primary" href="#ofislar">
            Bo'sh ofislarni ko'rish<Icon name="arrow" size={16} />
          </a>
          <Button onClick={onBook}>Ko'rishga yozilish</Button>
        </div>

        <div className="contact-grid">
          <div>
            <small>Telefon</small>
            <a href={`tel:${CONFIG.phoneTel}`} onClick={() => track("phone_click", { place: "closing" })}>
              {CONFIG.phoneLabel}
            </a>
          </div>
          <div>
            <small>Telegram</small>
            <a href={CONFIG.telegramUrl} target="_blank" rel="noopener noreferrer"
               onClick={() => track("telegram_click", { place: "closing" })}>
              {CONFIG.telegramLabel}
            </a>
          </div>
          <div>
            <small>WhatsApp</small>
            <a href={CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer"
               onClick={() => track("whatsapp_click", { place: "closing" })}>
              {CONFIG.phoneLabel}
            </a>
          </div>
          <div><small>Manzil</small><span>{CONFIG.address}</span></div>
          <div><small>Ish vaqti</small><span>{CONFIG.hours}</span></div>
        </div>
      </div>
    </section>
  );
}
