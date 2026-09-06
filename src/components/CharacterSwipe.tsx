"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { CharacterImage } from "@/components/CharacterImage";
import { CHARACTERS } from "@/lib/constants";

type Props = {
  value: string;
  onChange: (characterId: string) => void;
  side: "left" | "right";
  priority?: boolean;
};

export function CharacterSwipe({ value, onChange, side, priority }: Props) {
  const index = Math.max(
    0,
    CHARACTERS.findIndex((c) => c.id === value),
  );
  const character = CHARACTERS[index] ?? CHARACTERS[0];
  const startX = useRef<number | null>(null);
  const [dir, setDir] = useState(0);

  const go = useCallback(
    (delta: number) => {
      const next = (index + delta + CHARACTERS.length) % CHARACTERS.length;
      setDir(delta);
      onChange(CHARACTERS[next].id);
    },
    [index, onChange],
  );

  return (
    <div className="relative h-full min-h-[220px] select-none overflow-hidden bg-[var(--bg-panel)]">
      <div
        className="absolute inset-0 touch-pan-y"
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (startX.current == null) return;
          const dx = e.changedTouches[0].clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) < 40) return;
          go(dx < 0 ? 1 : -1);
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "touch") return;
          startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (e.pointerType === "touch" || startX.current == null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) < 40) return;
          go(dx < 0 ? 1 : -1);
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={character.id}
            custom={dir}
            initial={{ opacity: 0, x: dir >= 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir >= 0 ? -40 : 40 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <CharacterImage
              characterId={character.id}
              priority={priority}
              className={side === "left" ? "scale-x-[-1]" : ""}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-[var(--bg)]/80" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-3 z-10 text-center">
        <p className="display text-base tracking-[0.18em] text-white">
          {character.name}
        </p>
      </div>

      <button
        type="button"
        aria-label="Previous character"
        className="absolute left-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--bg)]/70 text-2xl text-white"
        onClick={() => go(-1)}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next character"
        className="absolute right-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--bg)]/70 text-2xl text-white"
        onClick={() => go(1)}
      >
        ›
      </button>
    </div>
  );
}
