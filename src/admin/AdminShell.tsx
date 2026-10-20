import type { ReactNode } from "react";
import { CONFIG } from "../data/config";
import { Icon, type IconName } from "../components/ui/Icon";

export type AdminTab = "leads" | "offices" | "settings";

const NAV: { id: AdminTab; label: string; icon: IconName }[] = [
  { id: "leads", label: "Arizalar", icon: "doc" },
  { id: "offices", label: "Ofislar", icon: "grid" },
  { id: "settings", label: "Sozlamalar", icon: "layers" },
];

export function AdminShell({
  tab, onTab, onSignOut, newCount, children,
}: {
  tab: AdminTab;
  onTab: (next: AdminTab) => void;
  onSignOut: () => void;
  newCount: number;
  children: ReactNode;
}) {
  return (
    <div className="admin">
      <aside className="admin-side">
        <a className="logo admin-logo" href="/">
          <span className="logo-mark" aria-hidden="true">P</span>
          <span className="logo-text">{CONFIG.brand}</span>
        </a>
        <p className="admin-badge">Boshqaruv</p>

        <nav className="admin-nav" aria-label="Boshqaruv menyusi">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className="admin-nav-item"
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => onTab(item.id)}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
              {item.id === "leads" && newCount > 0 && (
                <span className="admin-nav-count">{newCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-side-foot">
          <a className="admin-nav-item" href="/">
            <Icon name="arrow" size={17} className="flip" />
            <span>Saytni ochish</span>
          </a>
          <button type="button" className="admin-nav-item" onClick={onSignOut}>
            <Icon name="close" size={17} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">{children}</div>
    </div>
  );
}
