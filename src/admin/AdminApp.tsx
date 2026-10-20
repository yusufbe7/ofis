import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminShell, type AdminTab } from "./AdminShell";
import { Login } from "./Login";
import { LeadsTable } from "./LeadsTable";
import { OfficesPanel } from "./OfficesPanel";
import { SettingsPanel } from "./SettingsPanel";
import { isSignedIn, signOut } from "../lib/auth";
import { fetchLeads, listLeads, type StoredLead } from "../lib/leadStore";
import { useInventory } from "../lib/useInventory";
import "../styles/admin.css";

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => isSignedIn());
  const [tab, setTab] = useState<AdminTab>("leads");
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const { data } = useInventory();

  const refresh = useCallback(() => setLeads(listLeads()), []);

  useEffect(() => {
    if (!authed) return;
    refresh();
    // When a server is configured its list is authoritative.
    void fetchLeads().then((remote) => { if (remote) setLeads(remote); });
  }, [authed, refresh]);

  const newCount = useMemo(() => leads.filter((l) => l.status === "new").length, [leads]);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <AdminShell
      tab={tab}
      onTab={setTab}
      newCount={newCount}
      onSignOut={() => { signOut(); setAuthed(false); }}
    >
      {tab === "leads" && (
        <LeadsTable
          leads={leads}
          offices={data.offices}
          buildings={data.buildings}
          onChanged={refresh}
        />
      )}
      {tab === "offices" && <OfficesPanel offices={data.offices} buildings={data.buildings} />}
      {tab === "settings" && <SettingsPanel leads={leads} onChanged={refresh} />}
    </AdminShell>
  );
}
