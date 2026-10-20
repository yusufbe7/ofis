import { useMemo } from "react";
import { Badge } from "../components/ui/Badge";
import { Icon } from "../components/ui/Icon";
import { fmtSum } from "../lib/format";
import { PUBLIC_STATUS } from "../data/config";
import type { Building, Office } from "../types";

/**
 * Read-only inventory view. Editing offices means editing src/data/offices.ts —
 * there is no database to write to, so the panel shows the truth rather than
 * offering a save button that would silently do nothing.
 */
export function OfficesPanel({ offices, buildings }: { offices: Office[]; buildings: Building[] }) {
  const names = useMemo(
    () => new Map(buildings.map((b) => [b.id, b.name])),
    [buildings],
  );

  const vacant = offices.filter((o) => o.status === PUBLIC_STATUS).length;
  const revenue = offices
    .filter((o) => o.status !== PUBLIC_STATUS)
    .reduce((sum, o) => sum + o.monthlyRent, 0);

  return (
    <>
      <header className="admin-head">
        <div>
          <h1 className="display admin-title">Ofislar</h1>
          <p className="lede" style={{ fontSize: 14, marginTop: 6 }}>
            Saytdagi butun inventar. O'zgartirish uchun <code>src/data/offices.ts</code> faylini tahrirlang.
          </p>
        </div>
      </header>

      <div className="admin-stats">
        <div className="admin-stat">
          <span>Jami ofis</span>
          <b className="figure">{offices.length}</b>
        </div>
        <div className="admin-stat">
          <span>Bo'sh</span>
          <b className="figure">{vacant}</b>
        </div>
        <div className="admin-stat">
          <span>Band</span>
          <b className="figure">{offices.length - vacant}</b>
        </div>
        <div className="admin-stat">
          <span>Band ofislardan oylik</span>
          <b className="figure">{fmtSum(revenue)}</b>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-scroll thin-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Xona ID</th>
                <th>Bino</th>
                <th>Ofis</th>
                <th>Maydon</th>
                <th>Qavat</th>
                <th>Oylik narx</th>
                <th>Holati</th>
                <th>Mavjud</th>
              </tr>
            </thead>
            <tbody>
              {offices.map((o) => (
                <tr key={o.id}>
                  <td className="dim mono">{o.roomId}</td>
                  <td>{names.get(o.buildingId)}</td>
                  <td className="strong">Ofis {o.roomNo}</td>
                  <td>{o.area} m²</td>
                  <td className="dim">{o.floor}-qavat</td>
                  <td className="strong">{fmtSum(o.monthlyRent)}</td>
                  <td>
                    {o.status === PUBLIC_STATUS
                      ? <Badge tone="free">Bo'sh</Badge>
                      : <Badge tone="neutral">{o.status}</Badge>}
                  </td>
                  <td className="dim">{o.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="admin-note">
        <Icon name="layers" size={14} />
        Ofisni saytdan yashirish uchun o'chirish shart emas — <code>status</code> ni
        <code>"Band"</code> qilsangiz, ro'yxatdan chiqib ketadi.
      </p>
    </>
  );
}
