"use client";

import { useState } from "react";
import { PlayerBanner } from "@/components/PlayerBanner";
import { useLeagueStats } from "@/hooks/useLeagueStats";
import type { LeaderboardEntry } from "@/lib/types";

function rankMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return String(rank);
}

function rankClass(rank: number) {
  if (rank === 1) return "rank-gold";
  if (rank === 2) return "rank-silver";
  if (rank === 3) return "rank-bronze";
  return "";
}

function streakLabel(streak: number) {
  if (streak > 0) return `🔥 ${streak} win streak`;
  if (streak < 0) return `💀 ${Math.abs(streak)} loss streak`;
  return "—";
}

function PlayerRow({
  player,
  onSelect,
}: {
  player: LeaderboardEntry;
  onSelect: (p: LeaderboardEntry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(player)}
      className={`panel w-full rounded-2xl border p-4 text-left transition active:scale-[0.99] ${rankClass(player.rank)}`}
    >
      <div className="flex items-start gap-3">
        <span className="display w-10 text-center text-2xl leading-none">
          {rankMedal(player.rank)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="display truncate text-xl">{player.name}</h3>
            <span className="shrink-0 text-lg font-bold text-[var(--gold)]">
              {player.trophies} 🏆
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {player.wins} W · {player.losses} L · {player.winRate.toFixed(1)}%
          </p>
          <p className="mt-1 text-sm">{streakLabel(player.currentStreak)}</p>
        </div>
      </div>
    </button>
  );
}

export default function HomePage() {
  const { data, isLoading, error, isFetching } = useLeagueStats();
  const [selected, setSelected] = useState<LeaderboardEntry | null>(null);
  const champion = data?.leaderboard[0];

  return (
    <main className="page-shell mx-auto max-w-lg px-4">
      <header className="text-center">
        <h1 className="display text-4xl text-[var(--gold)]">Tekken League</h1>
        {isFetching && !isLoading ? (
          <p className="mt-2 text-xs text-[var(--muted)]">Refreshing…</p>
        ) : null}
      </header>

      {isLoading ? (
        <p className="mt-16 text-center text-[var(--muted)]">Loading arena…</p>
      ) : error ? (
        <div className="panel mt-10 rounded-2xl p-5 text-center">
          <p className="text-[var(--lose)]">Could not load leaderboard.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Check Supabase env vars and run <code>supabase/schema.sql</code>.
          </p>
        </div>
      ) : (
        <>
          {champion && (data?.totalMatches ?? 0) > 0 ? (
            <section className="panel rank-gold mt-8 rounded-3xl p-5 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
                Current Champion
              </p>
              <p className="display mt-3 text-3xl">👑 {champion.name}</p>
              <p className="mt-2 text-xl font-semibold text-[var(--gold-soft)]">
                {champion.trophies} Trophies
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {champion.wins} W · {champion.losses} L
              </p>
            </section>
          ) : (
            <section className="panel mt-8 rounded-3xl p-5 text-center">
              <p className="display text-xl">No matches yet</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Record the first battle on the Match tab.
              </p>
            </section>
          )}

          <div className="my-6 h-px bg-[var(--line)]" />

          <section className="space-y-3 pb-4">
            {data?.leaderboard.map((player) => (
              <PlayerRow
                key={player.playerId}
                player={player}
                onSelect={setSelected}
              />
            ))}
          </section>
        </>
      )}

      {selected ? (
        <PlayerBanner player={selected} onClose={() => setSelected(null)} />
      ) : null}
    </main>
  );
}
