"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ open, title, onClose, children }: Props) {
  const [mounted, setMounted] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close"
        className={`absolute inset-0 bg-black/70 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={`absolute inset-x-0 bottom-0 mx-auto max-w-lg rounded-t-3xl border border-white/10 bg-[#12121c] px-4 pb-[calc(1.25rem+var(--safe-bottom))] pt-3 shadow-2xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        onTransitionEnd={() => {
          if (!open) setMounted(false);
        }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <h3 className="display mb-4 text-center text-lg text-[var(--gold)]">
          {title}
        </h3>
        <div className="max-h-[55dvh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
