import { useEffect, useRef, type ReactNode } from "react";

/**
 * Thin wrapper over the native <dialog>, which gives us focus trapping,
 * Escape handling and inertness for free. Clicking the backdrop closes it:
 * the dialog element itself fills the viewport, so a click whose target is
 * the dialog (not its content) came from outside the panel.
 */
export function Modal({
  open, onClose, label, size = "lg", children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  size?: "lg" | "sm";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={size === "sm" ? "dialog-sm" : undefined}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="dialog-body thin-scroll">
        <button className="dialog-close" onClick={onClose} aria-label="Yopish" type="button">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M3 3l9 9M12 3l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </dialog>
  );
}
