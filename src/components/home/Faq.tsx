import { FAQ } from "../../data/content";

export function Faq() {
  return (
    <section className="section" id="savollar" aria-labelledby="t-faq">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Savollar</p>
            <h2 className="display" id="t-faq">Ko'p beriladigan savollar</h2>
          </div>
        </div>

        <div className="faq">
          {FAQ.map((item) => (
            <details key={item.q} name="faq">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
