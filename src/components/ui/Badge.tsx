import type { ReactNode } from "react";

type Tone = "free" | "soon" | "neutral";

export function Badge({ tone = "neutral", dot = true, children }: { tone?: Tone; dot?: boolean; children: ReactNode }) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
