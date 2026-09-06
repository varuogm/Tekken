"use client";

import { CharacterImage } from "@/components/CharacterImage";
import type { LeaderboardEntry } from "@/lib/types";

type Props = {
  player: LeaderboardEntry;
  onClose: () => void;
};

export function PlayerBanner({ player, onClose }: Props) {
  const characterId = player.favoriteCharacter ?? "kazuya";

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close banner"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--gold)]/40 shadow-[0_0_40px_rgba(240,193,75,0.2)]">
        <div className="relative h-44">
          <CharacterImage characterId={characterId} className="object-top" />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              Rank #{player.rank}
            </p>
            <h3 className="display text-3xl text-white">{player.name}</h3>
            <p className="mt-1 text-lg font-semibold text-[var(--gold-soft)]">
              {player.trophies} 🏆
            </p>
            <p className="mt-1 text-sm text-white/70">
              {player.wins}W · {player.losses}L · {player.winRate.toFixed(1)}%
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[var(--bg-panel)] py-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
