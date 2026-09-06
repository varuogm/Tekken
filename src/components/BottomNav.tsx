"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "🏆" },
  { href: "/match", label: "Match", icon: "⚔️" },
  { href: "/stats", label: "Stats", icon: "📊" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--bg)]"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-3">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-3 text-[11px] font-semibold tracking-wide transition ${
                active ? "text-[var(--gold)]" : "text-[var(--muted)]"
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
