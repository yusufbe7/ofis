import { useState } from "react";
import { Button } from "../ui/Button";
import { Field, Select } from "../ui/Field";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { AREA_OPTIONS, PRICE_OPTIONS } from "../../lib/filters";
import { fmtSum } from "../../lib/format";
import { EMPTY_FILTERS, type Building, type FilterState, type Office } from "../../types";

export function Hero({
  buildings, offices, onSearch, onBook, onOpenOffice,
}: {
  buildings: Building[];
  offices: Office[];
  onSearch: (next: FilterState) => void;
  onBook: () => void;
  onOpenOffice: (id: string) => void;
}) {
  const [draft, setDraft] = useState<FilterState>(EMPTY_FILTERS);

  // The showcase uses the cheapest immediately-available office: the most
  // persuasive thing to lead with, and it stays correct as inventory changes.
  const featured = offices
    .filter((o) => o.available === "Hozir")
    .sort((a, b) => a.monthlyRent - b.monthlyRent)[0] ?? offices[0];
  const featuredBuilding = buildings.find((b) => b.id === featured?.buildingId);

  return (
    <>
      <section className="hero" aria-labelledby="h1">
        <div className="hero-glow" aria-hidden="true" />

        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="eyebrow" style={{ marginBottom: 18 }}>Toshkent · biznes markazlar</p>
            <h1 className="display" id="h1">
              Biznesingiz uchun <em>mos ofis</em> toping
            </h1>
            <p className="lede">
              To'rtta biznes markazda 18 m² dan 85 m² gacha tayyor ofislar.
              Narx va maydon oldindan ko'rinadi, ko'rishga onlayn yoziling.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#ofislar">
                Bo'sh ofislarni ko'rish<Icon name="arrow" size={16} />
              </a>
              <Button onClick={onBook}>Ko'rishga yozilish</Button>
            </div>
          </div>

          {/* Tilted showcase — real data, so the first thing a visitor sees is live inventory */}
          {featured && featuredBuilding && (
            <div className="showcase" aria-hidden="true">
              <div className="showcase-frame">
                <img src={featured.images[0]} alt="" />
                <div className="showcase-sheen" />
              </div>

              <button
                className="showcase-card showcase-card-main"
                onClick={() => onOpenOffice(featured.id)}
                aria-hidden="true"
                tabIndex={-1}
              >
                <Badge tone="free">Bo'sh</Badge>
                <span className="showcase-room">Ofis {featured.roomNo}</span>
                <span className="showcase-meta">
                  {featuredBuilding.name} · {featured.area} m² · {featured.floor}-qavat
                </span>
                <span className="showcase-price figure">
                  {fmtSum(featured.monthlyRent)} <small>so'm / oy</small>
                </span>
              </button>

              <div className="showcase-card showcase-card-chip">
                <Icon name="check" size={14} />
                <span>Bugun ko'rsa bo'ladi</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="wrap">
        <form
          className="search-card"
          aria-label="Ofis qidirish"
          onSubmit={(e) => { e.preventDefault(); onSearch(draft); }}
        >
          <div className="search-grid">
            <Field label="Bino">
              {(p) => (
                <Select {...p} value={draft.building}
                  onChange={(e) => setDraft({ ...draft, building: e.target.value })}>
                  <option value="">Barcha binolar</option>
                  {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </Select>
              )}
            </Field>

            <Field label="Maydon">
              {(p) => (
                <Select {...p} value={draft.area}
                  onChange={(e) => setDraft({ ...draft, area: e.target.value })}>
                  <option value="">Istalgan</option>
                  {AREA_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              )}
            </Field>

            <Field label="Oylik narx">
              {(p) => (
                <Select {...p} value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}>
                  <option value="">Istalgan</option>
                  {PRICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              )}
            </Field>

            <Button type="submit" variant="primary">
              <Icon name="search" size={16} />Ofis topish
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
