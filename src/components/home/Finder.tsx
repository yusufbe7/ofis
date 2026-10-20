import { forwardRef } from "react";
import { Button } from "../ui/Button";
import { Field, Input, Select, Textarea } from "../ui/Field";
import { Icon } from "../ui/Icon";
import { useLeadForm } from "../../lib/useLeadForm";

const BLANK = { name: "", phone: "", area: "", budget: "", message: "" };

/**
 * The fallback path: when nothing in the listing fits, the visitor leaves their
 * requirements instead of leaving the site.
 */
export const Finder = forwardRef<HTMLDivElement>(function Finder(_props, ref) {
  const form = useLeadForm("finder", BLANK);

  return (
    <section className="section" style={{ paddingTop: 0 }} aria-labelledby="t-find">
      <div className="wrap">
        <div className="finder" ref={ref} id="talab">
          <div>
            <p className="eyebrow">Yordam</p>
            <h2 className="display" id="t-find">Qaysi ofis mosligini bilmayapsizmi?</h2>
            <p className="lede">
              Talablaringizni qoldiring. Hozir bo'sh variantlardan mosini tanlab,
              bo'shaydiganlari haqida ham xabar beramiz.
            </p>
          </div>

          {form.done ? (
            <div className="success">
              <div className="success-mark"><Icon name="check" size={24} /></div>
              <h3>So'rovingiz qabul qilindi</h3>
              <p>Menejerimiz ish vaqtida bog'lanib, mos variantlarni taklif qiladi.</p>
            </div>
          ) : (
            <form
              className="finder-form"
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

              <Field label="Kerakli maydon">
                {(p) => (
                  <Select {...p} value={form.values.area}
                    onChange={(e) => form.setValue("area", e.target.value)}>
                    <option value="">Aniq emas</option>
                    <option>30 m² gacha</option>
                    <option>30–50 m²</option>
                    <option>50–80 m²</option>
                    <option>80 m² dan katta</option>
                  </Select>
                )}
              </Field>

              <Field label="Taxminiy budjet">
                {(p) => (
                  <Select {...p} value={form.values.budget}
                    onChange={(e) => form.setValue("budget", e.target.value)}>
                    <option value="">Aniq emas</option>
                    <option>6 mln gacha</option>
                    <option>6–10 mln</option>
                    <option>10–15 mln</option>
                    <option>15 mln dan yuqori</option>
                  </Select>
                )}
              </Field>

              <Field label="Izoh" className="span-2">
                {(p) => (
                  <Textarea {...p} placeholder="Masalan: 5 xodim uchun, metroga yaqin"
                    value={form.values.message}
                    onChange={(e) => form.setValue("message", e.target.value)} />
                )}
              </Field>

              <Button type="submit" variant="primary" block className="span-2" disabled={form.pending}>
                {form.pending ? "Yuborilmoqda…" : "Menga ofis topib bering"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
});
