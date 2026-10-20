import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { Input } from "../components/ui/Field";
import { hashFor } from "../lib/auth";
import { clearLeads, type StoredLead } from "../lib/leadStore";
import { CONFIG } from "../data/config";

export function SettingsPanel({ leads, onChanged }: { leads: StoredLead[]; onChanged: () => void }) {
  const [candidate, setCandidate] = useState("");
  const [hash, setHash] = useState("");
  const [confirming, setConfirming] = useState(false);

  const generate = async () => {
    if (!candidate) return;
    setHash(await hashFor(candidate));
  };

  const wipe = () => {
    clearLeads();
    onChanged();
    setConfirming(false);
  };

  const apiOn = Boolean(CONFIG.api.leads);

  return (
    <>
      <header className="admin-head">
        <div>
          <h1 className="display admin-title">Sozlamalar</h1>
          <p className="lede" style={{ fontSize: 14, marginTop: 6 }}>
            Parol, ma'lumot saqlanishi va zaxira nusxa.
          </p>
        </div>
      </header>

      <div className="admin-panels">
        <section className="admin-card admin-pad">
          <h2 className="admin-sub">Arizalar qayerda saqlanadi</h2>

          {apiOn ? (
            <p className="admin-body">
              Serverga ulangan: <code>{CONFIG.api.leads}</code>. Arizalar barcha
              qurilmalarda ko'rinadi.
            </p>
          ) : (
            <>
              <div className="admin-warn">
                <Icon name="layers" size={16} />
                <div>
                  <b>Hozir arizalar faqat shu brauzerda saqlanadi.</b>
                  <p>
                    Mijoz telefonidan yuborgan ariza sizning kompyuteringizdagi
                    panelga tushmaydi. Buning uchun server kerak — README'da
                    Google Sheets orqali ulash yo'li yozilgan (kod tayyor, 10 daqiqalik ish).
                  </p>
                </div>
              </div>
              <p className="admin-body">
                Shu brauzerda: <b>{leads.length}</b> ta ariza.
                Brauzer ma'lumotini tozalasangiz yoki boshqa kompyuterga o'tsangiz
                yo'qoladi — shuning uchun muntazam Excelga saqlab turing.
              </p>
            </>
          )}
        </section>

        <section className="admin-card admin-pad">
          <h2 className="admin-sub">Parolni almashtirish</h2>
          <p className="admin-body">
            Yangi parolni yozing, pastdagi qatorni nusxalab{" "}
            <code>src/data/config.ts</code> dagi <code>passwordHash</code> o'rniga qo'ying.
          </p>

          <div className="admin-inline">
            <Input
              placeholder="Yangi parol"
              value={candidate}
              onChange={(e) => { setCandidate(e.target.value); setHash(""); }}
              aria-label="Yangi parol"
            />
            <Button onClick={generate} disabled={!candidate}>Hisoblash</Button>
          </div>

          {hash && (
            <div className="admin-hash">
              <code>{hash}</code>
              <Button
                size="sm"
                onClick={() => void navigator.clipboard?.writeText(hash)}
              >
                Nusxalash
              </Button>
            </div>
          )}

          <div className="admin-warn" style={{ marginTop: 16 }}>
            <Icon name="layers" size={16} />
            <div>
              <b>Bu parol to'liq himoya emas.</b>
              <p>
                Tekshiruv brauzerda bajariladi, ya'ni texnikani biladigan odam
                uni aylanib o'tishi mumkin. Jiddiy himoya uchun hostingning o'z
                parol qo'yish imkoniyatidan foydalaning (Vercel, Netlify,
                Cloudflare Access) — README'da ko'rsatilgan.
              </p>
            </div>
          </div>
        </section>

        <section className="admin-card admin-pad">
          <h2 className="admin-sub">Ma'lumotni tozalash</h2>
          <p className="admin-body">
            Barcha arizalarni shu brauzerdan o'chiradi. Avval Excelga saqlab oling —
            bu amalni qaytarib bo'lmaydi.
          </p>

          {confirming ? (
            <div className="admin-inline" style={{ marginTop: 14 }}>
              <Button variant="primary" onClick={wipe}>Ha, hammasini o'chir</Button>
              <Button onClick={() => setConfirming(false)}>Bekor qilish</Button>
            </div>
          ) : (
            <Button style={{ marginTop: 14 }} onClick={() => setConfirming(true)} disabled={leads.length === 0}>
              Arizalarni o'chirish
            </Button>
          )}
        </section>
      </div>
    </>
  );
}
