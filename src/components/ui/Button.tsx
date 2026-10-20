import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

interface Shared {
  variant?: Variant;
  size?: "md" | "sm";
  block?: boolean;
  children: ReactNode;
  className?: string;
}

const classes = ({ variant = "outline", size = "md", block, className = "" }: Shared) =>
  ["btn", `btn-${variant}`, size === "sm" ? "btn-sm" : "", block ? "btn-block" : "", className]
    .filter(Boolean)
    .join(" ");

export function Button({
  variant, size, block, className, children, ...rest
}: Shared & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={classes({ variant, size, block, className, children })} {...rest}>
      {children}
    </button>
  );
}

/** Same visual language for links — used for tel:, Telegram and anchors. */
export function ButtonLink({
  variant, size, block, className, children, ...rest
}: Shared & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes({ variant, size, block, className, children })} {...rest}>
      {children}
    </a>
  );
}
