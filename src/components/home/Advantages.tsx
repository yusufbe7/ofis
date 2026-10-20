import { ADVANTAGES } from "../../data/content";
import { Icon } from "../ui/Icon";

export function Advantages() {
  return (
    <section className="section" id="haqida" aria-labelledby="t-why">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Nega biz</p>
            <h2 className="display" id="t-why">Ofis izlashni soddalashtirdik</h2>
          </div>
        </div>

        <div className="advantages">
          {ADVANTAGES.map((a) => (
            <div className="advantage" key={a.title}>
              <Icon name={a.icon} size={26} />
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
