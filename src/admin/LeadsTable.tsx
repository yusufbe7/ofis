import { useMemo, useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Icon } from "../components/ui/Icon";
import { Input } from "../components/ui/Field";
import { Modal } from "../components/ui/Modal";
import { exportLeads, importLeads } from "../lib/excel";
import { mergeLeads, markExported, removeLead, setNote, setStatus, type LeadStatus, type StoredLead } from "../lib/leadStore";
import { prettyPhone } from "../lib/format";
import type { Building, Office } from "../types";

type TabKey = "all" | LeadStatus;

const TABS: [TabKey, string][] = [
  ["new", "Yangi"],
  ["confirmed", "Tasdiqlangan"],
  ["rejected", "Rad etilgan"],
  ["all", "Hammasi"],
];

const STATUS: Record<LeadStatus, { tone: "free" | "soon" | "neutral"; label: string }> = {
  new: { tone: "soon", label: "Yangi" },
  confirmed: { tone: "free", label: "Tasdiqlangan" },
  rejected: { tone: "neutral", label: "Rad etilgan" },
};

export function LeadsTable({
  leads, offices, buildings, onChanged,
}: {
  leads: StoredLead[];
  offices: Office[];
  buildings: Building[];
  onChanged: () => void;
}) {
  const [tab, setTab] = useState<TabKey>("new");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<StoredLead | null>(null);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  /** "Business Center A — Ofis 12 (36 m²)" for the table and the workbook. */
  const officeLabel = useMemo(() => {
    const map = new Map(offices.map((o) => [o.id, o]));
    const names = new Map(buildings.map((b) => [b.id, b.name]));
    return (id?: string) => {
      if (!id) return "Tanlanmagan";
      const office = map.get(id);
      if (!office) return id;
      return `${names.get(office.buildingId) ?? ""} — Ofis ${office.roomNo} (${office.area} m²)`;
    };
  }, [offices, buildings]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return leads
      .filter((l) => tab === "all" || l.status === tab)
      .filter(
        (l) =>
          !needle ||
          l.name.toLowerCase().includes(needle) ||
          l.phone.includes(needle) ||
          l.id.toLowerCase().includes(needle),
      );
  }, [leads, tab, query]);

  const counts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      confirmed: leads.filter((l) => l.status === "confirmed").length,
      rejected: leads.filter((l) => l.status === "rejected").length,
    }),
    [leads],
  );

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return leads.filter((l) => new Date(l.createdAt).toDateString() === today).length;
  }, [leads]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const review = (id: string, status: LeadStatus) => {
    setStatus(id, status);
    onChanged();
    setOpen(null);
    flash(status === "confirmed" ? "Ariza tasdiqlandi" : "Ariza rad etildi");
  };

  const drop = (id: string) => {
    removeLead(id);
    onChanged();
    setOpen(null);
    flash("Ariza o'chirildi");
  };

  /** Exports the whole list, so today's file replaces yesterday's. */
  const download = () => {
    if (leads.length === 0) {
      flash("Eksport qilishga ariza yo'q");
      return;
    }
    exportLeads(leads, officeLabel);
    markExported(leads.map((l) => l.id));
    onChanged();
    flash(`${leads.length} ta ariza Excelga yozildi`);
  };

  /** Reads a previous export back and merges it — this is what makes the file cumulative. */
  const upload = async (file: File) => {
    try {
      const rows = await importLeads(file);
      if (rows.length === 0) {
        flash("Faylda tanish ustunlar topilmadi");
        return;
      }
      const { added, skipped } = mergeLeads(rows);
      onChanged();
      flash(
        added > 0
          ? `${added} ta ariza qo'shildi${skipped ? `, ${skipped} tasi allaqachon bor edi` : ""}`
          : "Hamma arizalar allaqachon ro'yxatda",
      );
    } catch {
      flash("Faylni o'qib bo'lmadi");
    }
  };

  return (
    <>
      <header className="admin-head">
        <div>
          <h1 className="display admin-title">Arizalar</h1>
          <p className="lede" style={{ fontSize: 14, marginTop: 6 }}>
            Yangi arizalarni tasdiqlang, keyin hammasini bitta Excel faylga yuklang.
          </p>
        </div>

        <div className="admin-actions">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
          />
          <Button onClick={() => fileRef.current?.click()}>
            <Icon name="layers" size={15} />Excelni yuklash
          </Button>
          <Button variant="primary" onClick={download}>
            <Icon name="doc" size={15} />Excelga saqlash
          </Button>
        </div>
      </header>

      <div className="admin-stats">
        <div className="admin-stat">
          <span>Yangi arizalar</span>
          <b className="figure">{counts.new}</b>
        </div>
        <div className="admin-stat">
          <span>Tasdiqlangan</span>
          <b className="figure">{counts.confirmed}</b>
        </div>
        <div className="admin-stat">
          <span>Bugun kelgan</span>
          <b className="figure">{todayCount}</b>
        </div>
        <div className="admin-stat">
          <span>Jami</span>
          <b className="figure">{counts.all}</b>
        </div>
      </div>

      <div className="admin-tabs" role="tablist">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className="admin-tab"
            onClick={() => setTab(key)}
          >
            {label}
            <span className="admin-tab-count">{counts[key]}</span>
          </button>
        ))}

        <div className="admin-search">
          <Icon name="search" size={15} className="admin-search-icon" />
          <Input
            placeholder="Ism, telefon yoki ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Arizalarni qidirish"
          />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-scroll thin-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sana</th>
                <th>Ism</th>
                <th>Telefon</th>
                <th>Ofis</th>
                <th>Turi</th>
                <th>Holati</th>
                <th aria-label="Amallar" />
              </tr>
            </thead>
            <tbody>
              {visible.map((lead) => (
                <tr key={lead.id}>
                  <td className="dim">
                    {new Date(lead.createdAt).toLocaleDateString("uz-UZ")}
                    <span className="admin-time">
                      {new Date(lead.createdAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                  <td className="strong">{lead.name}</td>
                  <td>
                    <a href={`tel:${lead.phone}`} className="admin-phone">{prettyPhone(lead.phone)}</a>
                  </td>
                  <td className="dim admin-office">{officeLabel(lead.officeId)}</td>
                  <td className="dim">{lead.type === "finder" ? "Topib berish" : "Ko'rish"}</td>
                  <td>
                    <Badge tone={STATUS[lead.status].tone}>{STATUS[lead.status].label}</Badge>
                  </td>
                  <td className="admin-row-actions">
                    {lead.status === "new" && (
                      <>
                        <Button size="sm" variant="primary" onClick={() => review(lead.id, "confirmed")}>
                          <Icon name="check" size={14} />Tasdiqlash
                        </Button>
                        <Button size="sm" onClick={() => review(lead.id, "rejected")}>Rad etish</Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setOpen(lead)}>Batafsil</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <div className="admin-empty">
            <Icon name="doc" size={26} />
            <h3>{query ? "Hech narsa topilmadi" : "Bu bo'limda ariza yo'q"}</h3>
            <p>
              {query
                ? "Boshqa ism yoki telefon bilan qidirib ko'ring."
                : "Saytdan ariza kelganda shu yerda paydo bo'ladi."}
            </p>
          </div>
        )}
      </div>

      {toast && <div className="admin-toast" role="status">{toast}</div>}

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} label="Ariza tafsiloti" size="sm">
        {open && (
          <>
            <h2 className="dialog-title">{open.name}</h2>
            <p className="eyebrow">ID: {open.id}</p>

            <dl className="admin-detail">
              <div><dt>Telefon</dt><dd><a href={`tel:${open.phone}`}>{prettyPhone(open.phone)}</a></dd></div>
              <div><dt>Ariza turi</dt><dd>{open.type === "finder" ? "Ofis topib berish" : "Ko'rishga yozilish"}</dd></div>
              <div><dt>Ofis</dt><dd>{officeLabel(open.officeId)}</dd></div>
              {open.date && <div><dt>Qulay sana</dt><dd>{open.date}</dd></div>}
              {open.area && <div><dt>Kerakli maydon</dt><dd>{open.area}</dd></div>}
              {open.budget && <div><dt>Budjet</dt><dd>{open.budget}</dd></div>}
              {open.message && <div><dt>Izoh</dt><dd>{open.message}</dd></div>}
              <div><dt>Manba</dt><dd>{open.utm?.utm_source || "To'g'ridan-to'g'ri"}</dd></div>
              <div>
                <dt>Kelgan vaqti</dt>
                <dd>{new Date(open.createdAt).toLocaleString("uz-UZ")}</dd>
              </div>
            </dl>

            <label className="field" style={{ marginTop: 16 }}>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Menejer izohi</span>
              <textarea
                className="textarea"
                defaultValue={open.note ?? ""}
                placeholder="Masalan: 20-sentabrda ko'rsatildi, o'ylab ko'radi"
                onBlur={(e) => { setNote(open.id, e.target.value); onChanged(); }}
              />
            </label>

            <div className="admin-detail-actions">
              {open.status === "new" ? (
                <>
                  <Button variant="primary" onClick={() => review(open.id, "confirmed")}>
                    <Icon name="check" size={15} />Tasdiqlash
                  </Button>
                  <Button onClick={() => review(open.id, "rejected")}>Rad etish</Button>
                </>
              ) : (
                <Button onClick={() => review(open.id, "new")}>Yangiga qaytarish</Button>
              )}
              <Button variant="ghost" onClick={() => drop(open.id)}>O'chirish</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
