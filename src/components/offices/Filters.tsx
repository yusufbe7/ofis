import { Checkbox, Field, Select } from "../ui/Field";
import { AREA_OPTIONS, FLOOR_OPTIONS, PRICE_OPTIONS } from "../../lib/filters";
import type { Building, FilterState } from "../../types";

export function Filters({
  value, onChange, buildings,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  buildings: Building[];
}) {
  const set = <K extends keyof FilterState>(key: K, next: FilterState[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <form className="filters" aria-label="Ofislarni saralash" onSubmit={(e) => e.preventDefault()}>
      <Field label="Bino">
        {(p) => (
          <Select {...p} value={value.building} onChange={(e) => set("building", e.target.value)}>
            <option value="">Barcha binolar</option>
            {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
        )}
      </Field>

      <Field label="Maydon">
        {(p) => (
          <Select {...p} value={value.area} onChange={(e) => set("area", e.target.value)}>
            <option value="">Istalgan</option>
            {AREA_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        )}
      </Field>

      <Field label="Oylik narx">
        {(p) => (
          <Select {...p} value={value.price} onChange={(e) => set("price", e.target.value)}>
            <option value="">Istalgan</option>
            {PRICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        )}
      </Field>

      <Field label="Qavat">
        {(p) => (
          <Select {...p} value={value.floor} onChange={(e) => set("floor", e.target.value)}>
            <option value="">Istalgan</option>
            {FLOOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        )}
      </Field>

      <Checkbox checked={value.furnished} onChange={(next) => set("furnished", next)}>
        Jihozlangan
      </Checkbox>
    </form>
  );
}
