"use client";

import { CharacterImage } from "@/components/CharacterImage";
import { getCharacterName } from "@/lib/constants";
import type { MatchWithPlayers } from "@/lib/types";

type Props = {
  match: MatchWithPlayers;
  indexLabel?: string;
  onClose: () => void;
};

export function MatchScorecard({ match, indexLabel, onClose }: Props) {
  const date = new Date(match.created_at);

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-[var(--bg)]/95 p-4">
      <div className="w-full max-w-md">
        <p className="display text-center text-sm tracking-[0.3em] text-[var(--muted)]">
          Battle {indexLabel ?? `#${match.id.slice(0, 4)}`}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <div className="relative h-48 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-panel)]">
            <CharacterImage characterId={match.player1_character} />
            <div className="absolute inset-x-0 bottom-0 bg-black/80 p-3 text-center">
              <p className="text-xs uppercase tracking-wider text-white/60">
                {getCharacterName(match.player1_character)}
              </p>
              <p className="display text-xl">{match.player1.name}</p>
            </div>
          </div>
          <div className="relative h-48 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-panel)]">
            <CharacterImage characterId={match.player2_character} />
            <div className="absolute inset-x-0 bottom-0 bg-black/80 p-3 text-center">
              <p className="text-xs uppercase tracking-wider text-white/60">
                {getCharacterName(match.player2_character)}
              </p>
              <p className="display text-xl">{match.player2.name}</p>
            </div>
          </div>
        </div>

        <div className="my-5 text-center">
          <p className="display text-2xl text-[var(--accent)]">VS</p>
        </div>

        <div className="rounded-2xl border border-[var(--gold)]/40 bg-[var(--bg-panel)] px-4 py-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
            Winner
          </p>
          <p className="display mt-2 text-3xl text-[var(--gold-soft)]">
            {match.winner.name} Wins
          </p>
        </div>

        {match.comment ? (
          <p className="mt-4 text-center text-sm italic text-white/60">
            “{match.comment}”
          </p>
        ) : null}

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          {date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          <br />
          {date.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 min-h-[52px] w-full rounded-xl border border-[var(--line)] py-3 font-semibold uppercase tracking-wider"
        >
          Close
        </button>
      </div>
    </div>
  );
}
