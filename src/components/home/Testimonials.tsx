import { TESTIMONIALS } from "../../data/content";

export function Testimonials() {
  return (
    <section className="section" aria-labelledby="t-rev">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Mijozlar</p>
            <h2 className="display" id="t-rev">Ijarachilar nima deydi</h2>
            <p className="lede" style={{ marginTop: 10 }}>
              Quyidagilar — namunaviy matnlar. Haqiqiy sharhlar olingach, shu yerga qo'yiladi.
            </p>
          </div>
        </div>

        <div className="quotes">
          {TESTIMONIALS.map((t) => (
            <blockquote className="quote" key={t.who + t.text.slice(0, 12)}>
              {t.demo && <span className="demo-tag">Demo matn</span>}
              <p>{t.text}</p>
              <cite>{t.who}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
