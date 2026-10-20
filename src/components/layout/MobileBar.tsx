import { CONFIG } from "../../data/config";
import { track } from "../../lib/analytics";
import { Button, ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";

/** Fixed quick-contact bar — the primary conversion path on phones. */
export function MobileBar({ onBook }: { onBook: () => void }) {
  return (
    <div className="mobile-bar" role="group" aria-label="Tezkor aloqa">
      <ButtonLink
        href={`tel:${CONFIG.phoneTel}`}
        onClick={() => track("phone_click", { place: "mobile_bar" })}
      >
        <Icon name="phone" size={16} />Qo'ng'iroq
      </ButtonLink>
      <ButtonLink
        href={CONFIG.telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("telegram_click", { place: "mobile_bar" })}
      >
        <Icon name="send" size={16} />Telegram
      </ButtonLink>
      <Button variant="primary" onClick={onBook}>Yozilish</Button>
    </div>
  );
}
