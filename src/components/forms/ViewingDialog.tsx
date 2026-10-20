import { useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Field, Input, Select, Textarea } from "../ui/Field";
import { Icon } from "../ui/Icon";
import { useLeadForm } from "../../lib/useLeadForm";
import { todayISO } from "../../lib/format";
import type { Building, Office } from "../../types";

const BLANK = { name: "", phone: "", officeId: "", date: "", message: "" };

export function ViewingDialog({
  open, officeId, offices, buildings, onClose,
}: {
  open: boolean;
  officeId: string;
  offices: Office[];
  buildings: Building[];
  onClose: () => void;
}) {
  const form = useLeadForm("viewing", BLANK);
  const { reset } = form;
  const buildingName = (id: string) => buildings.find((b) => b.id === id)?.name ?? "";

  // Each opening starts clean, pre-selecting the office the visitor came from.
  useEffect(() => {
    if (open) reset({ ...BLANK, officeId });
  }, [open, officeId, reset]);

  return (
    <Modal open={open} onClose={onClose} label="Ko'rishga yozilish" size="sm">
      {form.done ? (
        <div className="success">
          <div className="success-mark"><Icon name="check" size={24} /></div>
          <h3>Arizangiz qabul qilindi</h3>
          <p>Menejer tez orada qo'ng'iroq qilib, ko'rish vaqtini kelishadi.</p>
          <Button style={{ marginTop: 18 }} onClick={onClose}>Yopish</Button>
        </div>
      ) : (
        <>
          <h2 className="dialog-title">Ko'rishga yozilish</h2>
          <p className="lede" style={{ fontSize: 14, marginTop: 6 }}>
            Ism va telefon yetarli. Qolganini menejer siz bilan kelishadi.
          </p>

          <form
            style={{ display: "grid", gap: 14, marginTop: 20 }}
            noValidate
            onSubmit={(e) => { e.preventDefault(); void form.submit(); }}
          >
            <Field label="Ism" error={form.errors.name}>
              {(p) => (
                <Input {...p} autoComplete="name" value={form.values.name}
                  onChange={(e) => form.setValue("name", e.target.value)} />
              )}
            </Field>

            <Field label="Telefon" error={form.errors.phone}>
              {(p) => (
                <Input {...p} type="tel" inputMode="tel" autoComplete="tel"
                  placeholder="+998 90 123 45 67" value={form.values.phone}
                  onChange={(e) => form.setValue("phone", e.target.value)} />
              )}
            </Field>

            <Field label="Ofis">
              {(p) => (
                <Select {...p} value={form.values.officeId}
                  onChange={(e) => form.setValue("officeId", e.target.value)}>
                  <option value="">Hali tanlamadim</option>
                  {offices.map((o) => (
                    <option key={o.id} value={o.id}>
                      {buildingName(o.buildingId)} — Ofis {o.roomNo} ({o.area} m²)
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field label="Qulay sana" error={form.errors.date} hint="Ixtiyoriy — aniq vaqtni menejer kelishadi.">
              {(p) => (
                <Input {...p} type="date" min={todayISO()} value={form.values.date}
                  onChange={(e) => form.setValue("date", e.target.value)} />
              )}
            </Field>

            <Field label="Izoh">
              {(p) => (
                <Textarea {...p} placeholder="Masalan: 5 xodim uchun, ertalab qulay"
                  value={form.values.message}
                  onChange={(e) => form.setValue("message", e.target.value)} />
              )}
            </Field>

            <Button type="submit" variant="primary" block disabled={form.pending}>
              {form.pending ? "Yuborilmoqda…" : "Ko'rishga yozilish"}
            </Button>
          </form>
        </>
      )}
    </Modal>
  );
}
