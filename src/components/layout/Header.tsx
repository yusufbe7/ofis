import { useEffect, useState } from "react";
import { CONFIG } from "../../data/config";
import { track } from "../../lib/analytics";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

const LINKS = [
  ["#ofislar", "Bo'sh ofislar"],
  ["#binolar", "Binolar"],
  ["#lokatsiya", "Lokatsiyalar"],
  ["#savollar", "Savollar"],
  ["#aloqa", "Aloqa"],
] as const;

export function Header({ onBook }: { onBook: () => void }) {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={`header ${compact ? "header-compact" : ""}`}>
      <div className="wrap header-inner">
        <a className="logo" href="#top" aria-label={`${CONFIG.brand} — bosh sahifa`}>
          <span className="logo-mark" aria-hidden="true">P</span>
          <span className="logo-text">{CONFIG.brand}</span>
        </a>

        <nav className="nav" aria-label="Asosiy menyu">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>

        <a
          className="header-phone"
          href={`tel:${CONFIG.phoneTel}`}
          onClick={() => track("phone_click", { place: "header" })}
        >
          {CONFIG.phoneLabel}
        </a>

        <Button variant="primary" onClick={onBook}>Ko'rishga yozilish</Button>

        <button
          className="burger"
          aria-label={menuOpen ? "Menyuni yopish" : "Menyuni ochish"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={19} />
        </button>
      </div>

      {menuOpen && (
        <nav className="wrap mobile-nav" id="mobile-nav" aria-label="Mobil menyu">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
