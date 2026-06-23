"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Shared modal shell — a fixed-position dialog (escapes any overflow/stacking
 * context, so it never clips), Esc-to-close, click-backdrop-to-close, and a
 * locked background scroll while open. Children supply the body (and any
 * footer). Used by the calendar and goals surfaces so modals share one
 * vocabulary across the app.
 */
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="popover-in max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface shadow-xl sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
          <h2 className="font-display text-lg font-medium text-navy-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
