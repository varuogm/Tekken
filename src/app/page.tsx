"use client";

import { useState } from "react";
import { PlayerBanner } from "@/components/PlayerBanner";
import { useLeagueStats } from "@/hooks/useLeagueStats";
import type { LeaderboardEntry, PeriodLeaderboardEntry } from "@/lib/types";

type PeriodFilter = "all" | "today" | "week";

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

function PeriodToggle({
  value,
  onChange,
}: {
  value: PeriodFilter;
  onChange: (v: PeriodFilter) => void;
}) {
  const options: { id: PeriodFilter; label: string }[] = [
    { id: "all", label: "All-time" },
    { id: "today", label: "Today" },
    { id: "week", label: "This week" },
  ];

  return (
    <div className="flex rounded-xl border border-[var(--line)] p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-wider transition ${
            value === opt.id
              ? "bg-[var(--gold)] text-black"
              : "text-[var(--muted)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
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

function PeriodRow({ player }: { player: PeriodLeaderboardEntry }) {
  return (
    <div
      className={`panel w-full rounded-2xl border p-4 ${rankClass(player.rank)}`}
    >
      <div className="flex items-start gap-3">
        <span className="display w-10 text-center text-2xl leading-none">
          {rankMedal(player.rank)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="display truncate text-xl">{player.name}</h3>
            <span className="shrink-0 text-sm font-semibold text-[var(--muted)]">
              {player.matches} {player.matches === 1 ? "match" : "matches"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {player.wins} W · {player.losses} L · {player.winRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data, isLoading, error, isFetching } = useLeagueStats();
  const [selected, setSelected] = useState<LeaderboardEntry | null>(null);
  const [period, setPeriod] = useState<PeriodFilter>("all");
  const champion = data?.leaderboard[0];

  const periodChampion =
    period === "today"
      ? data?.todayLeaderboard[0]
      : period === "week"
        ? data?.weekLeaderboard[0]
        : null;

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
          <div className="mt-6">
            <PeriodToggle value={period} onChange={setPeriod} />
            {period === "today" && data ? (
              <p className="mt-2 text-center text-xs text-[var(--muted)]">
                {data.todayMatchCount}{" "}
                {data.todayMatchCount === 1 ? "match" : "matches"} today
              </p>
            ) : null}
            {period === "week" && data ? (
              <p className="mt-2 text-center text-xs text-[var(--muted)]">
                {data.weekMatchCount}{" "}
                {data.weekMatchCount === 1 ? "match" : "matches"} this week
              </p>
            ) : null}
          </div>

          {period === "all" ? (
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
          ) : period === "today" ? (
            <section className="mt-6 space-y-3 pb-4">
              {periodChampion ? (
                <div className="panel rank-gold rounded-2xl p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
                    Today&apos;s leader
                  </p>
                  <p className="display mt-2 text-2xl">{periodChampion.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {periodChampion.wins} W · {periodChampion.losses} L
                  </p>
                </div>
              ) : null}
              {(data?.todayLeaderboard.length ?? 0) === 0 ? (
                <p className="panel rounded-2xl p-5 text-center text-sm text-[var(--muted)]">
                  No battles today yet.
                </p>
              ) : (
                data?.todayLeaderboard.map((player) => (
                  <PeriodRow key={player.playerId} player={player} />
                ))
              )}
            </section>
          ) : (
            <section className="mt-6 space-y-5 pb-4">
              {periodChampion ? (
                <div className="panel rank-gold rounded-2xl p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
                    Week leader
                  </p>
                  <p className="display mt-2 text-2xl">{periodChampion.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {periodChampion.wins} W · {periodChampion.losses} L
                  </p>
                </div>
              ) : null}
              {(data?.weekByDay.length ?? 0) === 0 ? (
                <p className="panel rounded-2xl p-5 text-center text-sm text-[var(--muted)]">
                  No battles this week yet.
                </p>
              ) : (
                data?.weekByDay.map((day) => (
                  <div key={day.dateKey} className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2 border-l-2 border-[var(--gold)] pl-3">
                      <h2 className="display text-lg text-white">{day.label}</h2>
                      <span className="text-xs text-[var(--muted)]">
                        {day.matchCount}{" "}
                        {day.matchCount === 1 ? "match" : "matches"}
                      </span>
                    </div>
                    {day.leaderboard.length === 0 ? (
                      <p className="text-sm text-[var(--muted)] pl-3">—</p>
                    ) : (
                      day.leaderboard.map((player) => (
                        <PeriodRow key={`${day.dateKey}-${player.playerId}`} player={player} />
                      ))
                    )}
                  </div>
                ))
              )}
            </section>
          )}
        </>
      )}

      {selected ? (
        <PlayerBanner player={selected} onClose={() => setSelected(null)} />
      ) : null}
    </main>
  );
}
