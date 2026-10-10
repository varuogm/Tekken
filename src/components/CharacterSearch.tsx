"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CHARACTERS } from "@/lib/constants";

type Props = {
  value: string;
  onChange: (characterId: string) => void;
  side: "left" | "right";
};

export function CharacterSearch({ value, onChange, side }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selectedName =
    CHARACTERS.find((c) => c.id === value)?.name ?? "Character";

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHARACTERS.slice(0, 8);
    return CHARACTERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(id: string) {
    onChange(id);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative px-2 pb-2">
      <label className="sr-only" htmlFor={`char-search-${side}`}>
        Search character {side}
      </label>
      <input
        id={`char-search-${side}`}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        placeholder={selectedName}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg)]/90 px-3 py-2 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
      />
      {open && suggestions.length > 0 ? (
        <ul
          className="absolute inset-x-2 top-full z-30 mt-1 max-h-40 overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] shadow-lg"
          role="listbox"
        >
          {suggestions.map((c) => (
            <li key={c.id} role="option" aria-selected={c.id === value}>
              <button
                type="button"
                onClick={() => pick(c.id)}
                className={`flex w-full px-3 py-2 text-left text-sm active:bg-white/5 ${
                  c.id === value ? "text-[var(--gold)]" : "text-white"
                }`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
