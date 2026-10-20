import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Building } from "../../types";

/**
 * Live map, OpenStreetMap data rendered through CARTO's dark basemap.
 * No API key and no account — the attribution below is the licence condition.
 *
 * To swap in Yandex or Google later, replace <TileLayer> (and the attribution)
 * with that provider's layer; the markers and selection logic stay as they are.
 */
const TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

/** Letter markers (A, B, C…) so the list and the map share one vocabulary. */
function pinIcon(letter: string, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="pin ${active ? "pin-on" : ""}"><span>${letter}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26],
  });
}

/**
 * Pans to the selected building. The first render is skipped on purpose so the
 * map opens wide enough to show every location — it only closes in once the
 * visitor actually picks one.
 */
function FlyTo({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    map.flyTo([lat, lng], zoom, { duration: 0.8 });
  }, [map, lat, lng, zoom]);
  return null;
}

/** Keeps the canvas correct when the container is resized or revealed. */
function Resizer() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    const timer = setTimeout(fix, 150);
    window.addEventListener("resize", fix);
    return () => { clearTimeout(timer); window.removeEventListener("resize", fix); };
  }, [map]);
  return null;
}

export function LocationMap({
  buildings, selectedId, onSelect, vacancies,
}: {
  buildings: Building[];
  selectedId: string;
  onSelect: (id: string) => void;
  vacancies: Record<string, number>;
}) {
  const selected = buildings.find((b) => b.id === selectedId) ?? buildings[0];

  // Centre on the mean position so every building is in frame on first paint.
  const center = useMemo<[number, number]>(() => {
    const lat = buildings.reduce((sum, b) => sum + b.lat, 0) / buildings.length;
    const lng = buildings.reduce((sum, b) => sum + b.lng, 0) / buildings.length;
    return [lat, lng];
  }, [buildings]);

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={TILES} attribution={ATTRIBUTION} maxZoom={19} />
      <Resizer />
      {selected && <FlyTo lat={selected.lat} lng={selected.lng} zoom={14} />}

      {buildings.map((b, i) => (
        <Marker
          key={b.id}
          position={[b.lat, b.lng]}
          icon={pinIcon(String.fromCharCode(65 + i), b.id === selectedId)}
          eventHandlers={{ click: () => onSelect(b.id) }}
        >
          <Popup>
            <strong style={{ display: "block", fontSize: 14 }}>{b.name}</strong>
            <span style={{ color: "#9c9ca5" }}>{b.district}</span>
            <br />
            <span style={{ color: "#d6ae6b", fontWeight: 600 }}>
              {vacancies[b.id] ?? 0} ta bo'sh ofis
            </span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

/** Single-location map for the office detail dialog. */
export function DetailMap({ building }: { building: Building }) {
  return (
    <MapContainer
      center={[building.lat, building.lng]}
      zoom={15}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      doubleClickZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={TILES} attribution={ATTRIBUTION} maxZoom={19} />
      <Resizer />
      <Marker position={[building.lat, building.lng]} icon={pinIcon("•", true)} />
    </MapContainer>
  );
}
