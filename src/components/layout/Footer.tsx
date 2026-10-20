import { CONFIG } from "../../data/config";
import { track } from "../../lib/analytics";
import type { Building } from "../../types";

export function Footer({ buildings }: { buildings: Building[] }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: 14 }}>
              <span className="logo-mark" aria-hidden="true">P</span>
              <span className="logo-text">{CONFIG.brand}</span>
            </div>
            <p style={{ maxWidth: "38ch" }}>
              {CONFIG.tagline}. Turli hajmdagi ofislar, shaffof shartlar.
              [Kompaniya haqida qisqa matn shu yerga kiritiladi.]
            </p>
          </div>

          <div>
            <h4>Sahifalar</h4>
            <ul>
              <li><a href="#ofislar">Bo'sh ofislar</a></li>
              <li><a href="#binolar">Binolar</a></li>
              <li><a href="#lokatsiya">Lokatsiyalar</a></li>
              <li><a href="#savollar">Savollar</a></li>
            </ul>
          </div>

          <div>
            <h4>Binolar</h4>
            <ul>
              {buildings.map((b) => (
                <li key={b.id}><a href="#binolar">{b.name}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Aloqa</h4>
            <ul>
              <li>
                <a href={`tel:${CONFIG.phoneTel}`} onClick={() => track("phone_click", { place: "footer" })}>
                  {CONFIG.phoneLabel}
                </a>
              </li>
              <li>
                <a href={CONFIG.telegramUrl} target="_blank" rel="noopener noreferrer"
                   onClick={() => track("telegram_click", { place: "footer" })}>
                  {CONFIG.telegramLabel}
                </a>
              </li>
              <li>{CONFIG.address}</li>
              <li>{CONFIG.hours}</li>
            </ul>
          </div>
        </div>

        <div className="footer-legal">
          <span>© {new Date().getFullYear()} {CONFIG.brand}</span>
          <a href="#savollar">Maxfiylik siyosati</a>
          <a href="#savollar">Foydalanish shartlari</a>
        </div>
      </div>
    </footer>
  );
}
