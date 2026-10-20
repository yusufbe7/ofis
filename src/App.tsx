import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { MobileBar } from "./components/layout/MobileBar";
import { Hero } from "./components/home/Hero";
import { Stats } from "./components/home/Stats";
import { Buildings } from "./components/home/Buildings";
import { Advantages } from "./components/home/Advantages";
import { Finder } from "./components/home/Finder";
import { Testimonials } from "./components/home/Testimonials";
import { Faq } from "./components/home/Faq";
import { Closing } from "./components/home/Closing";
import { Locations } from "./components/map/Locations";
import { BuildingExplorer } from "./components/building/BuildingExplorer";
import { OfficeSection } from "./components/offices/OfficeSection";
import { OfficeDialog } from "./components/offices/OfficeDialog";
import { ViewingDialog } from "./components/forms/ViewingDialog";
import { publicOffices, useInventory, vacancyByBuilding } from "./lib/useInventory";
import { track } from "./lib/analytics";
import { EMPTY_FILTERS, type FilterState } from "./types";

export default function App() {
  const { data, error } = useInventory();
  const { buildings } = data;

  const offices = useMemo(() => publicOffices(data.offices), [data.offices]);
  const vacancies = useMemo(() => vacancyByBuilding(data.offices), [data.offices]);
  const byId = useMemo(
    () => Object.fromEntries(buildings.map((b) => [b.id, b])),
    [buildings],
  );

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [openOfficeId, setOpenOfficeId] = useState<string | null>(null);
  const [booking, setBooking] = useState<{ open: boolean; officeId: string }>({ open: false, officeId: "" });
  const finderRef = useRef<HTMLDivElement>(null);

  const openOffice = useMemo(
    () => offices.find((o) => o.id === openOfficeId) ?? null,
    [offices, openOfficeId],
  );

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  /* ---- Office detail is addressable: /#ofis-O3 opens that office ---- */
  const showOffice = useCallback((id: string) => {
    setOpenOfficeId(id);
    const office = offices.find((o) => o.id === id);
    if (office) {
      track("office_view", {
        officeId: office.id,
        buildingId: office.buildingId,
        price: office.monthlyRent,
      });
      history.replaceState(null, "", `#ofis-${id}`);
    }
  }, [offices]);

  const closeOffice = useCallback(() => {
    setOpenOfficeId(null);
    if (location.hash.startsWith("#ofis-")) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }, []);

  useEffect(() => {
    const fromHash = () => {
      const match = location.hash.match(/^#ofis-(.+)$/);
      if (match && offices.some((o) => o.id === match[1])) setOpenOfficeId(match[1]);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [offices]);

  /* ---- Booking ---- */
  const book = useCallback((officeId = "") => {
    setOpenOfficeId(null);
    setBooking({ open: true, officeId });
    track("viewing_open", { officeId: officeId || null });
  }, []);

  /* ---- Filtering ---- */
  const applyAndScroll = useCallback((next: FilterState) => {
    setFilters(next);
    track("office_filter", { ...next });
    scrollTo("ofislar");
  }, []);

  const filterByBuilding = useCallback((buildingId: string) => {
    applyAndScroll({ ...EMPTY_FILTERS, building: buildingId });
  }, [applyAndScroll]);

  /** From the floor stack. Floor 0 means "the whole building". */
  const filterByFloor = useCallback((buildingId: string, floor: number) => {
    applyAndScroll({
      ...EMPTY_FILTERS,
      building: buildingId,
      floor: floor > 0 ? `${floor}-${floor}` : "",
    });
  }, [applyAndScroll]);

  const askForHelp = useCallback(() => {
    finderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <>
      <a
        href="#ofislar"
        className="btn btn-outline"
        style={{ position: "absolute", left: -9999, top: 8, zIndex: 100 }}
        onFocus={(e) => { e.currentTarget.style.left = "16px"; }}
        onBlur={(e) => { e.currentTarget.style.left = "-9999px"; }}
      >
        Asosiy mazmunga o'tish
      </a>

      <div id="top" />
      <Header onBook={() => book()} />

      <main>
        <Hero
          buildings={buildings}
          offices={offices}
          onSearch={applyAndScroll}
          onBook={() => book()}
          onOpenOffice={showOffice}
        />

        <Stats buildings={buildings.length} total={data.offices.length} vacant={offices.length} />

        {error && (
          <div className="wrap" style={{ marginTop: 28 }}>
            <p className="badge badge-soon" role="status">{error}</p>
          </div>
        )}

        <OfficeSection
          offices={offices}
          buildings={buildings}
          filters={filters}
          onFilters={setFilters}
          onOpen={showOffice}
          onBook={book}
          onAskHelp={askForHelp}
        />

        <BuildingExplorer
          buildings={buildings}
          offices={offices}
          onPickFloor={filterByFloor}
        />

        <Buildings buildings={buildings} vacancies={vacancies} onSelect={filterByBuilding} />
        <Advantages />
        <Finder ref={finderRef} />
        <Locations buildings={buildings} vacancies={vacancies} onShowOffices={filterByBuilding} />
        <Testimonials />
        <Faq />
        <Closing onBook={() => book()} />
      </main>

      <Footer buildings={buildings} />
      <MobileBar onBook={() => book()} />

      <OfficeDialog
        office={openOffice}
        building={openOffice ? byId[openOffice.buildingId] ?? null : null}
        onClose={closeOffice}
        onBook={book}
      />

      <ViewingDialog
        open={booking.open}
        officeId={booking.officeId}
        offices={offices}
        buildings={buildings}
        onClose={() => setBooking({ open: false, officeId: "" })}
      />
    </>
  );
}
